const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.'),
  body('status')
    .optional()
    .trim()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Status must be one of: pending, in-progress, done.'),
  body('priority')
    .optional()
    .trim()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high.'),
  body('description')
    .optional()
    .trim(),
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty.'),
  body('status')
    .optional()
    .trim()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Status must be one of: pending, in-progress, done.'),
  body('priority')
    .optional()
    .trim()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high.'),
  body('description')
    .optional()
    .trim(),
];

module.exports = { createTaskValidator, updateTaskValidator };
