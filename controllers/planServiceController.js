// controllers/planServiceController.js
const db = require('../services/db');

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

// Get all plan services
exports.getAllPlanServices = async (req, res) => {
  try {
    const query = 'SELECT * FROM plan_services ORDER BY created_at DESC';
    const rows = await executeQuery(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching plan services:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get plan service by ID
exports.getPlanServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM plan_services WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan service not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching plan service:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new plan service
exports.createPlanService = async (req, res) => {
  try {
    const { name, description, status = 'active' } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Service name is required' });
    }
    
    const query = 'INSERT INTO plan_services (name, description, status) VALUES (?, ?, ?)';
    const result = await executeQuery(query, [name, description, status]);
    
    const selectQuery = 'SELECT * FROM plan_services WHERE id = ?';
    const rows = await executeQuery(selectQuery, [result.insertId]);
    
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating plan service:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update plan service
exports.updatePlanService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    // Check if service exists
    const existingService = await executeQuery('SELECT * FROM plan_services WHERE id = ?', [id]);
    if (existingService.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan service not found' });
    }
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Service name is required' });
    }
    
    const query = 'UPDATE plan_services SET name = ?, description = ?, status = ? WHERE id = ?';
    await executeQuery(query, [name, description, status, id]);
    
    const selectQuery = 'SELECT * FROM plan_services WHERE id = ?';
    const rows = await executeQuery(selectQuery, [id]);
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating plan service:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update plan service status
exports.updatePlanServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if service exists
    const existingService = await executeQuery('SELECT * FROM plan_services WHERE id = ?', [id]);
    if (existingService.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan service not found' });
    }
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status is required' });
    }
    
    const query = 'UPDATE plan_services SET status = ? WHERE id = ?';
    await executeQuery(query, [status, id]);
    
    const selectQuery = 'SELECT * FROM plan_services WHERE id = ?';
    const rows = await executeQuery(selectQuery, [id]);
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating plan service status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete plan service
exports.deletePlanService = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if service exists
    const existingService = await executeQuery('SELECT * FROM plan_services WHERE id = ?', [id]);
    if (existingService.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan service not found' });
    }
    
    // Check if service is used in any plans
    const planUsage = await executeQuery(
      'SELECT COUNT(*) as count FROM plan_service_mappings WHERE service_id = ?',
      [id]
    );
    
    if (planUsage[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete service. It is currently used in one or more plans.' 
      });
    }
    
    await executeQuery('DELETE FROM plan_services WHERE id = ?', [id]);
    
    res.json({ success: true, message: 'Plan service deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan service:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};