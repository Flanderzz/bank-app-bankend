const { model } = require("mongoose");

function generateBankAccountNumber() {
    const bankCode = "1783"; 
    const branchCode = "5678"; // branch code
    const accountNumber = generateRandomNumber(10000000, 99999999); 
    const checkDigit = calculateCheckDigit(bankCode + branchCode + accountNumber);

    return bankCode+branchCode+accountNumber+checkDigit;
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateCheckDigit(accountNumber) {
    const weights = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    let sum = 0;
    for (let i = 0; i < accountNumber.length; i++) {
        sum += parseInt(accountNumber.charAt(i)) * weights[i];
    }
    const remainder = sum % 11;
    const checkDigit = remainder === 0 ? 0 : 11 - remainder;
    return checkDigit;
}

module.exports = { generateBankAccountNumber };