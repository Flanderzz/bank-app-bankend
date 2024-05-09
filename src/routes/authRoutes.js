const router = require('express').Router();
const { registerHandler, loginHandler, resetPWHandler, resetPWSenderHandler } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');


router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/resetpassword', resetPWSenderHandler);
router.post('/reset/:id', resetPWHandler);


module.exports = router;