// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/validation/subscriptionValidation');

// All routes require authentication
// router.use(authMiddleware);

// Get all subscriptions
router.get('/', subscriptionController.getAllSubscriptions);

// Get subscription by ID
router.get('/:id', subscriptionController.getSubscriptionById);

// Get subscriptions by user ID
router.get('/user/:userId', subscriptionController.getSubscriptionsByUser);

// Create new subscription
router.post('/', subscriptionController.createSubscription);

// Update subscription
router.put('/:id', subscriptionController.updateSubscription);

// Delete subscription
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;