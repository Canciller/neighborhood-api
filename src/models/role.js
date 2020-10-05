const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      index: true
    },
    description: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Role', RoleSchema);
