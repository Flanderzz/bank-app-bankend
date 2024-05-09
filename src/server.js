const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./routes/authRoutes');
const bankAccount = require('./routes/bankAccountRoutes');
const bodyParser = require('body-parser');

const app = express();
env.config();

app.use(cors('*'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Database has connected');
}).catch((err) => { console.log("connection error: " + err.stack) });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/',(req, res) => {
    res.send('Welcome to our API!!!');
});

app.use('/api/auth', auth);
app.use("/api/banking", bankAccount);
