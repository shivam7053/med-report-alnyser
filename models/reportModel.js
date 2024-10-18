// models/reportModel.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    filePath: {
        type: String,
        required: true
    },
    extractedText: {
        type: String,
        required: true
    },
    analysis: {
        type: Object,
        default: {}
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
