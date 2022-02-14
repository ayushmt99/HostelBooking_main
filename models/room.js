const mongoose = require("mongoose");
const user = require("../models/user")

const roomschema = mongoose.Schema({
    roomno: {
        type: Number
    },
    student_count: {
        type: Number,
        default: 0
    },
    student1: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
        default: null
    },
    student2: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
        default: null
    },
    student3: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
        default: null
    }
});

module.exports = mongoose.model('room',roomschema);
