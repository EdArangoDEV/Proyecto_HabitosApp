const mongoose = require('mongoose');
require('dotenv').config();

// Configura la conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:');
    console.error(err);
  });

module.exports = mongoose;