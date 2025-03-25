var express = require("express");
var router = express.Router();
const Habito = require("../models/Habito");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/habitos", async (req, res, next) => {
  try {
    const habito = await Habito.find();
    res.json(habito);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los habitos" });
  }
});

router.post("/habitos", async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;
    const habito = new Habito({ titulo, descripcion });
    await habito.save();
    res.json(habito);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el habito" });
  }
});

router.delete("/habitos/:id", async (req, res) => {
  try {
    await Habito.findByIdAndDelete(req.params.id);
    res.json({ message: "Habito eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el habito" });
  }
});

router.put("/habitos/:id", async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    await Habito.findByIdAndUpdate(req.params.id, { titulo, descripcion });
    res.json({ message: "Habito actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el habito" });
  }
});

router.patch("/habitos/markasdone/:id", async (req, res) => {
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
