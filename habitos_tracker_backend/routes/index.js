var express = require("express");
var router = express.Router();
const Habito = require("../models/Habito");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// funcion para validar jwt
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acceso denegado, no se ha proporcionado un token" });

  try {
    const tokenSinBearer = token.replace("Bearer ", "");
    const verified = jwt.verify(tokenSinBearer, process.env.JWT_SECRET);
    req.user = verified; // guarda el usuario en la peticion
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Token no valido o expirado" });
  }
}


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/habitos", authenticateToken, async (req, res, next) => {
  try {
    let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({ message: "Usuario no autenticado"});
    const habito = await Habito.find({userId: new mongoose.Types.ObjectId(userId)});
    
    res.json(habito);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los habitos" });
  }
});

router.post("/habitos", authenticateToken, async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({ message: "Usuario no autenticado"});
    userId = new mongoose.Types.ObjectId(userId)
    
    const habito = new Habito({ titulo, descripcion, userId});
    // console.log(habito);
    await habito.save();
    res.json(habito);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el habito" });
  }
});

router.delete("/habitos/:id",  authenticateToken, async (req, res) => {
  try {
    await Habito.findByIdAndDelete(req.params.id);
    res.json({ message: "Habito eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el habito" });
  }
});

router.put("/habitos/:id", authenticateToken, async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    await Habito.findByIdAndUpdate(req.params.id, { titulo, descripcion });
    res.json({ message: "Habito actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el habito" });
  }
});

router.patch("/habitos/markasdone/:id",  authenticateToken, async (req, res) => {
  try {
    const habito = await Habito.findById(req.params.id);
    habito.lastDone = new Date();
    if (timeDifferenceInHours(habito.lastUpdated, habito.lastDone) <= 24) {
      habito.lastUpdated = new Date();
      habito.days = timeDifferenceInDays(habito.lastDone, habito.startedAt);
      habito.save();
      res.status(200).json({ message: "Habito marcado como hecho" });
    }
    else {
      habito.days = 1;
      habito.lastUpdated = new Date();
      habito.startedAt = new Date();
      habito.save();
      res.status(200).json({ message: "Habito reinicidado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el habito" });
  }
});

const timeDifferenceInHours = (date1, date2) => {
  const diffMs = Math.abs(date1 - date2); // tiempo asbsoluto en milisegundos
  return diffMs / (1000 * 60 * 60); // tiempo en horas
};

const timeDifferenceInDays = (date1, date2) => {
  const diffMs = Math.abs(date1 - date2); // tiempo asbsoluto en milisegundos
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)); // tiempo en dias
};

module.exports = router;
