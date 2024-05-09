const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// a record of a deposit from a bank account
const depositSchema = new Schema({
    account: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'BankAccount' 
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

module.exports = mongoose.model('Deposit', depositSchema);