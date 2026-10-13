import type {Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Usuario from './Usuario.model';
import {respuestaEstandar} from '../../../utils/respuestaEstandar';
import jwt from 'jsonwebtoken';

export const registarUsuario =async (req:Request, res:Response) =>{
    try{
        const {email,user,password,rol} =req.body;
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
            email, user, password:passwordHash, rol
        })
        respuestaEstandar(res,201,true,'Usuario creado',{
                id:nuevoUsuario._id,
                email:nuevoUsuario.email,
                user:nuevoUsuario.user
        })

    }catch (error:any){
        return respuestaEstandar(res,500,false,'Error del servidor',error.message);
    }
    }

export const loginUsuario =async (req:Request,res:Response)=>{
    try{
        //para el login no seria necesario email o login
        const {email,user,password} = req.body;
        
        // si existe el email si existe el usuario y si esta activo
        const usuario = await Usuario.findOne({email,user, activo: true});
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
            activo:usuario.activo
        }
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            {expiresIn: '8h' } 
        );
        respuestaEstandar (res, 200, true, 'login Exitoso',{token});

    }catch(error:any){
        return respuestaEstandar(res,500,false,'Error del servidor',error.message);     
        
    }
}