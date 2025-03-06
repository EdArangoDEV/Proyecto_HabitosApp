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

module.exports = router;
