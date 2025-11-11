const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    memberCreated: {
      type: Date,
      default: Date.now,
    },
    eventsAttended: {
      type: Number,
      default: 0,
    },
    membershipStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending', 'Expired'],
      default: 'Pending',
    },
  },
);

memberSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

module.exports = mongoose.model('Member', memberSchema);
