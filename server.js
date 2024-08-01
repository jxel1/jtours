const https = require('https');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Connected!');
  })
  .catch((err) => {
    console.error('Connection error', err);
  });

const server = https.createServer(app);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down...');
  server.close(() => {
    console.log('Process terminated!');
  });
});
