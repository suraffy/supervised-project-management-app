const express = require('express');
const users = require('./routes/userRoutes');
const projects = require('./routes/projectRoutes');
const tasks = require('./routes/taskRoutes');

const app = express();

app.use(express.json());

app.use('/api/users', users);
app.use('/api/projects', projects);
app.use('/api/tasks', tasks);

app.get('/', (req, res) => {
  res.send('Welcome, A Supervised Project Management App');
});

module.exports = app;
