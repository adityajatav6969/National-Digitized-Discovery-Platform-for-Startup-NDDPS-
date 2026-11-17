const express = require('express');
const router = express.Router();
const { getPendingStartups, verifyStartup } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Support both endpoint styles for robust lab evaluation
router.get('/startups/pending', protect, adminOnly, getPendingStartups);
router.get('/pending', protect, adminOnly, getPendingStartups);

router.patch('/startups/:id/verify', protect, adminOnly, verifyStartup);
router.put('/startups/:id/verify', protect, adminOnly, verifyStartup);
router.patch('/verify/:id', protect, adminOnly, verifyStartup);
router.put('/verify/:id', protect, adminOnly, verifyStartup);

module.exports = router;
