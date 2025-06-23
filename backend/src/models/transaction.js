const db = require('../config/db');

class Transaction {
  static async create({ userId, amount, description, category, tags }) {
    try {
      const query = `
        INSERT INTO transactions (
          user_id, 
          amount, 
          description, 
          category, 
          tags,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING 
          id, 
          user_id, 
          amount, 
          description, 
          category, 
          tags, 
          created_at
      `;
      const values = [userId, amount, description, category, tags];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    try {
      const query = `
        SELECT 
          id, 
          amount, 
          description, 
          category, 
          tags, 
          created_at
        FROM transactions 
        WHERE user_id = $1 
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const result = await db.query(query, [userId, limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getStatsByCategory(userId) {
    try {
      const query = `
        SELECT 
          category, 
          SUM(amount) as total_amount,
          COUNT(*) as transaction_count
        FROM transactions 
        WHERE user_id = $1 
        GROUP BY category
        ORDER BY total_amount DESC
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getStatsByTags(userId) {
    try {
      const query = `
        SELECT 
          UNNEST(tags) as tag,
          SUM(amount) as total_amount,
          COUNT(*) as transaction_count
        FROM transactions 
        WHERE user_id = $1 
        GROUP BY tag
        ORDER BY total_amount DESC
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id, userId) {
    try {
      const query = `
        SELECT 
          id, 
          amount, 
          description, 
          category, 
          tags, 
          created_at
        FROM transactions 
        WHERE id = $1 AND user_id = $2
      `;
      const result = await db.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userId, { amount, description, category, tags }) {
    try {
      const query = `
        UPDATE transactions 
        SET 
          amount = COALESCE($3, amount),
          description = COALESCE($4, description),
          category = COALESCE($5, category),
          tags = COALESCE($6, tags),
          updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING 
          id, 
          amount, 
          description, 
          category, 
          tags, 
          created_at,
          updated_at
      `;
      const values = [id, userId, amount, description, category, tags];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const query = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *';
      const result = await db.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Transaction;
