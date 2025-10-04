const Joi = require('joi');

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    dateOfBirth: Joi.date().optional()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  quizSubmission: Joi.object({
    gender: Joi.string().valid('male', 'female').required(),
    answers: Joi.object().required()
  }),
  outfitRating: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    feedback: Joi.string().optional()
  }),
  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    dateOfBirth: Joi.date().optional(),
    preferences: Joi.object().optional()
  })
};

module.exports = { validateRequest, schemas };
