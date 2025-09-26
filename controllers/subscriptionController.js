// controllers/subscriptionController.js
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

// Get all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const query = `
      SELECT s.*, u.first_name, u.last_name, u.email 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `;
    
    const rows = await executeQuery(query);
    
    // Parse features JSON string
    const parsedSubscriptions = rows.map(sub => ({
      ...sub,
      features: sub.features ? JSON.parse(sub.features) : []
    }));
    
    res.json({ success: true, data: parsedSubscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT s.*, u.first_name, u.last_name, u.email 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.id = ?
    `;
    
    const rows = await executeQuery(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    
    // Parse features JSON string
    const subscription = {
      ...rows[0],
      features: rows[0].features ? JSON.parse(rows[0].features) : []
    };
    
    res.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get subscriptions by user ID
exports.getSubscriptionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT s.*, u.first_name, u.last_name, u.email 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `;
    
    const rows = await executeQuery(query, [userId]);
    
    // Parse features JSON string
    const parsedSubscriptions = rows.map(sub => ({
      ...sub,
      features: sub.features ? JSON.parse(sub.features) : []
    }));
    
    res.json({ success: true, data: parsedSubscriptions });
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { user_id, plan_name, price, billing_cycle, start_date, end_date, status, features } = req.body;
    
    // Convert features array to JSON string
    const featuresJson = JSON.stringify(features || []);
    
    const insertQuery = `
      INSERT INTO subscriptions (user_id, plan_name, price, billing_cycle, start_date, end_date, status, features) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [
      user_id, plan_name, price, billing_cycle, start_date, end_date, status || 'active', featuresJson
    ]);
    
    // Fetch the newly created subscription with user details
    const selectQuery = `
      SELECT s.*, u.first_name, u.last_name, u.email 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.id = ?
    `;
    
    const rows = await executeQuery(selectQuery, [result.insertId]);
    
    // Parse features JSON string
    const subscription = {
      ...rows[0],
      features: rows[0].features ? JSON.parse(rows[0].features) : []
    };
    
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan_name, price, billing_cycle, start_date, end_date, status, features } = req.body;
    
    // Check if subscription exists
    const rows = await executeQuery('SELECT * FROM subscriptions WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    
    // Convert features array to JSON string
    const featuresJson = features ? JSON.stringify(features) : rows[0].features;
    
    const updateQuery = `
      UPDATE subscriptions 
      SET plan_name = ?, price = ?, billing_cycle = ?, start_date = ?, end_date = ?, status = ?, features = ? 
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, [
      plan_name, price, billing_cycle, start_date, end_date, status, featuresJson, id
    ]);
    
    // Fetch the updated subscription with user details
    const selectQuery = `
      SELECT s.*, u.first_name, u.last_name, u.email 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.id = ?
    `;
    
    const updatedRows = await executeQuery(selectQuery, [id]);
    
    // Parse features JSON string
    const subscription = {
      ...updatedRows[0],
      features: updatedRows[0].features ? JSON.parse(updatedRows[0].features) : []
    };
    
    res.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if subscription exists
    const rows = await executeQuery('SELECT * FROM subscriptions WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    
    await executeQuery('DELETE FROM subscriptions WHERE id = ?', [id]);
    
    res.json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};