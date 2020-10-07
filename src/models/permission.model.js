const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    resource: {
      type: String,
      required: true,
      lowercase: true
    },
    role: {
      type: String,
      required: true,
      lowercase: true
    },
    description: String,
    read: {
      type: Boolean,
      default: false
    },
    write: {
      type: Boolean,
      default: false
    },
    update: {
      type: Boolean,
      default: false
    },
    delete: {
      type: Boolean,
      default: false
    },
});

PermissionSchema.index({
  resource: 1,
  role: 1
}, { unique: true });

module.exports = mongoose.model('Permission', PermissionSchema);