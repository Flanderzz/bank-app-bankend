const jwt = require('jsonwebtoken');

function authenticateUser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.userID = decoded.userID;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Not logged in! try again or make an account!' });
    }
}

module.exports = { authenticateUser };