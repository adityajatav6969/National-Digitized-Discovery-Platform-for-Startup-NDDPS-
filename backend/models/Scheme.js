const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ministryOrBody: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Funding/Grant', 'Incubation', 'Tax Exemption', 'IP Support', 'Mentorship'],
    },
    eligibleDomains: [{ type: String }],
    eligibleStages: [{ type: String }],
    eligibleStates: [{ type: String }],
    maxGrantAmount: {
      type: Number,
    },
    description: {
      type: String,
    },
    applicationUrl: {
      type: String,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scheme', schemeSchema);
