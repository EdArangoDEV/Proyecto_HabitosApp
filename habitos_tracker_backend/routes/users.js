var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");




/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});


/* POST registro - VERSIÓN MEJORADA */
router.post("/registro", async (req, res, next) => {
  try {
    // 1. VALIDACIÓN DE ENTRADA
    const { nombreUsuario, password } = req.body;

    // Validar que los campos existan
    if (!nombreUsuario || !password) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: nombreUsuario y password" 
      });
    }

    // Validar longitud mínima del password (seguridad)
    if (password.length < 8) {
      return res.status(400).json({ 
        message: "La contraseña debe tener al menos 8 caracteres" 
      });
    }


    // 3. GENERAR SALT Y HASH (IGUAL QUE ANTES - CORRECTO)
    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(password, salt);

    
    // 4. CREAR Y GUARDAR USUARIO
    const nUsuario = new Usuario({ 
      nombreUsuario, 
      password: hashedPassword 
    });
    await nUsuario.save();

    // 5. RESPUESTA EXITOSA (sin exponer datos sensibles)
    res.status(201).json({ 
      message: "Usuario registrado correctamente",
      usuarioId: nUsuario._id  // Solo ID público
    });

  } catch (error) {
    // 6. MANEJO DE ERRORES MEJORADO
    console.error("Error en registro:", error); // Log para desarrolladores
    
    // En producción NO exponer detalles del error
    res.status(500).json({ 
      message: "Error interno del servidor. Intenta más tarde." 
    });
  }
});


router.post("/login", async (req, res, next) => {
  try {
    const { nombreUsuario, password } = req.body;

    // Busca usuario en la BD
    const usuario = await Usuario.findOne({ nombreUsuario });
    if (!usuario)
      return res.status(400).json({ message: "Usuario no encontrado" });

    // comparar la contraseña con la de la BD
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrectos" });

    // Generar un JWT para la sesion
    const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("habitoToken", token, {
      httpOnly: false, // previene el acceso desde el frontend
      secure: process.env.NODE_ENV === "production", // solo se envia en produccion
      sameSite: "Strict", // solo se envia en peticiones del mismo sitio
      maxAge: 7 * 24 * 60 * 60 * 1000, // tiempo de vida de la cookie
    });
    res.json({ 
      message: "Inicio de sesion exitoso", 
      token });
  } catch (error) {
    res.status(500).json({
      message: "Error en el inincio de sesion",
      descripcion: error.toString(),
    });
  }
});

module.exports = router;
