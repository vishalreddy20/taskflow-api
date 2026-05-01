const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../../controllers/task.controller');
const auth = require('../../middleware/auth');
const { createTaskValidator, updateTaskValidator } = require('../../validators/task.validator');

router.use(auth);

router.get('/', getTasks);
router.post('/', createTaskValidator, createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTaskValidator, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
