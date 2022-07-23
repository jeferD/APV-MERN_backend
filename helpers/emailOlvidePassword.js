import nodemailer from 'nodemailer';

const emailOvidePassword = async(datos)=> {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    // console.log(datos);

    const {email, nombre, token} = datos;
    //enviar email
    const info = await transporter.sendMail({
        from: "APV - Administrador de pacientes de veterinaria",
        to: email,
        subject: 'Restablece tu contraseña APV',
        text: 'Restablece tu contraseña APV......',
        html: `<p> Hola ${nombre}, has solicitado restableces tu contraseña de APV.</p>
            <p> sigue el siguiente enlace para generar una nueva contraseña:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a></p>
            <p> Si tu no creaste esta cuenta, Puedes ignorar este mensaje..</p>
        `
    });
    console.log('Mensaje enviado: %s', info.messageId);
}

export default emailOvidePassword;