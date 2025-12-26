const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const serverless = require('serverless-http');

// Routes
const authRoutes = require('../routes/authRoutes');
const jobRoutes = require('../routes/jobRoutes');
const applicationRoutes = require('../routes/applicationRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('Job Portal API is running');
});

// MongoDB Connection
// Only connect if not already connected (for serverless environments)
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        // Do not exit process in serverless env, but logging is good
    });
}

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);

// Local Development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
