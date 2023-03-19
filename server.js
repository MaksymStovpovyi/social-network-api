const express = require('express');
const db = require('./config/connection');
const routes = require('./routes/index');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3001;
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});