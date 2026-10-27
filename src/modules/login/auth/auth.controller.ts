import type {Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Usuario from './Usuario.model';
import {respuestaEstandar} from '../../../utils/respuestaEstandar';
import jwt from 'jsonwebtoken';
import type { LoginUsuarioDTO, CrearUsuarioDTO } from '../dtos/Usuario.schema';
//import type { Types } from 'mongoose';

import type {ITokenPayload} from '../../interfaces/TokenPayload';


export const registarUsuario =async (req:Request <unknown, unknown, CrearUsuarioDTO>, res:Response) =>{
    try{
        const {email,user,dni,password,rol} =req.body;
        const existeUsuario = await Usuario.findOne ({email,user});
        if (existeUsuario) {
            return respuestaEstandar(res,400,false,'el email o usuario ya estan registrados')
        }
        // cadena de caracteres aleatoria //
        const salt = await bcrypt.genSalt(10);
        // crea el hash usando el salt
        const passwordHash =await bcrypt.hash(password,salt);
        // insertar en la base de datos :
        const nuevoUsuario =await Usuario.create ({
            email, 
            user, 
            dni, 
            password:passwordHash, 
            rol, 
            activo:true,                     //<-agrego estos datos
            fechaCreacion:new Date(),        //<-agrego estos datos
            debeCambiarPassword:true         //<-agrego estos datos
        })
        respuestaEstandar(res,201,true,'Usuario creado',{
                id:nuevoUsuario._id,
                email:nuevoUsuario.email,
                user:nuevoUsuario.user,
                dni:nuevoUsuario.dni,
                fechaCreacion: nuevoUsuario.fechaCreacion,
                debeCambiarPassword: nuevoUsuario.debeCambiarPassword
            })

        }catch (error:any){
             return respuestaEstandar(res,500,false,'Error del servidor',error.message);
    }
    }

export const loginUsuario =async (req:Request <unknown, unknown, LoginUsuarioDTO>,res:Response)=>{
    try{
        //para el login no seria necesario email o login
       const {email, password} = req.body;
       
        // si existe el email si existe el usuario y si esta activo
        const usuario = await Usuario.findOne({email, activo: true});
        if(!usuario){ //en cualquier caso si alguno de los anteriores da incorrecto:
            return respuestaEstandar(res,401,false,'Credenciales Inválidas');
        }

        //compara la contraseña con la haseada en la base de datos
        const esValido = await bcrypt.compare(password, usuario.password);
        if(!esValido){
            return respuestaEstandar(res,401,false,'Credenciales Inválidas');
        }

        /*CREACION DEL TOKEN */
        const payload = {
            id: usuario._id,
            user:usuario.user,
            rol:usuario.rol,
            activo:usuario.activo,
            debeCambiarPassword: usuario.debeCambiarPassword   
        }
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            {expiresIn: '8h' } 
        );
        respuestaEstandar (res, 200, true, 'login Exitoso',{token, debeCambiarPassword: usuario.debeCambiarPassword});

    }catch(error:any){
        return respuestaEstandar(res,500,false,'Error del servidor',error.message);     
        
    }
};

// GET: listar usuarios solo para ADMIN
export const getUsuarios = async (req: Request<unknown, unknown, unknown, { dni?: string } >, res: Response) => {
  try {
    const {dni}=req.query;  /*filtrar por DNI */
    const filtro: Record<string, any> = {};

    if (dni){ filtro.dni=dni; }
    console.log("filtro armado", filtro);
    const usuarios = await Usuario.find(filtro);

    return respuestaEstandar(res, 200, true, "Usuarios obtenidos correctamente", usuarios);
  } catch (error:any) {
    return respuestaEstandar(res, 500, false, "Error al obtener los usuarios", error.message);
  
    }
};

//PUT
export const primerIngreso = async ( req: Request< unknown, unknown,{ passwordNueva: string } >,res: Response) => {        
    try {
        if (!req.usuario) { return respuestaEstandar( res, 401, false, 'Usuario no autenticado' ); }
        const usuarioId = req.usuario.id;
        const { passwordNueva } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(
            passwordNueva,
            salt
        );
        await Usuario.findByIdAndUpdate(
            usuarioId,
            {
                password: passwordHash,
                debeCambiarPassword: false
            }
        );
        return respuestaEstandar( res, 200, true, "Contraseña actualizada" );

    } catch (error: any) {
        return respuestaEstandar( res, 500, false, "Error del servidor", error.message );

    }
};