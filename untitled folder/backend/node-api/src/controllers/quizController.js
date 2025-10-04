const { Quiz } = require('../models');
const axios = require('axios');

class QuizController {
    async getQuestions(req, res) {
        try {
            const { gender } = req.query;
            
            if (!['male', 'female'].includes(gender)) {
                return res.status(400).json({ error: 'Invalid gender. Must be male or female.' });
            }

            const questions = {
                female: [
                    {
                        id: 1,
                        question: "Your ideal Saturday morning looks like…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Sipping tea on a balcony with a sea breeze", aesthetic: "Coastal Grandma" },
                            { value: "B", text: "Browsing a local bookstore for poetry", aesthetic: "Dark Academia" },
                            { value: "C", text: "Brunch in the city wearing a silky blouse", aesthetic: "Parisian Chic" },
                            { value: "D", text: "Thrifting for quirky accessories", aesthetic: "Indie Art Girl" }
                        ]
                    },
                    {
                        id: 2,
                        question: "The colors in your dream wardrobe are…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Beige, ivory, and warm neutrals", aesthetic: "Old Money" },
                            { value: "B", text: "Black, charcoal, and deep jewel tones", aesthetic: "Grunge Fashion" },
                            { value: "C", text: "Pastels, pinks, and creamy whites", aesthetic: "Soft Feminine" },
                            { value: "D", text: "Neon, holographic, and bold brights", aesthetic: "Y2K" }
                        ]
                    },
                    {
                        id: 3,
                        question: "The perfect outerwear piece is…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Oversized knit cardigan", aesthetic: "Cottagecore" },
                            { value: "B", text: "Tailored trench coat", aesthetic: "Clean Girl Minimalist" },
                            { value: "C", text: "Leather moto jacket", aesthetic: "Edgy Leather & Rock" },
                            { value: "D", text: "Cropped bomber jacket", aesthetic: "Streetwear" }
                        ]
                    },
                    {
                        id: 4,
                        question: "Your go-to footwear vibe is…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "White sneakers", aesthetic: "Sporty Luxe" },
                            { value: "B", text: "Doc Martens or chunky boots", aesthetic: "E-girl" },
                            { value: "C", text: "Ballet flats or slingbacks", aesthetic: "Parisian Chic" },
                            { value: "D", text: "Strappy sandals with gold accents", aesthetic: "Boho Luxe" }
                        ]
                    },
                    {
                        id: 5,
                        question: "Which bag would you carry?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "A straw tote with a silk scarf", aesthetic: "Coastal Grandma" },
                            { value: "B", text: "Structured leather satchel", aesthetic: "Old Money" },
                            { value: "C", text: "Micro bag in a bold color", aesthetic: "Y2K" },
                            { value: "D", text: "Quilted crossbody with chain", aesthetic: "Preppy Chic" }
                        ]
                    },
                    {
                        id: 6,
                        question: "Your favorite season for fashion is…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Fall with layered knits", aesthetic: "Light Academia" },
                            { value: "B", text: "Summer with linen dresses", aesthetic: "Coastal Grandma" },
                            { value: "C", text: "Winter with oversized coats", aesthetic: "Dark Academia" },
                            { value: "D", text: "Spring with floral skirts", aesthetic: "Soft Feminine" }
                        ]
                    },
                    {
                        id: 7,
                        question: "You're invited to a last-minute party. You wear…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Metallic mini skirt and crop top", aesthetic: "Y2K" },
                            { value: "B", text: "Silk slip dress with kitten heels", aesthetic: "Old Money" },
                            { value: "C", text: "Graphic tee with cargo pants", aesthetic: "Streetwear" },
                            { value: "D", text: "Maxi skirt with layered jewelry", aesthetic: "Boho Luxe" }
                        ]
                    },
                    {
                        id: 8,
                        question: "Which activity excites you the most?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Farmers market stroll", aesthetic: "Cottagecore" },
                            { value: "B", text: "Rooftop cocktails", aesthetic: "Parisian Chic" },
                            { value: "C", text: "Music festival", aesthetic: "Boho Luxe" },
                            { value: "D", text: "Urban photography walk", aesthetic: "Indie Art Girl" }
                        ]
                    },
                    {
                        id: 9,
                        question: "Which print are you drawn to?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Pinstripes", aesthetic: "Preppy Chic" },
                            { value: "B", text: "Plaid", aesthetic: "Dark Academia" },
                            { value: "C", text: "Ditsy floral", aesthetic: "Cottagecore" },
                            { value: "D", text: "Abstract graphics", aesthetic: "Streetwear" }
                        ]
                    },
                    {
                        id: 10,
                        question: "Hair & beauty mood?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Sleek bun and minimal makeup", aesthetic: "Clean Girl Minimalist" },
                            { value: "B", text: "Messy waves with a bold lip", aesthetic: "Edgy Leather & Rock" },
                            { value: "C", text: "Soft curls with blush tones", aesthetic: "Soft Feminine" },
                            { value: "D", text: "Space buns and glitter eyeliner", aesthetic: "E-girl" }
                        ]
                    },
                    {
                        id: 11,
                        question: "Your dream city to live in…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Paris", aesthetic: "Parisian Chic" },
                            { value: "B", text: "New York", aesthetic: "Streetwear" },
                            { value: "C", text: "Florence", aesthetic: "Old Money" },
                            { value: "D", text: "Copenhagen", aesthetic: "Clean Girl Minimalist" }
                        ]
                    },
                    {
                        id: 12,
                        question: "Which fabric makes you feel most 'you'?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Linen", aesthetic: "Coastal Grandma" },
                            { value: "B", text: "Velvet", aesthetic: "Dark Academia" },
                            { value: "C", text: "Satin", aesthetic: "Soft Feminine" },
                            { value: "D", text: "Leather", aesthetic: "Edgy Leather & Rock" }
                        ]
                    }
                ],
                male: [
                    {
                        id: 1,
                        question: "Ideal weekend activity?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Sailing or golfing", aesthetic: "Old Money Gentleman" },
                            { value: "B", text: "Skating with friends", aesthetic: "Skater Street" },
                            { value: "C", text: "Attending an indie band gig", aesthetic: "Rock/Metal Grunge" },
                            { value: "D", text: "Hiking or surfing", aesthetic: "Coastal Casual" }
                        ]
                    },
                    {
                        id: 2,
                        question: "Go-to color palette?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Navy, beige, and cream", aesthetic: "Minimalist Neutral Luxe" },
                            { value: "B", text: "Black, steel grey, and dark green", aesthetic: "Techwear Futuristic" },
                            { value: "C", text: "Burgundy, camel, and forest green", aesthetic: "Dark Academia" },
                            { value: "D", text: "Bright reds, yellows, and blues", aesthetic: "Retro 90s Casual" }
                        ]
                    },
                    {
                        id: 3,
                        question: "Preferred outerwear?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Double-breasted blazer", aesthetic: "Old Money Gentleman" },
                            { value: "B", text: "Puffer jacket", aesthetic: "Streetwear Hypebeast" },
                            { value: "C", text: "Denim jacket", aesthetic: "Retro 90s Casual" },
                            { value: "D", text: "Long trench coat", aesthetic: "Light Academia" }
                        ]
                    },
                    {
                        id: 4,
                        question: "Your ideal shoes are…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Loafers", aesthetic: "Old Money Gentleman" },
                            { value: "B", text: "Chunky sneakers", aesthetic: "Streetwear Hypebeast" },
                            { value: "C", text: "Hiking boots", aesthetic: "Bohemian Traveler" },
                            { value: "D", text: "Combat boots", aesthetic: "Rock/Metal Grunge" }
                        ]
                    },
                    {
                        id: 5,
                        question: "Pick a bag:",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Leather briefcase", aesthetic: "Business Formal Power" },
                            { value: "B", text: "Crossbody sling", aesthetic: "Techwear Futuristic" },
                            { value: "C", text: "Canvas backpack", aesthetic: "Bohemian Traveler" },
                            { value: "D", text: "Belt bag", aesthetic: "Streetwear Hypebeast" }
                        ]
                    },
                    {
                        id: 6,
                        question: "Favorite season for outfits?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Summer linen", aesthetic: "Coastal Casual" },
                            { value: "B", text: "Fall layering", aesthetic: "Dark Academia" },
                            { value: "C", text: "Winter wool coats", aesthetic: "Minimalist Neutral Luxe" },
                            { value: "D", text: "Spring polos", aesthetic: "Preppy Ivy League" }
                        ]
                    },
                    {
                        id: 7,
                        question: "At a party, you're wearing…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Crisp button-down and trousers", aesthetic: "Urban Smart Casual" },
                            { value: "B", text: "Hoodie and cargo pants", aesthetic: "Streetwear Hypebeast" },
                            { value: "C", text: "Graphic tee and ripped jeans", aesthetic: "Rock/Metal Grunge" },
                            { value: "D", text: "Linen shirt and chinos", aesthetic: "Coastal Casual" }
                        ]
                    },
                    {
                        id: 8,
                        question: "Which print do you gravitate toward?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Pinstripes", aesthetic: "Business Formal Power" },
                            { value: "B", text: "Plaid", aesthetic: "Light Academia" },
                            { value: "C", text: "Tie-dye", aesthetic: "Bohemian Traveler" },
                            { value: "D", text: "Camouflage", aesthetic: "Techwear Futuristic" }
                        ]
                    },
                    {
                        id: 9,
                        question: "Hairstyle vibe?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Slick back", aesthetic: "Old Money Gentleman" },
                            { value: "B", text: "Messy waves", aesthetic: "Rock/Metal Grunge" },
                            { value: "C", text: "Clean fade", aesthetic: "Streetwear Hypebeast" },
                            { value: "D", text: "Shoulder-length natural", aesthetic: "Bohemian Traveler" }
                        ]
                    },
                    {
                        id: 10,
                        question: "Dream city to live in…",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Milan", aesthetic: "Old Money Gentleman" },
                            { value: "B", text: "Tokyo", aesthetic: "Techwear Futuristic" },
                            { value: "C", text: "New York", aesthetic: "Urban Smart Casual" },
                            { value: "D", text: "Los Angeles", aesthetic: "Skater Street" }
                        ]
                    },
                    {
                        id: 11,
                        question: "Favorite fabric?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Linen", aesthetic: "Coastal Casual" },
                            { value: "B", text: "Tweed", aesthetic: "Dark Academia" },
                            { value: "C", text: "Leather", aesthetic: "Rock/Metal Grunge" },
                            { value: "D", text: "Wool", aesthetic: "Minimalist Neutral Luxe" }
                        ]
                    },
                    {
                        id: 12,
                        question: "Your watch preference?",
                        type: "multiple_choice",
                        options: [
                            { value: "A", text: "Gold classic analog", aesthetic: "Old Money Gentleman" },
                            { value: "B", text: "Digital sports watch", aesthetic: "Sporty Athleisure" },
                            { value: "C", text: "Minimalist silver", aesthetic: "Minimalist Neutral Luxe" },
                            { value: "D", text: "Smartwatch with tech features", aesthetic: "Techwear Futuristic" }
                        ]
                    }
                ]
            };

            res.json({
                questions: questions[gender],
                totalQuestions: questions[gender].length,
                aesthetics: gender === 'female' ? 
                    ['Coastal Grandma', 'Dark Academia', 'Parisian Chic', 'Indie Art Girl', 'Old Money', 'Grunge Fashion', 'Soft Feminine', 'Y2K', 'Cottagecore', 'Clean Girl Minimalist', 'Edgy Leather & Rock', 'Streetwear', 'Sporty Luxe', 'E-girl', 'Boho Luxe', 'Light Academia', 'Preppy Chic'] :
                    ['Old Money Gentleman', 'Streetwear Hypebeast', 'Dark Academia', 'Light Academia', 'Minimalist Neutral Luxe', 'Coastal Casual', 'Skater Street', 'Techwear Futuristic', 'Retro 90s Casual', 'Preppy Ivy League', 'Bohemian Traveler', 'Rock/Metal Grunge', 'Sporty Athleisure', 'Business Formal Power', 'Urban Smart Casual']
            });
        } catch (error) {
            console.error('Get questions error:', error);
            res.status(500).json({
                error: 'Failed to fetch questions',
                message: 'An error occurred while fetching quiz questions'
            });
        }
    }

    async submitQuiz(req, res) {
        try {
            const { gender, answers } = req.body;
            const userId = req.user.id;

            // Validate answers format
            if (!answers || typeof answers !== 'object') {
                return res.status(400).json({
                    error: 'Invalid answers format',
                    message: 'Answers must be provided as an object'
                });
            }

            // Create or update quiz
            const [quiz, created] = await Quiz.upsert({
                userId,
                gender,
                answers,
                isCompleted: true,
                completedAt: new Date()
            }, {
                returning: true
            });

            // Call AI service for aesthetic analysis
            try {
                const aiResponse = await axios.post(
                    `${process.env.AI_SERVICE_URL}/analyze-quiz`,
                    {
                        gender,
                        answers,
                        userId
                    },
                    {
                        timeout: 10000 // 10 second timeout
                    }
                );

                // Update quiz with AI analysis
                await quiz.update({
                    aestheticProfile: aiResponse.data.aestheticProfile,
                    score: aiResponse.data.score
                });

                console.log('✅ AI analysis completed successfully');

            } catch (aiError) {
                console.error('❌ AI service error:', aiError.message);
                
                // Fallback: Basic aesthetic analysis without AI service
                const fallbackProfile = this.analyzeFallbackAesthetic(gender, answers);
                await quiz.update({
                    aestheticProfile: fallbackProfile,
                    score: Math.floor(fallbackProfile.confidence_score * 100)
                });
            }

            res.status(created ? 201 : 200).json({
                message: 'Quiz submitted successfully',
                quiz: quiz.toJSON(),
                canRecommend: true
            });
        } catch (error) {
            console.error('Submit quiz error:', error);
            res.status(500).json({
                error: 'Failed to submit quiz',
                message: 'An error occurred while processing your quiz'
            });
        }
    }

    // Fallback aesthetic analysis if AI service is unavailable
    analyzeFallbackAesthetic(gender, answers) {
        const aestheticCounts = {};
        let totalAnswers = 0;

        // Count aesthetic occurrences from answers
        for (const [questionId, answer] of Object.entries(answers)) {
            if (answer && typeof answer === 'object' && answer.aesthetic) {
                const aesthetic = answer.aesthetic;
                aestheticCounts[aesthetic] = (aestheticCounts[aesthetic] || 0) + 1;
                totalAnswers++;
            }
        }

        // Find primary and secondary aesthetics
        const sortedAesthetics = Object.entries(aestheticCounts)
            .sort(([,a], [,b]) => b - a);

        const primaryAesthetic = sortedAesthetics[0] ? sortedAesthetics[0][0] : (gender === 'female' ? 'Soft Feminine' : 'Casual Smart');
        const secondaryAesthetic = sortedAesthetics[1] ? sortedAesthetics[1][0] : null;

        // Calculate confidence score
        const maxCount = sortedAesthetics[0] ? sortedAesthetics[0][1] : 1;
        const confidenceScore = totalAnswers > 0 ? Math.min(maxCount / totalAnswers, 1.0) : 0.5;

        // Extract color and occasion preferences
        const colorPreferences = [];
        const occasionPreferences = [];

        for (const [, answer] of Object.entries(answers)) {
            if (answer && typeof answer === 'object' && answer.text) {
                const text = answer.text.toLowerCase();
                
                // Extract colors
                const colors = ['black', 'white', 'navy', 'beige', 'cream', 'burgundy', 'camel', 'forest', 'bright', 'pastel', 'neutral', 'bold'];
                colors.forEach(color => {
                    if (text.includes(color) && !colorPreferences.includes(color)) {
                        colorPreferences.push(color);
                    }
                });

                // Extract occasions
                const occasions = ['casual', 'formal', 'party', 'work', 'sport', 'weekend', 'evening'];
                occasions.forEach(occasion => {
                    if (text.includes(occasion) && !occasionPreferences.includes(occasion)) {
                        occasionPreferences.push(occasion);
                    }
                });
            }
        }

        return {
            primary_style: primaryAesthetic,
            secondary_style: secondaryAesthetic,
            color_preferences: colorPreferences.slice(0, 5),
            occasion_preferences: occasionPreferences.slice(0, 3),
            confidence_score: confidenceScore,
            analysis_method: 'fallback'
        };
    }

    async getQuizHistory(req, res) {
        try {
            const userId = req.user.id;
            
            const quizzes = await Quiz.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']]
            });

            res.json({
                quizzes,
                totalQuizzes: quizzes.length
            });
        } catch (error) {
            console.error('Get quiz history error:', error);
            res.status(500).json({
                error: 'Failed to fetch quiz history',
                message: 'An error occurred while fetching your quiz history'
            });
        }
    }

    async getLatestQuiz(req, res) {
        try {
            const userId = req.user.id;
            
            const quiz = await Quiz.findOne({
                where: { userId, isCompleted: true },
                order: [['completedAt', 'DESC']]
            });

            if (!quiz) {
                return res.status(404).json({
                    error: 'No completed quiz found',
                    message: 'Please complete the style quiz first'
                });
            }

            res.json({
                quiz: quiz.toJSON()
            });
        } catch (error) {
            console.error('Get latest quiz error:', error);
            res.status(500).json({
                error: 'Failed to fetch latest quiz',
                message: 'An error occurred while fetching your latest quiz'
            });
        }
    }

    async deleteQuiz(req, res) {
        try {
            const { quizId } = req.params;
            const userId = req.user.id;

            const quiz = await Quiz.findOne({
                where: { id: quizId, userId }
            });

            if (!quiz) {
                return res.status(404).json({
                    error: 'Quiz not found',
                    message: 'Quiz not found or you do not have permission to delete it'
                });
            }

            await quiz.destroy();

            res.json({
                message: 'Quiz deleted successfully'
            });
        } catch (error) {
            console.error('Delete quiz error:', error);
            res.status(500).json({
                error: 'Failed to delete quiz',
                message: 'An error occurred while deleting the quiz'
            });
        }
    }
}

module.exports = new QuizController();