const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Middleware to check authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, process.env.AZURE_AD_CLIENT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Serve login page as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
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
const hostname = 'localhost';
app.listen(PORT, hostname, () => {
    console.log(`Server is running on http://${hostname}:${PORT}`);
}); 