// routes/planServiceRoutes.js
const express = require('express');
const router = express.Router();
const planServiceController = require('../controllers/planServiceController');

router.get('/', planServiceController.getAllPlanServices);
router.get('/:id', planServiceController.getPlanServiceById);
router.post('/', planServiceController.createPlanService);
router.put('/:id', planServiceController.updatePlanService);
router.patch('/:id/status', planServiceController.updatePlanServiceStatus);
router.delete('/:id', planServiceController.deletePlanService);

module.exports = router;