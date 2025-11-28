const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const EventEmitter = require('events');

class UserMonitor extends EventEmitter {}

const userMonitor = new UserMonitor();
const app = express();
const PORT = 3000;

// Middleware
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Event Listener
userMonitor.on('userLogin', (sessionId) => {
    console.log(`User logged in. Session ID: ${sessionId}`);
});

// Routes
app.get('/login', (req, res) => {
    // Set session variable
    req.session.user = "guest";

    // Set cookie
    res.cookie('status', 'active');

    // Emit event
    userMonitor.emit('userLogin', req.sessionID);

    res.send(`session started for guest . cookie [status] set to active.`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
