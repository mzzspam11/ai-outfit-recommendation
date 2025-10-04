const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

router.post('/register', validateRequest(schemas.register), authController.register);
router.post('/login', validateRequest(schemas.login), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
