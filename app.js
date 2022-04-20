const express = require('express');
const users = require('./routes/userRoutes');
const project = require('./routes/projectRoutes');

const app = express();

app.use(express.json());

app.use('/users', users);
app.use('/projects', project);

app.get('/', (req, res) => {
  res.send('Welcome, A Supervised Project Management App');
});

module.exports = app;
