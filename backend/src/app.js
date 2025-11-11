require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const connectDb = require('./config/db');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database
connectDb();

// Routes
app.use('/api', routes);

// Health
app.get('/', (req, res) => res.json({ ok: true, name: 'BusReservation API' }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

module.exports = app;
