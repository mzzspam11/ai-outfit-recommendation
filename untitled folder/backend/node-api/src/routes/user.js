const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

router.use(authenticateToken);
router.get('/profile', userController.getProfile);
router.put('/profile', validateRequest(schemas.updateProfile), userController.updateProfile);
router.put('/preferences', userController.updatePreferences);
router.delete('/account', userController.deleteAccount);

router.get('/style-history', userController.getStyleHistory);
router.get('/saved-outfits', userController.getSavedOutfits);
router.get('/dashboard-stats', userController.getDashboardStats);

module.exports = router;
