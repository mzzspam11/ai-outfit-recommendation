const router = require('express').Router();
const outfitController = require('../controllers/outfitController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/', outfitController.getAllOutfits);
router.get('/category/:category', outfitController.getOutfitsByCategory);
router.get('/:outfitId', outfitController.getOutfitById);
router.post('/', outfitController.createOutfit);
router.put('/:outfitId', outfitController.updateOutfit);
router.delete('/:outfitId', outfitController.deleteOutfit);

module.exports = router;
