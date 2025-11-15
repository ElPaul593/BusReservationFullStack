const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');

router.get('/me', authenticateToken, (req, res) => {
  const user = req.user;
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { password, __v, ...safeUser } =
    user.toObject ? user.toObject() : user;

  res.json(safeUser);
});

router.put('/me', authenticateToken, async (req, res) => {
  try {
    req.params = { id: req.user.id.toString() };
    await userController.update(req, res);
  } catch (err) {}
});

router.get('/', authenticateToken, requireAdminAccess, userController.getAll);
router.get('/:id', authenticateToken, requireAdminAccess, userController.getOne);
router.post('/', authenticateToken, requireAdminAccess, userController.create);
router.put('/:id', authenticateToken, requireAdminAccess, userController.update);
router.delete('/:id', authenticateToken, requireAdminAccess, userController.remove);

module.exports = router;
