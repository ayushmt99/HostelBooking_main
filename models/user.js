const mongoose = require("mongoose");

const userschema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rollno: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roomno: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('user',userschema);