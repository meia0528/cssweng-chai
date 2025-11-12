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
      type: Number,
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

memberSchema.pre('save', function (next) {
  try {
    const events = typeof this.eventsAttended === 'number' ? this.eventsAttended : 0;
    if (this.membershipStatus === 'Pending' && events >= 3) {
      this.membershipStatus = 'Active';
    }
    next();
  } catch (e) {
    next(e);
  }
});

memberSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate() || {};
    const $set = update.$set || {};

    const current = await this.model.findOne(this.getQuery()).lean();
    if (!current) return next();

    const nextEvents = ($set.eventsAttended ?? update.eventsAttended ?? current.eventsAttended) ?? 0;
    const nextStatus = ($set.membershipStatus ?? update.membershipStatus ?? current.membershipStatus) ?? 'Pending';

    if (nextStatus === 'Pending' && nextEvents >= 3) {
      if (update.$set) update.$set.membershipStatus = 'Active';
      else update.membershipStatus = 'Active';
      this.setUpdate(update);
    }
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model('Member', memberSchema);
