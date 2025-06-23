const Transaction = require('../models/transaction');

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const { amount, description, category, tags } = req.body;
      const userId = req.user.userId;

      // Validate input
      if (!amount || !description || !category) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide amount, description, and category'
        });
      }

      // Create transaction
      const transaction = await Transaction.create({
        userId,
        amount,
        description,
        category,
        tags: tags || []
      });

      res.status(201).json({
        status: 'success',
        data: { transaction }
      });
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error creating transaction'
      });
    }
  }

  static async getTransactions(req, res) {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const transactions = await Transaction.findByUserId(userId, limit, offset);

      res.json({
        status: 'success',
        data: { transactions }
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching transactions'
      });
    }
  }

  static async getTransactionStats(req, res) {
    try {
      const userId = req.user.userId;

      // Get stats by category and tags
      const [categoryStats, tagStats] = await Promise.all([
        Transaction.getStatsByCategory(userId),
        Transaction.getStatsByTags(userId)
      ]);

      res.json({
        status: 'success',
        data: {
          categoryStats,
          tagStats
        }
      });
    } catch (error) {
      console.error('Get transaction stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching transaction statistics'
      });
    }
  }

  static async updateTransaction(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { amount, description, category, tags } = req.body;

      // Check if transaction exists and belongs to user
      const existingTransaction = await Transaction.findById(id, userId);
      if (!existingTransaction) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found'
        });
      }

      // Update transaction
      const updatedTransaction = await Transaction.update(id, userId, {
        amount,
        description,
        category,
        tags
      });

      res.json({
        status: 'success',
        data: { transaction: updatedTransaction }
      });
    } catch (error) {
      console.error('Update transaction error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error updating transaction'
      });
    }
  }

  static async deleteTransaction(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Check if transaction exists and belongs to user
      const existingTransaction = await Transaction.findById(id, userId);
      if (!existingTransaction) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found'
        });
      }

      // Delete transaction
      await Transaction.delete(id, userId);

      res.json({
        status: 'success',
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      console.error('Delete transaction error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting transaction'
      });
    }
  }
}

module.exports = TransactionController;
