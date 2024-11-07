const Joi = require('joi');

// Define the schema for user validation
const userValidator = {
  // For user signup validation
  signup: Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name should be at least 3 characters long',
        'string.max': 'Name should be no longer than 50 characters',
        'any.required': 'Name is required',
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot be longer than 100 characters',
        'any.required': 'Password is required',
      }),
    confirm_password: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords must match',
        'any.required': 'Confirm password is required',
      }),
  }),

  // For user login validation
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
      }),
  }),

  // For updating user profile
  updateProfile: Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .optional()
      .messages({
        'string.min': 'Name should be at least 3 characters long',
        'string.max': 'Name should be no longer than 50 characters',
      }),
    email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.email': 'Invalid email format',
      }),
    password: Joi.string()
      .min(6)
      .optional()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
      }),
  }),
};

// Exporting the validator object
module.exports = userValidator;