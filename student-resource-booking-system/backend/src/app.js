const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const resourceRoutes = require("./routes/resourceRoutes")
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
connectDB()

// Basic route
app.get('/', (req, res) => {
    res.send('Server is running');
});

//Other Routes
app.use("/api/auth",authRoutes)
app.use("/api/resources",resourceRoutes)
app.use("/api/booking",bookingRoutes)

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//     const __dirname = path.resolve();
//     app.use(express.static(path.join(__dirname, '../frontend/build')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
//     });
// }

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});