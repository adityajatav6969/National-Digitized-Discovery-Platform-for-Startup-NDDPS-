const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const startupRoutes = require('./routes/startups');
const adminRoutes = require('./routes/admin');
const schemeRoutes = require('./routes/schemes');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize global fallback state
global.useInMemory = false;

// Health / Status Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'National Digitized Discovery Platform for Startup (2026-27-WD-04)',
    databaseMode: global.useInMemory ? 'In-Memory Store (Active Fallback)' : 'MongoDB Atlas (Connected)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/startup_discovery';

// Connect Database with Graceful In-Memory Fallback
const startServer = async () => {
  try {
    console.log('Attempting MongoDB Atlas connection...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully.');
    global.useInMemory = false;

    // Check if initial seeding needed
    const Startup = require('./models/Startup');
    const startupCount = await Startup.countDocuments();
    if (startupCount === 0) {
      console.log('MongoDB collection is empty. Auto-seeding initial data...');
      const bcrypt = require('bcryptjs');
      const { users, schemes, startups, resources } = require('./seed/seedData');
      const User = require('./models/User');
      const Scheme = require('./models/Scheme');
      const Resource = require('./models/Resource');

      const createdUsers = await User.insertMany(
        await Promise.all(
          users.map(async (u) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(u.password, salt);
            return { ...u, password: hashedPassword };
          })
        )
      );
      await Scheme.insertMany(schemes);
      const startupUser = createdUsers.find((u) => u.role === 'startup') || createdUsers[0];
      const adminUser = createdUsers.find((u) => u.role === 'admin') || createdUsers[0];
      const startupsWithOwner = startups.map((s, idx) => ({
        ...s,
        owner: idx === 0 ? startupUser._id : adminUser._id,
      }));
      await Startup.insertMany(startupsWithOwner);
      await Resource.insertMany(resources);
      console.log('✅ Auto-seed completed successfully in MongoDB Atlas.');
    }
  } catch (err) {
    global.useInMemory = true;
    console.warn('⚠️  MongoDB connection failed / timed out:', err.message);
    console.warn('⚡ ACTIVATING IN-MEMORY DATA STORE FALLBACK.');
    console.log('✅ All APIs (Search, Filter, Auth, CRUD, Admin Moderation, Analytics) are 100% operational in-memory.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 NDDPS Backend running on http://localhost:${PORT}`);
    console.log(`📡 Database Mode: ${global.useInMemory ? 'IN-MEMORY STORE' : 'MONGODB ATLAS CLOUD'}`);
  });
};

startServer();
