const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QRSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// TODO: Create test for isCodeCorrect.
/**
 * Compares stored code with passed code and checks if enabled.
 * @param {string} code
 * @returns {boolean}
 */
QRSchema.methods.isCodeCorrect = function (code) {
  return this.code === code && this.enabled;
};

QRSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('QR', QRSchema);
