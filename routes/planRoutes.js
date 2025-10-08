// routes/planRoutes.js
const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// Get all plans
router.get('/', planController.getAllPlans);

// Get plan by ID
router.get('/:id', planController.getPlanById);

// Create new plan
router.post('/', planController.createPlan);

// Update plan
router.put('/:id', planController.updatePlan);

// Update plan status
router.patch('/:id/status', planController.updatePlanStatus);

// Delete plan
router.delete('/:id', planController.deletePlan);


module.exports = router;