const express = require('express');
const router = express.Router();
const {
  createStartup,
  getStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
} = require('../controllers/startupController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getStartups)
  .post(protect, createStartup);

router.route('/:id')
  .get(getStartupById)
  .put(protect, updateStartup)
  .delete(protect, deleteStartup);

module.exports = router;
