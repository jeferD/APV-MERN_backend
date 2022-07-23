import express from "express";
const router = express.Router();
import {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente,
} from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddelware.js";

router
    .route("/")
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes);


router
    .route("/:id")
    .get(checkAuth,obtenerPaciente)
    .put(checkAuth,actualizarPaciente)
    .delete(checkAuth,eliminarPaciente);
// router
//     .get("/:id",obtenerPaciente)
//     .put("/:id",checkAuth,actualizarPaciente)
//     .delete("/:id",checkAuth,eliminarPaciente);




export default router;