// require("dotenv").config();

// const app = require("./src/app");
// const pool = require("./src/config/db");

// pool.query("SELECT NOW()")
//   .then(() => {
//     console.log("Database Connected");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on ${process.env.PORT}`);
// });
const express = require('express');
const cors = require('cors');

const itemRoutes = require('./src/routes/itemRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});