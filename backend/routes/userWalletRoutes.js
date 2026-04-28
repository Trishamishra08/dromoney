const express = require('express');
const { getBalance, addCoins, requestWithdrawal, getTransactions } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All wallet routes are protected

router.get('/balance', getBalance);
router.post('/add-coins', addCoins);
router.post('/withdraw', requestWithdrawal);
router.get('/transactions', getTransactions);

module.exports = router;
