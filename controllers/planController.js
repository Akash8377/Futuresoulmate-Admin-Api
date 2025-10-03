// controllers/planController.js
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

// Get all plans
exports.getAllPlans = async (req, res) => {
  try {
    const query = 'SELECT * FROM plans ORDER BY created_at DESC';
    const rows = await executeQuery(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM plans WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new plan
exports.createPlan = async (req, res) => {
  try {
    const { name, price, description, total_boosts, status } = req.body;
    
    const insertQuery = `
      INSERT INTO plans (name, price, description, total_boosts, status) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [
      name, 
      price, 
      description, 
      total_boosts || 0, 
      status || 'active'
    ]);
    
    // Fetch the newly created plan
    const selectQuery = 'SELECT * FROM plans WHERE id = ?';
    const rows = await executeQuery(selectQuery, [result.insertId]);
    
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update plan
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, total_boosts, status } = req.body;
    
    // Check if plan exists
    const rows = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    const updateQuery = `
      UPDATE plans 
      SET name = ?, price = ?, description = ?, total_boosts = ?, status = ? 
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, [
      name, 
      price, 
      description, 
      total_boosts, 
      status, 
      id
    ]);
    
    // Fetch the updated plan
    const selectQuery = 'SELECT * FROM plans WHERE id = ?';
    const updatedRows = await executeQuery(selectQuery, [id]);
    
    res.json({ success: true, data: updatedRows[0] });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update plan status
exports.updatePlanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if plan exists
    const rows = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    const updateQuery = 'UPDATE plans SET status = ? WHERE id = ?';
    await executeQuery(updateQuery, [status, id]);
    
    // Fetch the updated plan
    const selectQuery = 'SELECT * FROM plans WHERE id = ?';
    const updatedRows = await executeQuery(selectQuery, [id]);
    
    res.json({ success: true, data: updatedRows[0] });
  } catch (error) {
    console.error('Error updating plan status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete plan
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if plan exists
    const rows = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    await executeQuery('DELETE FROM plans WHERE id = ?', [id]);
    
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// // controllers/planController.js
// const db = require('../services/db');

// // Helper function to execute queries with promises
// const executeQuery = (query, params = []) => {
//   return new Promise((resolve, reject) => {
//     db.query(query, params, (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// // Get all plans
// exports.getAllPlans = async (req, res) => {
//   try {
//     const query = 'SELECT * FROM plans ORDER BY created_at DESC';
//     const rows = await executeQuery(query);
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error('Error fetching plans:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Get plan by ID
// exports.getPlanById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const query = 'SELECT * FROM plans WHERE id = ?';
//     const rows = await executeQuery(query, [id]);
    
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Plan not found' });
//     }
    
//     res.json({ success: true, data: rows[0] });
//   } catch (error) {
//     console.error('Error fetching plan:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Create new plan
// exports.createPlan = async (req, res) => {
//   try {
//     const { name, price, description, status } = req.body;
    
//     const insertQuery = `
//       INSERT INTO plans (name, price, description, status) 
//       VALUES (?, ?, ?, ?)
//     `;
    
//     const result = await executeQuery(insertQuery, [
//       name, price, description, status || 'active'
//     ]);
    
//     // Fetch the newly created plan
//     const selectQuery = 'SELECT * FROM plans WHERE id = ?';
//     const rows = await executeQuery(selectQuery, [result.insertId]);
    
//     res.status(201).json({ success: true, data: rows[0] });
//   } catch (error) {
//     console.error('Error creating plan:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Update plan
// exports.updatePlan = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, price, description, status } = req.body;
    
//     // Check if plan exists
//     const rows = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Plan not found' });
//     }
    
//     const updateQuery = `
//       UPDATE plans 
//       SET name = ?, price = ?, description = ?, status = ? 
//       WHERE id = ?
//     `;
    
//     await executeQuery(updateQuery, [
//       name, price, description, status, id
//     ]);
    
//     // Fetch the updated plan
//     const selectQuery = 'SELECT * FROM plans WHERE id = ?';
//     const updatedRows = await executeQuery(selectQuery, [id]);
    
//     res.json({ success: true, data: updatedRows[0] });
//   } catch (error) {
//     console.error('Error updating plan:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Update plan status
// exports.updatePlanStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     // Check if plan exists
//     const rows = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Plan not found' });
//     }
    
//     const updateQuery = 'UPDATE plans SET status = ? WHERE id = ?';
//     await executeQuery(updateQuery, [status, id]);
    
//     // Fetch the updated plan
//     const selectQuery = 'SELECT * FROM plans WHERE id = ?';
//     const updatedRows = await executeQuery(selectQuery, [id]);
    
//     res.json({ success: true, data: updatedRows[0] });
//   } catch (error) {
//     console.error('Error updating plan status:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Delete plan
// exports.deletePlan = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if plan exists
//     const rows = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Plan not found' });
//     }
    
//     await executeQuery('DELETE FROM plans WHERE id = ?', [id]);
    
//     res.json({ success: true, message: 'Plan deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting plan:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };