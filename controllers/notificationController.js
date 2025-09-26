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

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const query = 'SELECT * FROM notifications ORDER BY created_at DESC';
    const rows = await executeQuery(query);
    res.json({ success: true, notifications: rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};