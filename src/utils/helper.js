// Email format validation
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Minimum length check
export const validatePasswordLength = (password) =>
  password.length >= 8;