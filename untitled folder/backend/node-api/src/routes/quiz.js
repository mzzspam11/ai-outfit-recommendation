const router = require('express').Router();
const quizController = require('../controllers/quizController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

router.use(authenticateToken);
router.get('/questions', quizController.getQuestions);
router.post('/submit', validateRequest(schemas.quizSubmission), quizController.submitQuiz);
router.get('/history', quizController.getQuizHistory);
router.get('/latest', quizController.getLatestQuiz);
router.delete('/:quizId', quizController.deleteQuiz);

module.exports = router;
