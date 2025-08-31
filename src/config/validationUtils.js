// Define validation rules for each form field
export const validationRules = {
  required: (value) => (value ? "" : "This field is required."),
  minLength: (min) => (value) =>
    value.length >= min ? "" : `Minimum length is ${min} characters.`,
  maxLength: (max) => (value) =>
    value.length <= max ? "" : `Maximum length is ${max} characters.`,
  number: (value) => (!isNaN(value) ? "" : "This field must be a number."),
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate a single field based on rules
export const validateField = (name, value, rules) => {
  const rule = rules[name];
  if (rule) {
    if (rule.required && !value) {
      return rule.message || `${name} is required`;
    }
    if (rule.minLength && value.length < rule.minLength) {
      return (
        rule.message ||
        `${name} should be at least ${rule.minLength} characters long`
      );
    }

    if (rule.type === "number" && isNaN(value)) {
      return rule.message || `${name} should be a valid number`;
    }
    if (rule.custom && typeof rule.custom === "function") {
      const customError = rule.custom(value);
      if (customError) return customError;
    }
  }
  return "";
};

// Validate all fields in the form
export const validateAllFields = (formData, validationRules) => {
  const errors = {};

  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];

    // Check if the field is required and is missing (null, undefined, or empty string)
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors[field] = rules.message || `${field} is required.`;
      continue;
    }

    // Check for minimum length
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] =
        rules.message ||
        `${field} must be at least ${rules.minLength} characters.`;
      continue;
    }

    // Check if the field should be a number but isn't
    if (rules.type === "number" && isNaN(value)) {
      errors[field] = rules.message || `${field} must be a number.`;
      continue;
    }

    // Check for email format if the field is of type email
    if (rules.type === "email" && !emailRegex.test(value)) {
      errors[field] =
        rules.message || `${field} must be a valid email address.`;
      continue;
    }

    // Check if the number is within a specified range (e.g., 0-5)
    if (rules.min !== undefined && rules.max !== undefined) {
      if (value < rules.min || value > rules.max) {
        errors[field] =
          rules.message ||
          `${field} must be between ${rules.min} and ${rules.max}.`;
        continue;
      }
    }
  }

  return errors;
};
