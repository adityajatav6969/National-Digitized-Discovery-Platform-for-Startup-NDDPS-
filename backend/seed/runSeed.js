const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { users, schemes, startups, resources } = require('./seedData');

const User = require('../models/User');
const Startup = require('../models/Startup');
const Scheme = require('../models/Scheme');
const Resource = require('../models/Resource');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const runSeed = async () => {
  try {
    console.log('Connecting to MongoDB Atlas for seeding...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Startup.deleteMany({});
    await Scheme.deleteMany({});
    await Resource.deleteMany({});
    console.log('Existing collections cleared.');

    // Insert users (passwords hashed with bcrypt)
    const createdUsers = await User.insertMany(
      await Promise.all(
        users.map(async (u) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(u.password, salt);
          return { ...u, password: hashedPassword };
        })
      )
    );
    console.log(`✅ ${createdUsers.length} users seeded.`);

    // Insert schemes
    const createdSchemes = await Scheme.insertMany(schemes);
    console.log(`✅ ${createdSchemes.length} schemes seeded.`);

    // Insert startups (PaySure assigned to Rahul, rest to admin/other)
    const startupUser = createdUsers.find((u) => u.role === 'startup') || createdUsers[0];
    const adminUser = createdUsers.find((u) => u.role === 'admin') || createdUsers[0];
    const startupsWithOwner = startups.map((s, idx) => ({
      ...s,
      owner: idx === 0 ? startupUser._id : adminUser._id,
    }));
    const createdStartups = await Startup.insertMany(startupsWithOwner);
    console.log(`✅ ${createdStartups.length} startups seeded.`);

    // Insert resources
    const createdResources = await Resource.insertMany(resources);
    console.log(`✅ ${createdResources.length} resources seeded.`);

    console.log('🎉 Seeding to MongoDB Atlas complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

runSeed();
