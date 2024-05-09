const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    streetAddress: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    zipcode: { 
        type: Number, 
        required: true 
    },
    dateCreated: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
});

module.exports = mongoose.model('User', userSchema);