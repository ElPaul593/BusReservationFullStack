const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');

// Todas las rutas requieren autenticación y acceso de administrador
router.get('/', authenticateToken, requireAdminAccess, userController.getAll);   
router.get('/:id', authenticateToken, requireAdminAccess, userController.getOne);   
router.post('/', authenticateToken, requireAdminAccess, userController.create);  
router.put('/:id', authenticateToken, requireAdminAccess, userController.update);
router.delete('/:id', authenticateToken, requireAdminAccess, userController.remove);


module.exports = router;
