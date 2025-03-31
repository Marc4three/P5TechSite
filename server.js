const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

// Serve static files from the public directory
app.use(express.static('public'));

// Serve login page as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle all other routes
app.get('*', (req, res) => {
    // Check if the requested file exists in public directory
    const filePath = path.join(__dirname, 'public', req.path);
    if (require('fs').existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // If file doesn't exist, redirect to login
        res.redirect('/');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
}); 