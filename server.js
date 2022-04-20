const mongoose = require('mongoose');
const app = require('./app');

const url = 'mongodb://localhost/spm';
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, 'localhost', () =>
  console.log(`Listening on port ${port}...`)
);
