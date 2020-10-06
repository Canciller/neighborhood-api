const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    resource: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      ref: 'Role.name',
      unique: true
    },
    description: {
        type: String
    },
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

module.exports = mongoose.model('Permission', PermissionSchema);