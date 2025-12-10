const express = require('express');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const mongoose = require('mongoose');


const app = express();
const cors = require('cors');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

app.use(logger);
app.set('trust proxy', 1); // Trust first proxy (Vercel)
app.use(rateLimiter);
app.use(cors({
    origin: 'https://agentic-ai-powered-workflow-automat-olive.vercel.app',
    credentials: true
}));
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Backend running successfully ");
}); app.use('/auth', authRoutes);

// Error handler (should be last)
app.use(errorHandler);

const dbConnect = require('./utils/db');

// Connect to MongoDB
dbConnect().catch(err => console.error('MongoDB connection error:', err));


// Start server only if run directly (not in Vercel)
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
}

module.exports = app;