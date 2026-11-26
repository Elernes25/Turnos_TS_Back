import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { WebSocket, WebSocketServer } from 'ws';
import { Rol } from '../interfaces/Rol.enum.js';
import type { ITurno } from './types/Turno.interface.js';

const websocketPath = '/api/v1/ws/turnos';
const authorizedRoles = new Set<string>([Rol.ADMIN, Rol.MEDICO, Rol.RECEPCIONISTA]);
const clients = new Set<WebSocket>();
const webSocketServer = new WebSocketServer({ noServer: true, maxPayload: 8192 });

const normalizeOrigin = (value: string): string | undefined => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
};

const getAllowedOrigins = (): Set<string> => {
  const configuredOrigins = process.env.WS_ALLOWED_ORIGINS;
  if (configuredOrigins !== undefined) {
    return new Set(
      configuredOrigins
        .split(',')
        .map(origin => normalizeOrigin(origin.trim()))
        .filter((origin): origin is string => origin !== undefined)
    );
  }

  const entorno = process.env.ENTORNO?.toLowerCase();
  const isProduction = process.env.NODE_ENV === 'production'
    || entorno === 'production'
    || entorno === 'produccion'
    || entorno === 'prod';

  return new Set(isProduction ? [] : [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ]);
};

const rejectUpgrade = (socket: import('node:stream').Duplex, status: number, message: string) => {
  socket.write(`HTTP/1.1 ${status} ${message}\r\nConnection: close\r\n\r\n`);
  socket.destroy();
};

export const attachTurnosWebSocket = (server: Server): void => {
  const allowedOrigins = getAllowedOrigins();

  server.on('upgrade', (request, socket, head) => {
    let requestUrl: URL;
    try {
      requestUrl = new URL(request.url ?? '/', 'http://localhost');
    } catch {
      rejectUpgrade(socket, 400, 'Bad Request');
      return;
    }

    if (requestUrl.pathname !== websocketPath) {
      rejectUpgrade(socket, 404, 'Not Found');
      return;
    }

    const origin = request.headers.origin;
    if (!origin || !allowedOrigins.has(normalizeOrigin(origin) ?? '')) {
      console.warn(`[WS turnos] Upgrade rechazado; origen no permitido: ${origin ?? '(sin Origin)'}`);
      rejectUpgrade(socket, 403, 'Forbidden');
      return;
    }

    webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
      webSocketServer.emit('connection', webSocket, request);
    });
  });

  webSocketServer.on('error', (error) => {
    console.error('Error en el servidor WebSocket de turnos:', error.message);
  });

  webSocketServer.on('connection', (webSocket, request) => {
    console.log(`[WS turnos] Cliente conectado desde ${request.headers.origin ?? '(sin Origin)'}`);
    let authenticated = false;
    let expiryTimer: ReturnType<typeof setTimeout> | undefined;

    const authenticationTimer = setTimeout(() => {
      console.warn('[WS turnos] Conexión cerrada: no llegó el mensaje de autenticación en 10 segundos.');
      webSocket.close(1008, 'Authentication required');
    }, 10_000);

    webSocket.on('message', (data, isBinary) => {
      console.log(`[WS turnos] Mensaje recibido (${isBinary ? 'binario' : 'texto'}).`);
      if (authenticated || isBinary) {
        console.warn('[WS turnos] Mensaje inesperado; se cierra la conexión.');
        webSocket.close(1008, 'Unexpected message');
        return;
      }

      let message: unknown;
      try {
        message = JSON.parse(data.toString());
      } catch {
        console.warn('[WS turnos] Mensaje JSON inválido.');
        webSocket.close(1008, 'Invalid authentication message');
        return;
      }

      if (
        typeof message !== 'object'
        || message === null
        || !('type' in message)
        || message.type !== 'authenticate'
        || !('token' in message)
        || typeof message.token !== 'string'
      ) {
        console.warn('[WS turnos] El mensaje no tiene el formato de autenticación esperado.');
        webSocket.close(1008, 'Invalid authentication message');
        return;
      }

      console.log('[WS turnos] Solicitud de autenticación recibida.');
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('JWT_SECRET no está configurado; no se puede autenticar WebSocket.');
        webSocket.close(1011, 'Authentication unavailable');
        return;
      }

      let claims: string | JwtPayload;
      try {
        claims = jwt.verify(message.token, secret);
      } catch {
        console.warn('[WS turnos] Autenticación rechazada: JWT inválido o expirado.');
        webSocket.close(1008, 'Invalid or expired token');
        return;
      }

      if (
        typeof claims === 'string'
        || claims.activo !== true
        || typeof claims.rol !== 'string'
        || typeof claims.exp !== 'number'
        || !authorizedRoles.has(claims.rol)
      ) {
        console.warn('[WS turnos] Autenticación rechazada: usuario inactivo o rol no autorizado.');
        webSocket.close(1008, 'Not authorized');
        return;
      }

      authenticated = true;
      clearTimeout(authenticationTimer);
      clients.add(webSocket);
      console.log(`[WS turnos] Cliente autenticado correctamente; rol: ${claims.rol}.`);
      webSocket.send(JSON.stringify({ type: 'authenticated' }));

      if (typeof claims.exp === 'number') {
        const millisecondsUntilExpiry = Math.max(0, claims.exp * 1000 - Date.now());
        expiryTimer = setTimeout(() => {
          clients.delete(webSocket);
          webSocket.close(1008, 'Token expired');
        }, Math.min(millisecondsUntilExpiry, 2_147_483_647));
      }
    });

    webSocket.on('close', () => {
      clearTimeout(authenticationTimer);
      if (expiryTimer) clearTimeout(expiryTimer);
      clients.delete(webSocket);
      console.log(`[WS turnos] Cliente desconectado (autenticado: ${authenticated}).`);
    });

    webSocket.on('error', (error) => {
      console.error('Error en conexión WebSocket de turnos:', error.message);
    });
  });
};

export const emitirTurnoAtendido = (turno: ITurno): void => {
  const event = JSON.stringify({
    type: 'turno_actualizado',
    turno: turno.toJSON()
  });

  let recipients = 0;
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(event);
      recipients++;
    }
  }
  console.log(`[WS turnos] Evento turno_actualizado enviado a ${recipients} cliente(s).`);
};
