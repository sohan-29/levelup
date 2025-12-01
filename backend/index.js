require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const mongoURI = `mongodb+srv://sohan291106_db_user:${process.env.DB_PASSWORD}@levelup.godbbzd.mongodb.net/?appName=levelup`;
mongoose.connect(mongoURI);

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
