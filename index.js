const express = require('express');
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const os = require('os');

const mongoConn = require('./src/config/connection');
const config = require('./src/config/config')

const smsRoute = require('./src/routes/products');
const logger = require('./src/lib/logger');


const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

const app = express();

const port = config.port || 3001;

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// parse data with connect-multiparty. 
app.use(formData.parse(options));

// union the body and the files
// app.use(formData.union());

app.use(bodyParser.json());

app.use('/', smsRoute);

app.use('/', (req, res, next) => res.status(404).json({ error: true, message: 'Not found.' }));

// Global error handler
app.use((error, req, res, next) => {

  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    error: true,
    statusCode: status,
    message,
    data
  })
});

// Mongoose, app and websocket connection
mongoConn.connection()
.then(result => {
 app.listen(port, () => logger.info(`server connected at port: ${port}`));
})
.catch(err => console.log(err));
