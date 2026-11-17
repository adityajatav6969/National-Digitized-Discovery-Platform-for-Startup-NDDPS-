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
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Startup.deleteMany({});
    await Scheme.deleteMany({});
    await Resource.deleteMany({});
    console.log('Existing data cleared.');

    // Insert users (passwords will be hashed by pre-save hook)
    const createdUsers = await User.insertMany(
      await Promise.all(
        users.map(async (u) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(u.password, salt);
          return { ...u, password: hashedPassword };
        })
      )
    );
    console.log(`${createdUsers.length} users seeded.`);

    // Insert schemes
    const createdSchemes = await Scheme.insertMany(schemes);
    console.log(`${createdSchemes.length} schemes seeded.`);

    // Insert startups with owner set to the startup user
    const startupUser = createdUsers.find((u) => u.role === 'startup');
    const startupsWithOwner = startups.map((s) => ({
      ...s,
      owner: startupUser ? startupUser._id : createdUsers[1]._id,
    }));
    const createdStartups = await Startup.insertMany(startupsWithOwner);
    console.log(`${createdStartups.length} startups seeded.`);

    // Insert resources
    const createdResources = await Resource.insertMany(resources);
    console.log(`${createdResources.length} resources seeded.`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

runSeed();
