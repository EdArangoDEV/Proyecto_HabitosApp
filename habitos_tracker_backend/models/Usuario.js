const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);