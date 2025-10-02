const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = process.env.MONGO_URI || '';
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB conectado Satisfactoriamente');
  } catch (err) {
    console.error('Error de conexión a MongoDB:', err && err.message ? err.message : err);
    process.exit(1);
  }
};

module.exports = connectDb;
