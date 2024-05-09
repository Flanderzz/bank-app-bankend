const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// a record of a transaction between two users, used for transferring money
const transactionSchema = new Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'
    }, 
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'
    },
    note:{
        type: String,
        required: false
    }, 
    amount: { 
        type: Number, 
        required: true 
    }, 
    date: { 
        type: Date, 
        required: true,
        default: Date.now 
    }, 
});

module.exports = mongoose.model('Transaction', transactionSchema); 