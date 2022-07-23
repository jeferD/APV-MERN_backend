import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res)=>{
    // console.log(req.body); //los JSON de posman llegan pormedio de esta bariable
    const {email, nombre} = req.body;

    //prevenir un usuario registrado
    const existeUsuario = await Veterinario.findOne({email});
    if(existeUsuario){
        // console.log('Existe usuario');
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }else{
        try {
            //guardar nuevo veterinario
            const veterinario = new Veterinario(req.body);
            const veterinarioGuardado = await veterinario.save();
            
            //enviar email
            emailRegistro({email,nombre,token: veterinarioGuardado.token});

            res.json(veterinarioGuardado);
    
        } catch (error) {
            console.log(error);
    
        }    
    }

};
const perfil = (req, res)=>{
    const {veterinario} = req;
    res.json({veterinario});
};
const confirmar = async(req, res)=>{
    // console.log(req.params.token);
    const {token} = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});
    // console.log(usuarioConfirmar);
    if(!usuarioConfirmar){
        const error = new Error('Token no encontrado');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({ msg: "Usuario confirmado"});
    } catch (error) {
        console.log(error)
    }
    
};
const autenticar = async (req, res)=>{
    // console.log(req.body);
    const {email, password} = req.body;

    const usuario = await Veterinario.findOne({email});
    if(!usuario){
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }

    //comprobar si el usuario ya esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    //revisar el password es correcto
    if(await usuario.comprobarPassword(password)){
        // console.log('password correcto......');
        res.json({
            

            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            web: usuario.web,
            telefono: usuario.telefono,
            token: generarJWT(usuario.id)
            
        });
    }else{
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message});
    }

    //autenticar al usuario

    
};
const olvidePassword = async(req, res)=>{
    const {email} = req.body;
    // console.log(email);
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //enviar email con instrucciones de reestablecer password
        emailOvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token

        })

        res.json({msg: 'Hemos enviado un email con las instrucciones'});
    } catch (error) {
        console.log(error)
    }
};
const comprobarToken = async(req, res)=>{
    const {token} = req.params;
    // console.log(token);
    const tokenValido = await Veterinario.findOne({token});
    if(tokenValido){
        console.log('Token valido');
        res.json({msg: 'Token valido'});
    }else{
        const error = new Error('El token es incorrecto');
        return res.status(400).json({msg: error.message});
    }
};
const nuevoPassword = async(req, res)=>{
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }
    try {
        // console.log(veterinario);
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'});
    } catch (error) {
        console.log(error)
    }

};

const actualizarPerfil = async(req, res)=>{
    // console.log(req.params.id);
    // console.log(req.body);
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({
            msg: error.message
        });
    }
    const {email} = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await veterinario.findOne({email});
        if(existeEmail){
            const error = new Error('Email esta en uso');
            return res.status(400).json({
                msg: error.message
            });
        }
    }
    try {
        veterinario.nombre = req.body.nombre ;
        veterinario.email = req.body.email ;
        veterinario.web = req.body.web ;
        veterinario.telefono = req.body.telefono ;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error)
    }

}

const actualizarPassword = async(req,res)=>{
    //leer datos 
    // console.log(req.veterinario);
    // console.log(req.body);
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;
    //comprobar
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({
            msg: error.message
        });
    }
    //comprobar password
    if(await veterinario.comprobarPassword(pwd_actual)){
        // console.log('correcto');
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({
            msg: 'Contraseña actualizada correctamente'
        })
    }else{
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json({
            msg: error.message
        });
    }
    //almacenar
}


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
}