const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const { getUserAccount, returnTransactions, transferMoney } = require('../controllers/bankAccountsController');

router.get('/user/getUser', authenticateUser, getUserAccount);
router.get('/user/getTransactions', authenticateUser, returnTransactions);
router.post('/user/transfer', authenticateUser, transferMoney);

module.exports = router;