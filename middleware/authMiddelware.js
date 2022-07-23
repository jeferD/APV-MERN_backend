import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async(req,res,next)=>{
    // console.log('Desde mi middelware');
    // console.log(req.headers.authorization);

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log('Si tiene el token con bearer');
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.veterinario = await Veterinario.findById(decoded.id).select(
                "-password -token -confirmado"
            );

            return next();
            // console.log(veterinario);
        } catch (error) {
            const e = new Error('Token no valido');
            return res.status(403).json({msj: e.message});
        }
    }
    if(!token){
        const error = new Error('Token no valido o ya expiro');
        return res.status(403).json({msj: error.message});
    }

    next();
};

export default checkAuth;