const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const { generateBankAccountNumber } = require('../utils/accountNumberGenerator');

const bankAccountSchema = new Schema({ 
    accountHolder: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'}, 
    accountNumber: { 
        type: String, 
        default: generateBankAccountNumber()
    }, 
    balance: { 
        type: Number, 
        required: true 
    }, 
    savings: { 
        type: Number, 
        required: true 
    }, 
    transactionHistory: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Transaction'
    }], 
});

module.exports = mongoose.model('BankAccount', bankAccountSchema); 