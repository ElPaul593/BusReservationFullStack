const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bus_reservation';
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err.message);
    process.exit(1);
  }
};

module.exports = connectDb;
