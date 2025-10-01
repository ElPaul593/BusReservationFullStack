const express = require('express');
const router = express.Router();
const rutaController = require('../controllers/rutaController');

router.get('/', rutaController.getAll);
router.post('/', rutaController.create);

module.exports = router;
