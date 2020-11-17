const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  resource: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  param: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  write: {
    type: Boolean,
    default: false,
  },
  update: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

PermissionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('Permission', PermissionSchema);
