const express = require('express');
const { logsController } = require('../controllers/logs.controller');

const router = express.Router();

router.get('/', logsController);

module.exports = router;
