const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Incubator', 'Accelerator', 'CoWorking', 'Investor', 'Mentor'],
    },
    location: {
      city: { type: String },
      state: { type: String },
    },
    domains: [{ type: String }],
    website: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
