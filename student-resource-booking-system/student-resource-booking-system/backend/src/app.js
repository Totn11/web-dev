const express = require('express');
const mongoose = require('mongoose');
const resourceRoutes = require('./routes/resourceRoutes');
const dbConfig = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
dbConfig();

// Routes
app.use('/api/resources', resourceRoutes());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});