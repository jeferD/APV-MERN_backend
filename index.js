import express from "express";
import conectarDB from "./config/db.js";
import dotenv from 'dotenv';
import VeterinarioRoutes from "./routes/veterinarioRoutes.js";
import PacienteRoutes  from "./routes/pacienteRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
dotenv.config();

conectarDB();
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions ={
    origin: function (origin,callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //el origen del reques esta permitido
            callback(null, true);
        }else{
            callback(new Error('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions));
app.use('/api/veterinarios', VeterinarioRoutes);
app.use('/api/pacientes', PacienteRoutes);


const PORT = process.env.PORT || 4000

app.listen(PORT, ()=> {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
