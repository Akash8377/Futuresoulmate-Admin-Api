// controllers/planController.js - Updated to work with direct connection
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

// Get all plans with their services and counts
exports.getAllPlans = async (req, res) => {
  try {
    const plansQuery = 'SELECT * FROM plans ORDER BY created_at DESC';
    const plans = await executeQuery(plansQuery);
    
    // Get services for each plan with counts
    for (let plan of plans) {
      const servicesQuery = `
        SELECT ps.*, psm.service_count 
        FROM plan_services ps
        INNER JOIN plan_service_mappings psm ON ps.id = psm.service_id
        WHERE psm.plan_id = ? AND ps.status = 'active'
      `;
      const services = await executeQuery(servicesQuery, [plan.id]);
      plan.services = services;
    }
    
    res.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get plan by ID with services and counts
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const planQuery = 'SELECT * FROM plans WHERE id = ?';
    const planRows = await executeQuery(planQuery, [id]);
    
    if (planRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    const servicesQuery = `
      SELECT ps.*, psm.service_count 
      FROM plan_services ps
      INNER JOIN plan_service_mappings psm ON ps.id = psm.service_id
      WHERE psm.plan_id = ? AND ps.status = 'active'
    `;
    const services = await executeQuery(servicesQuery, [id]);
    
    const plan = {
      ...planRows[0],
      services: services
    };
    
    res.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new plan with services and counts
exports.createPlan = async (req, res) => {
  try {
    const { name, price, description, status, services = [] } = req.body;
    
    console.log('Received services data:', services); // Debug log
    
    // Insert plan
    const planQuery = `
      INSERT INTO plans (name, price, description, status) 
      VALUES (?, ?, ?, ?)
    `;
    
    const planResult = await executeQuery(planQuery, [
      name, price, description, status || 'active'
    ]);
    
    const planId = planResult.insertId;
    
    // Insert service mappings with counts
    if (services.length > 0) {
      // Validate service IDs exist and prepare mapping data
      const mappingData = [];
      
      for (const service of services) {
        // Check if service exists and is active
        const serviceCheck = await executeQuery(
          'SELECT id FROM plan_services WHERE id = ? AND status = "active"',
          [service.id]
        );
        
        if (serviceCheck.length > 0) {
          mappingData.push([planId, service.id, service.count || 0]);
        }
      }
      
      if (mappingData.length > 0) {
        const mappingQuery = 'INSERT INTO plan_service_mappings (plan_id, service_id, service_count) VALUES ?';
        await executeQuery(mappingQuery, [mappingData]);
      }
    }
    
    // Fetch created plan with services
    const createdPlan = await executeQuery('SELECT * FROM plans WHERE id = ?', [planId]);
    const planServices = await executeQuery(
      `SELECT ps.*, psm.service_count 
       FROM plan_services ps 
       INNER JOIN plan_service_mappings psm ON ps.id = psm.service_id 
       WHERE psm.plan_id = ? AND ps.status = 'active'`,
      [planId]
    );
    
    const plan = {
      ...createdPlan[0],
      services: planServices
    };
    
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error('Error creating plan:', error);
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        success: false, 
        message: 'One or more services do not exist' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update plan with services and counts
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, status, services = [] } = req.body;
    
    console.log('Received services data for update:', services); // Debug log
    
    // Check if plan exists
    const existingPlan = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
    if (existingPlan.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    // Update plan
    const planQuery = `
      UPDATE plans 
      SET name = ?, price = ?, description = ?, status = ? 
      WHERE id = ?
    `;
    
    await executeQuery(planQuery, [
      name, price, description, status, id
    ]);
    
    // Update services - remove existing and add new ones with counts
    await executeQuery('DELETE FROM plan_service_mappings WHERE plan_id = ?', [id]);
    
    if (services.length > 0) {
      // Validate service IDs exist and prepare mapping data
      const mappingData = [];
      
      for (const service of services) {
        // Check if service exists and is active
        const serviceCheck = await executeQuery(
          'SELECT id FROM plan_services WHERE id = ? AND status = "active"',
          [service.id]
        );
        
        if (serviceCheck.length > 0) {
          mappingData.push([id, service.id, service.count || 0]);
        }
      }
      
      if (mappingData.length > 0) {
        const mappingQuery = 'INSERT INTO plan_service_mappings (plan_id, service_id, service_count) VALUES ?';
        await executeQuery(mappingQuery, [mappingData]);
      }
    }
    
    // Fetch updated plan with services
    const updatedPlan = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
    const planServices = await executeQuery(
      `SELECT ps.*, psm.service_count 
       FROM plan_services ps 
       INNER JOIN plan_service_mappings psm ON ps.id = psm.service_id 
       WHERE psm.plan_id = ? AND ps.status = 'active'`,
      [id]
    );
    
    const plan = {
      ...updatedPlan[0],
      services: planServices
    };
    
    res.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error updating plan:', error);
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        success: false, 
        message: 'One or more services do not exist' 
      });
    }
    
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
    
    const plan = {
      ...updatedRows[0],
      services: updatedRows[0].services ? JSON.parse(updatedRows[0].services) : []
    };
    
    res.json({ success: true, data: plan });
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



// // controllers/planController.js - Update these methods
// const db = require('../services/db');

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

// // Get all plans with their services
// exports.getAllPlans = async (req, res) => {
//   try {
//     const plansQuery = 'SELECT * FROM plans ORDER BY created_at DESC';
//     const plans = await executeQuery(plansQuery);
    
//     // Get services for each plan
//     for (let plan of plans) {
//       const servicesQuery = `
//         SELECT ps.* FROM plan_services ps
//         INNER JOIN plan_service_mappings psm ON ps.id = psm.service_id
//         WHERE psm.plan_id = ? AND ps.status = 'active'
//       `;
//       const services = await executeQuery(servicesQuery, [plan.id]);
//       plan.services = services;
//     }
    
//     res.json({ success: true, data: plans });
//   } catch (error) {
//     console.error('Error fetching plans:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Get plan by ID with services
// exports.getPlanById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const planQuery = 'SELECT * FROM plans WHERE id = ?';
//     const planRows = await executeQuery(planQuery, [id]);
    
//     if (planRows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Plan not found' });
//     }
    
//     const servicesQuery = `
//       SELECT ps.* FROM plan_services ps
//       INNER JOIN plan_service_mappings psm ON ps.id = psm.service_id
//       WHERE psm.plan_id = ? AND ps.status = 'active'
//     `;
//     const services = await executeQuery(servicesQuery, [id]);
    
//     const plan = {
//       ...planRows[0],
//       services: services
//     };
    
//     res.json({ success: true, data: plan });
//   } catch (error) {
//     console.error('Error fetching plan:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Create new plan with services
// exports.createPlan = async (req, res) => {
//   try {
//     const { name, price, description, total_boosts, status, services = [] } = req.body;
    
//     // Insert plan
//     const planQuery = `
//       INSERT INTO plans (name, price, description, total_boosts, status) 
//       VALUES (?, ?, ?, ?, ?)
//     `;
    
//     const result = await executeQuery(planQuery, [
//       name, price, description, total_boosts || 0, status || 'active'
//     ]);
    
//     const planId = result.insertId;
    
//     // Insert service mappings
//     if (services.length > 0) {
//       const mappingValues = services.map(serviceId => [planId, serviceId]);
//       const mappingQuery = 'INSERT INTO plan_service_mappings (plan_id, service_id) VALUES ?';
//       await executeQuery(mappingQuery, [mappingValues]);
//     }
    
//     // Fetch created plan with services
//     const createdPlan = await executeQuery('SELECT * FROM plans WHERE id = ?', [planId]);
//     const planServices = await executeQuery(
//       `SELECT ps.* FROM plan_services ps 
//        INNER JOIN plan_service_mappings psm ON ps.id = psm.service_id 
//        WHERE psm.plan_id = ? AND ps.status = 'active'`,
//       [planId]
//     );
    
//     const plan = {
//       ...createdPlan[0],
//       services: planServices
//     };
    
//     res.status(201).json({ success: true, data: plan });
//   } catch (error) {
//     console.error('Error creating plan:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Update plan with services
// exports.updatePlan = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, price, description, total_boosts, status, services = [] } = req.body;
    
//     // Check if plan exists
//     const existingPlan = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
//     if (existingPlan.length === 0) {
//       return res.status(404).json({ success: false, message: 'Plan not found' });
//     }
    
//     // Update plan
//     const planQuery = `
//       UPDATE plans 
//       SET name = ?, price = ?, description = ?, total_boosts = ?, status = ? 
//       WHERE id = ?
//     `;
    
//     await executeQuery(planQuery, [
//       name, price, description, total_boosts, status, id
//     ]);
    
//     // Update services - remove existing and add new ones
//     await executeQuery('DELETE FROM plan_service_mappings WHERE plan_id = ?', [id]);
    
//     if (services.length > 0) {
//       const mappingValues = services.map(serviceId => [id, serviceId]);
//       const mappingQuery = 'INSERT INTO plan_service_mappings (plan_id, service_id) VALUES ?';
//       await executeQuery(mappingQuery, [mappingValues]);
//     }
    
//     // Fetch updated plan with services
//     const updatedPlan = await executeQuery('SELECT * FROM plans WHERE id = ?', [id]);
//     const planServices = await executeQuery(
//       `SELECT ps.* FROM plan_services ps 
//        INNER JOIN plan_service_mappings psm ON ps.id = psm.service_id 
//        WHERE psm.plan_id = ? AND ps.status = 'active'`,
//       [id]
//     );
    
//     const plan = {
//       ...updatedPlan[0],
//       services: planServices
//     };
    
//     res.json({ success: true, data: plan });
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
    
//     const plan = {
//       ...updatedRows[0],
//       services: updatedRows[0].services ? JSON.parse(updatedRows[0].services) : []
//     };
    
//     res.json({ success: true, data: plan });
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