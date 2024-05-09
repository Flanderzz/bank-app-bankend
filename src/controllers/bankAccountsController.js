const bankAccounts = require('../models/bankAccount');
const users = require('../models/user');
const transaction = require('../models/transaction');
const { initConfig } = require('../utils/NodeMailerConfig');


const getUserAccount = async (req, res) => {
    try {
        const user = await bankAccounts.findOne({"accountHolder": req.userID});

        if (!user) return res.status(404).json({ err: 'User not found' });

        res.status(200).json({ message: 'User Account', user });
    } catch(e){
        res.status(500).json({ message: 'Server Error', error: e });
    }
}

const returnTransactions = async (req, res) => {
    try {
        const user = await bankAccounts.findOne({"accountHolder": req.userID});

        if (!user) return res.status(404).json({ err: 'User not found' });

        res.status(200).json({transactions: user.transactions});

    } catch(e){
        res.status(500).json({ message: 'Server Error', error: e });
    }
}

// I hope this works, if this doesnt so be it.
const transferMoney = async (req, res) => {
    try {
        const user = await bankAccounts.findOne({"accountHolder": req.userID});

        if (!user) return res.status(404).json({ error: 'User not found' });

        const reciever = await users.findOne({"email": req.body.email});
        
        if (!reciever) return res.status(404).json({ error: 'Reciever not found' });

        const recieverAccount = await bankAccounts.findOne({"accountHolder": reciever._id});

        if (!recieverAccount) return res.status(404).json({ error: 'Reciever account not found' });

        if (req.body.amount > user.balance) return res.status(400).json({ error: 'Insufficient funds' });

        user.balance -= req.body.amount;

        recieverAccount.balance += req.body.amount;

        const newTransaction = new transaction({
            sender: user.accountHolder, 
            receiver: reciever.accountHolder, 
            note: req.body.note, 
            amount: req.body.amount 
        });
        newTransaction.save();

        user.transactions.push(newTransaction);
        user.save();
        recieverAccount.save();

        reciever.transactions.push(newTransaction);
        reciever.save();

        await initConfig.sendMail({
            from: "Banking app <devinechinmere@gmail.com>",
            to: user.email,
            subject: 'Transaction Successful!',
            html: `<body>
                        <p> You have successfully transferred ${req.body.amount} to ${reciever.email}, if this is a mistake, please contact support@bankapp.co</p>
                   </body>`
        }, (err, info) => {
            if(err) {
                console.log(err);
                return res.status(500).json({error: 'Email failed to send'});
                console.log("indo" + info.rejected);
            }
        });

        await initConfig.sendMail({
            from: "Banking app <devinechinmere@gmail.com>",
            to: reciever.email,
            subject: `Balance of ${req.body.amount}!`,
            html: `<body>
                        <p> You have been transferred ${req.body.amount} from ${user.email}, if this is a mistake, please contact support@bankapp.co</p>
                   </body>`
        }, (err, info) => {
            if(err) {
                console.log(err);
                return res.status(500).json({error: 'Email failed to send'});
                console.log("indo" + info.rejected);
            }
        });

        res.status(200).json({ message: 'Transaction Successful' });
    } catch(e){
        res.status(500).json({ message: 'Server Error', error: e });
    }        
}



module.exports = { getUserAccount, returnTransactions, transferMoney };