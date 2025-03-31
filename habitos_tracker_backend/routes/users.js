var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");




/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/registro", async (req, res, next) => {
  try {
    const { nombreUsuario, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nUsuario = new Usuario({ nombreUsuario, password: hashedPassword });
    await nUsuario.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar el usuario",
      descripcion: error.toString(),
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
