const router = require('express').Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

router.use(authenticateToken);
router.get('/', recommendationController.getRecommendations);
router.get('/similar/:outfitId', recommendationController.getSimilarOutfits);
router.post('/like/:outfitId', recommendationController.likeOutfit);
router.post('/save/:outfitId', recommendationController.saveOutfit);
router.post('/rate/:outfitId', validateRequest(schemas.outfitRating), recommendationController.rateOutfit);

module.exports = router;
