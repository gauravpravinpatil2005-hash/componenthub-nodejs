const express = require('express');
const validate = require('../middleware/validateRequest');
const controller = require('../controllers/requestController');

const router = express.Router();

router.get('/', controller.listRequests);          // GET  /api/requests
router.get('/:id', controller.getRequest);         // GET  /api/requests/:id
router.post('/', validate, controller.createRequest); // POST /api/requests

module.exports = router;
