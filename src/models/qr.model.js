const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QRCode = require('qrcode');

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
      required: false,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

QRSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

QRSchema.pre('save', async function() {
  const document = this;

    const url = "http://localhost:8000/api/qrs/user/" + document.user;
    const base64Image = await QRCode.toDataURL(url, {
      type: 'image/jpeg',
      quality: 1,
    });

    document.code = base64Image;
   
 
});


module.exports = mongoose.model('QR', QRSchema);
