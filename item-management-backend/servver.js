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