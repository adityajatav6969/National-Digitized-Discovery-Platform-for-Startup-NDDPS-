const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
    },
    description: {
      type: String,
    },
    domain: {
      type: String,
      enum: ['FinTech', 'EdTech', 'AgriTech', 'HealthTech', 'AI/ML', 'CleanTech', 'SaaS'],
    },
    fundingStage: {
      type: String,
      enum: ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'],
    },
    location: {
      city: { type: String },
      state: { type: String },
    },
    foundedYear: {
      type: Number,
    },
    teamSize: {
      type: Number,
    },
    website: {
      type: String,
    },
    email: {
      type: String,
    },
    founderName: {
      type: String,
    },
    dpiitNumber: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    adminRemarks: {
      type: String,
    },
    matchedSchemes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme',
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

startupSchema.index({ name: 1 });
startupSchema.index({ domain: 1 });
startupSchema.index({ fundingStage: 1 });
startupSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('Startup', startupSchema);
