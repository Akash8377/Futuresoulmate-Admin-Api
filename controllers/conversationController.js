const db = require('../services/db');

// Helper function to execute queries with promises
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Get all conversations
exports.getAllConversation = async (req, res) => {
  try {
    const query = 'SELECT * FROM conversations ORDER BY created_at DESC';
    const rows = await executeQuery(query);
    res.json({ success: true, conversations: rows });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};