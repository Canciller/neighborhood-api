const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QrSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      required: true,
      match: /^[0-9a-zA-Z_-]+$/,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('QR', QrSchema);
