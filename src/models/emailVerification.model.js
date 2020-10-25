const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailVerificationSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, // 1h
    default: Date.now,
  },
});

EmailVerificationSchema.index(
  {
    user: 1,
    code: 1,
  },
  { unique: true }
);

EmailVerificationSchema.methods.isCodeCorrect = async function (code) {
  return code === this.code;
};

EmailVerificationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.code;
  },
});

module.exports = mongoose.model('EmailVerification', EmailVerificationSchema);
