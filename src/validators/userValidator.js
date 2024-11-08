const Joi = require('joi');

// Define the schema for user validation
const userValidator = {
  // For user signup validation
  signup: Joi.object({
    role_id: Joi.number()
      .valid(1, 2, 3) // Only allow 1, 2, or 3
      .required()
      .messages({
        'number.base': 'Role ID must be a number',
        'any.only': 'Role ID must be one of 1, 2, or 3',
        'any.required': 'Role ID is required',
      }),
    first_name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name should be at least 3 characters long',
        'string.max': 'Name should be no longer than 50 characters',
        'any.required': 'Name is required',
      }),
    last_name: Joi.string()
      .min(3)
      .max(50)
      .optional()
      .allow('')
      .messages({
        'string.empty': 'Last Name cannot be empty',
        'string.min': 'Last Name should be at least 3 characters long',
        'string.max': 'Last Name should be no longer than 50 characters',
        'any.required': 'Last Name is required',
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
    address: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages({
        'string.empty': 'Address cannot be empty',
        'string.min': 'Address should be at least 3 characters long',
        'string.max': 'Address should be no longer than 255 characters',
        'any.required': 'Address is required',
      }),
    address_line2: Joi.string()
      .max(255)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Address Line 2 should be no longer than 255 characters',
      }),
    country: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Country cannot be empty',
        'string.min': 'Country should be at least 2 characters long',
        'string.max': 'Country should be no longer than 50 characters',
        'any.required': 'Country is required',
      }),
    state: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'State cannot be empty',
        'string.min': 'State should be at least 2 characters long',
        'string.max': 'State should be no longer than 50 characters',
        'any.required': 'State is required',
      }),
    city: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'City cannot be empty',
        'string.min': 'City should be at least 2 characters long',
        'string.max': 'City should be no longer than 50 characters',
        'any.required': 'City is required',
      }),

    zip_code: Joi.string()
      .pattern(/^[0-9]{5}$/) // Example for a 5-digit zip code (you can change this pattern as needed)
      .required()
      .messages({
        'string.pattern.base': 'Zip Code must be a 5-digit number',
        'any.required': 'Zip Code is required',
      }),

    phone_number: Joi.string()
      .length(10) // Ensures exactly 10 characters (digits only)
      .pattern(/^\d{10}$/) // Ensures only digits (no spaces, dashes, or parentheses)
      .required()
      .messages({
        'string.length': 'Phone Number must be exactly 10 digits long',
        'string.pattern.base': 'Phone Number must contain only digits (no spaces, dashes, or parentheses)',
        'any.required': 'Phone Number is required',
      })

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