const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Get all transactions with pagination
router.get('/', TransactionController.getTransactions);

// Get transaction statistics
router.get('/stats', TransactionController.getTransactionStats);

// Create new transaction
router.post('/', TransactionController.createTransaction);

// Update transaction
router.put('/:id', TransactionController.updateTransaction);

// Delete transaction
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;
