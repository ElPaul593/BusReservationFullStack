require('dotenv').config();
const http = require('http');
const app = require('./app');

// Render SIEMPRE asigna un puerto dinámico
const PORT = process.env.PORT;

const server = http.createServer(app);

server.on('error', (err) => {
  console.error('Server error:', err?.message || err);
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
