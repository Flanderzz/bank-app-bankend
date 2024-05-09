const user = require('../models/user');
const BankAccount = require('../models/bankAccount');
const mongoose = require('mongoose');
const { initConfig } = require('../utils/NodeMailerConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerHandler = async (req, res) => {
    try{
        const {email, name, password, phone, state, city, streetAddress, zipcode} = req.body;

        const existingUser = await user.findOne({ email });

        if(existingUser) return res.status(400).json({err: 'This email is already in use!'});

        const hashedPassword = await bcrypt.hash(password, 12);
        const date = Date.now();

        const newUser = new user({
            name,
            email,
            phone,
            password: hashedPassword,
            streetAddress,
            state,
            zipcode,
            city,
        });

        await newUser.save();

        console.log(newUser._id);

        const id = new mongoose.Types.ObjectId(newUser._id);

        const bankAccount = new BankAccount({
            accountHolder: newUser._id, 
            balance: 100.00, // free $100 for anyone who signs up
            savings: 100.00, // free $100 for anyone who signs up
            transactionHistory: [] 
        });

        await bankAccount.save();

        const token = jwt.sign({userID: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        await initConfig.sendMail({
            from: "Banking app <devinechinmere@gmail.com>",
            to: email,
            subject: 'Bank Account Created!',
            html: `<body>
                        <p> You have successfully an account with us</p>
                   </body>`
        }, (err, info) => {
            if(err) {
                console.log(err);
                return res.status(500).json({error: 'Email failed to send'});
                console.log("indo" + info.rejected);
            }
        });

        res.status(201).json({token, "user": newUser});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Something went wrong'});
    }
}

const loginHandler = async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await user.findOne({ email: email });

    if(!existingUser) return res.status(404).json({err: 'Email or Password is wrong!'});

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    if(!isPasswordCorrect) return res.status(400).json({err: 'Email or Password is wrong!'});

    const token = jwt.sign({userID: existingUser._id}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    await initConfig.sendMail({
        from: "Banking app <devinechinmere@gmail.com>",
        to: email,
        subject: 'Bank Account Logged into!',
        html: `<body>
               <p> You have successfully logged in to your account</p>
               </body>`
    }, (err, info) => {
        if(err) {
            console.log(err);
            return res.status(500).json({error: 'Email failed to send'});
            console.log("indo" + info.rejected);
        }
    });

    res.status(200).json({token, "user": existingUser});
}

const resetPWSenderHandler = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await user.findOne({ email: email });
        
       const emailObj = (!existingUser) ? "fake@mail.c" : existingUser.email;
       const userid = (!existingUser) ? "" : existingUser._id;
        
        await initConfig.sendMail({
            from: "Banking app <devinechinmere@gmail.com>",
            to: emailObj,
            subject: 'Reset Bankapp Password!',
            html: `<body>
                   <h2>Password Reset</h2>
                   <p>To reset your password, please click the link below:</p>
                   <a href="localhost:3000/api/auth/reset/${userid}" target="_blank">Reset Password</a>
                   </body>`
        }, (err, info) => {
            if(err) {
                console.log(err);
                return res.status(500).json({error: 'Email failed to send'});
                console.log("indo" + info.rejected);
            }
        });

        res.status(200).json({message: 'If your email is found, you will find a link to reset your password!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Something went wrong'});
    }
}

    const resetPWHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const { password } = req.body;
    
            const existingUser = await user.findById(id);

            console.log(existingUser._id);
    
            if(!existingUser) return res.status(404).json({error: 'User not found!'});
    
            const hashedPassword = await bcrypt.hash(password, 12);
    
            await user.findByIdAndUpdate(id, { password: hashedPassword });

            await initConfig.sendMail({
                from: "Banking app <devinechinmere@gmail.com>",
                to: emailObj,
                subject: 'Bank Account Password Reset!',
                html: `<body>
                        <p>Your password has been Reset, if this is a mistake please contact: support@bankapp.co</p>
                       </body>`
            }, (err, info) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({error: 'Email failed to send'});
                    console.log("indo" + info.rejected);
                }
            });
    
            res.status(200).json({message: 'Password reset successful!'});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Something went wrong'});
        }
    }


module.exports = { registerHandler, loginHandler, resetPWHandler, resetPWSenderHandler };