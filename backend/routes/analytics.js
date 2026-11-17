const express = require('express');
const router = express.Router();
const { getOverview } = require('../controllers/analyticsController');

router.get('/overview', getOverview);
router.get('/', getOverview);

module.exports = router;
