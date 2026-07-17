const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase Admin SDK connection
const { db } = require('./config/firebase');

// Import routers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Import middlewares
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and parse JSON body requests (with limit for Base64 image uploads)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Map route handlers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', aiRoutes);   // matches /api/explain, /api/debug, /api/generate, /api/sql, /api/readme, /api/tip
app.use('/api', chatRoutes); // matches /api/chat

// Centralized error handler
app.use(errorHandler);

// App Startup
app.listen(PORT, () => {
  console.log(`DevPilot Server running securely on http://localhost:${PORT}`);
});
