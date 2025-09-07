const { promisePool } = require('../../config/database');

class Author {
  constructor(data) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.birth_date = data.birth_date;
    this.nationality = data.nationality;
    this.bio = data.bio;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new author
  static async create(authorData) {
    try {
      const { first_name, last_name, email, birth_date, nationality, bio } = authorData;
      
      const [result] = await promisePool.execute(
        'INSERT INTO authors (first_name, last_name, email, birth_date, nationality, bio) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, birth_date, nationality, bio]
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating author: ${error.message}`);
    }
  }

  // Find all authors
  static async findAll(limit = 50, offset = 0) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM authors ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      return rows.map(row => new Author(row));
    } catch (error) {
      throw new Error(`Error fetching authors: ${error.message}`);
    }
  }

  // Find author by ID
  static async findById(id) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM authors WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return new Author(rows[0]);
    } catch (error) {
      throw new Error(`Error finding author: ${error.message}`);
    }
  }

  // Find author by email
  static async findByEmail(email) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM authors WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? new Author(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error finding author by email: ${error.message}`);
    }
  }

  // Update author
  static async update(id, updateData) {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      await promisePool.execute(
        `UPDATE authors SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating author: ${error.message}`);
    }
  }

  // Delete author
  static async delete(id) {
    try {
      const [result] = await promisePool.execute(
        'DELETE FROM authors WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting author: ${error.message}`);
    }
  }

  // Get books by author
  static async getBooksById(authorId) {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM books WHERE author_id = ? ORDER BY publication_date DESC',
        [authorId]
      );
      
      return rows;
    } catch (error) {
      throw new Error(`Error fetching author's books: ${error.message}`);
    }
  }

  // Search authors
  static async search(searchTerm, limit = 20) {
    try {
      const searchPattern = `%${searchTerm}%`;
      const [rows] = await promisePool.execute(
        'SELECT * FROM authors WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ?',
        [searchPattern, searchPattern, searchPattern, limit]
      );
      
      return rows.map(row => new Author(row));
    } catch (error) {
      throw new Error(`Error searching authors: ${error.message}`);
    }
  }
}

module.exports = Author;
