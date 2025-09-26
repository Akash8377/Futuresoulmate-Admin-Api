// middleware/validation/subscriptionValidation.js
const { body } = require('express-validator');

const validateSubscription = [
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),
  body('plan_name')
    .notEmpty()
    .withMessage('Plan name is required')
    .isLength({ max: 100 })
    .withMessage('Plan name must be less than 100 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Valid price is required'),
  body('billing_cycle')
    .isIn(['monthly', 'quarterly', 'yearly'])
    .withMessage('Valid billing cycle is required'),
  body('start_date')
    .isDate()
    .withMessage('Valid start date is required'),
  body('end_date')
    .isDate()
    .withMessage('Valid end date is required'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'canceled', 'expired'])
    .withMessage('Valid status is required'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
];

module.exports = { validateSubscription };