const express = require('express')
const app = express();
const connectDB = require('./config/mongoconfig');
require('dotenv').config();



connectDB();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


