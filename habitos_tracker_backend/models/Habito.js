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
  createdAt:{
    type: Date,
    default: Date.now,
  },
  lastUpdated:{
    type: Date,
    default: Date.now,
  },
  lastDone:{
    type: Date,
    default: Date.now,
  },
  days:{
    type: Number,
    default: 1,
  },
  startedAt:{
    type: Date,
    default: Date.now,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
});

module.exports = mongoose.model("Habito", habitoSchema);
