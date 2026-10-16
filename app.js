"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//require('dotenv').config({ path: './src/.env' }); /*carga las variables de entorno desde el archivo .env*/
//require("dotenv/config"); /*carga las variables de entorno desde el archivo .env*/
import "dotenv/config"; /*carga las variables de entorno desde el archivo .env*/
//const cors = require ('cors');
const cors_1 = __importDefault(require("cors")); /*importa el módulo cors para permitir solicitudes de diferentes orígenes*/
//const express = require('express');
const express_1 = __importDefault(require("express")); /*importa el módulo express para crear el servidor web*/
//const connectDB = require('./src/config/database.js');
const database_js_1 = __importDefault(require("./src/config/database.js")); /*importa la función connectDB para conectar a la base de datos*/
const app = (0, express_1.default)();
(0, database_js_1.default)(); /*conecta a la base de datos usando la función connectDB del archivo database.js*/
const auditoriaMiddleware = require('./src/middlewares/auditoria.middleware.js');
const errorHandleMiddleware = require('./src/middlewares/errorHandle.middleware.js');
const turnosRoutes = require('./src/routes/turnos.routes.js');
const pacientesRoutes = require('./src/routes/pacientes.routes.js');
const medicosRoutes = require('./src/routes/medicos.routes.js');
const recepcionRoutes = require('./src/routes/recepcion.routes');
const historiaClinicaRoutes = require('./src/routes/historiaClinica.routes.js');
const especialidadRoutes = require('./src/routes/especialidad.routes.js');
const loginRoutes = require('./src/routes/login.routes.js');
app.use(express_1.default.json());
app.use(auditoriaMiddleware);
app.use((0, cors_1.default)());
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
    console.log(`Entorno: ${process.env.ENTORNO || `local`}`);
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
//# sourceMappingURL=app.js.map