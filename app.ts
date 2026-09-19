//import 'dotenv/config'; /*carga las variables de entorno desde el archivo .env*/
// Es la forma más corta y directa.
// Importa el paquete y ejecuta automáticamente config() al cargar el módulo.
// No te da acceso al objeto dotenv porque no lo estás guardando en una variable.
// Ideal si solo querés cargar las variables de entorno y no vas a usar nada más de dotenv

import * as dotenv from 'dotenv';
dotenv.config();
// Es la forma explícita y flexible.
// Te permite acceder al objeto dotenv si en algún momento querés usar otras funciones además de config().
// Es más común en proyectos grandes donde se necesita configurar rutas personalizadas o debug.
// import * as dotenv from 'dotenv';
// dotenv.config({ path: './src/.env' });

import cors from 'cors';
import express from 'express'; /*importa el módulo express para crear el servidor web*/
import type {Application} from 'express';

import {connectDB} from './src/config/database'; /*importa la función connectDB para conectar a la base de datos*/

const app: Application = express();

connectDB(); /*conecta a la base de datos usando la función connectDB del archivo database.js*/

//import auditoriaMiddleware  from'./src/middlewares/auditoria.middleware.ts');
const auditoriaMiddleware = require('./src/middlewares/auditoria.middleware').default;
const errorHandleMiddleware = require('./src/middlewares/errorHandle.middleware').default;

//const turnosRoutes = require('./src/modules/turnos/turnos.routes');
import turnosRoutes from './src/modules/turnos/turnos.routes';  //no se permite la extension .ts

import pacientesRoutes from './src/modules/pacientes/pacientes.routes';
import medicosRoutes from './src/modules/medicos/medicos.routes';
import recepcionRoutes from './src/modules/recepcion/recepcion.routes';
import historiaClinicaRoutes from './src/modules/historiaclinica/historiaClinica.routes';
import especialidadRoutes from './src/modules/especialidad/especialidad.routes';
import loginRoutes from './src/modules/login/login.routes';

app.use(express.json());
app.use(auditoriaMiddleware);
app.use(cors());
/*
En desarrollo: puedes usar app.use(cors()) abierto para no complicarte.
En producción: conviene restringir los orígenes permitidos, por ejemplo:
app.use(cors({
  origin: "https://app.midominio.com", // solo tu frontend oficial
  methods: ["GET", "POST", "PATCH"],   // limitar métodos
  credentials: true                    // si usas cookies o auth
}));

En desarrollo suele aparecer el problema porque tu frontend
(ej. React en http://localhost:5173) y tu backend (ej. Express en http://localhost:3000) 
están en puertos distintos, y el navegador los considera “orígenes diferentes”.
Ahí necesitas CORS para que el backend autorice al frontend.
*/

app.use('/api/v1/turnos', turnosRoutes); /*termina el flujo con un response */
app.use('/api/v1/pacientes', pacientesRoutes); 
app.use('/api/v1/medicos', medicosRoutes); 
app.use('/api/v1/recepcion', recepcionRoutes);
app.use('/api/v1/historiaClinica', historiaClinicaRoutes);
app.use('/api/v1/especialidad', especialidadRoutes);
app.use('/api/auth/login', loginRoutes);

app.use(errorHandleMiddleware); /*manejo de errores para rutas no encontradas*/

const PORT = process.env.PORT || 3000; /*si no hay puerto definido en el archivo .env, se usa el puerto 3000*/
app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`================Servidor Municipal Escuchando===========`);
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.ENTORNO||`local`}`);
    console.log(`========================================================`);
});

/*¿Qué es process?
Es un objeto que representa el proceso en ejecución de Node.js.
Process es parte de Node.js, siempre disponible. (global, no hay que importarlo)
Contiene información sobre:
    El entorno (process.env)
    El PID del proceso (process.pid)
    La plataforma (process.platform)
    Señales y eventos del sistema (process.on(...))

Deja ver y manipular el estado del programa que está corriendo*/