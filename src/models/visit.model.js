const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitSchema = new mongoose.Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visits: {
        type: Number,
        required: false
    },
    maxVisits: {
        type: Number,
        required: true
    },


}, { timestamps: true , versionKey: false});

module.exports = mongoose.model('Visit', VisitSchema);

