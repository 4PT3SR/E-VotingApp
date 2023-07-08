const mongoose = require('mongoose');
const AppError = require('../utils/AppError')

const dataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: [true, 'Data already exists']
    },
    data: [{
        type: String,
        required: true
    }]

}, {
    timestamps: true
});



const Data = new mongoose.model('data', dataSchema);


module.exports = Data;