const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdminAccess, requireDashboardAccess } = require('../middleware/auth');

// Todas las rutas requieren autenticación y acceso de administrador
// Nota: añadimos rutas públicas para que el usuario autenticado obtenga
// y actualice sus propios datos: GET /users/me y PUT /users/me
router.get('/me', authenticateToken, (req, res) => {
	// req.user se establece en authenticateToken
	const user = req.user;
	if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
	// No devolver password
	const { password, __v, ...safeUser } = user.toObject ? user.toObject() : user;
	res.json(safeUser);
});

// Ruta para que el usuario actualice su propio perfil
router.put('/me', authenticateToken, async (req, res) => {
	try {
		// Usar el ID del usuario autenticado
		req.params = { id: req.user._id.toString() };
		await userController.update(req, res);
	} catch (err) {
		// El error ya se maneja en el controlador
	}
});

// Rutas de gestión de usuarios - solo accesibles para cédulas autorizadas
router.get('/', authenticateToken, requireDashboardAccess, userController.getAll);   
router.get('/:id', authenticateToken, requireDashboardAccess, userController.getOne);   
router.post('/', authenticateToken, requireDashboardAccess, userController.create);  
router.put('/:id', authenticateToken, requireDashboardAccess, userController.update);
router.delete('/:id', authenticateToken, requireDashboardAccess, userController.remove);


module.exports = router;
