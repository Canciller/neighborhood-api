const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshTokenSchema = new mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
        type: String,
        required: true,
    },
    expires: {
      type: Date,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    },
    createdByIp: {
      type: String,
      required: true
    },
    revoked: {
      type: Date
    },
    revokedByIp: {
      type: String,
    },
    replacedByToken: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
