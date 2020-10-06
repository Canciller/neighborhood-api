const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');

const saltRounds = config.saltRounds;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        maxlength: 32,
        required: true,
        match: /^[0-9a-zA-Z_-]+$/,
    },
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
      type: String,
      ref: 'Role.name',
      default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        const document = this;
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        });
    } else {
        next();
    }
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.statics = {
    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    },
};

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.password;
  }
});

module.exports = mongoose.model('User', UserSchema);
