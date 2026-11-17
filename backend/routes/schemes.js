const express = require('express');
const router = express.Router();
const { getSchemes, getSchemeById } = require('../controllers/schemeController');
const { mapSchemesForStartup } = require('../controllers/schemeMappingController');

router.get('/map/:startupId', mapSchemesForStartup);
router.get('/', getSchemes);
router.get('/:id', getSchemeById);

module.exports = router;
