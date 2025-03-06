const mongoose = require("mongoose");
const habitoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: false,
  },
  creado: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Habito", habitoSchema);
