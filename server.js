const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Add your routes here (e.g., login, signup, dashboard)
// app.post('/signup', ...);
// app.post('/login', ...);
// app.get('/dashboard', ...);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
