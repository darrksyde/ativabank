// Form validation utilities for Ativabank
import { ValidationResult, FieldValidation, CustomerCreationData } from '@/lib/types';

export interface FormField {
  value: string;
  error?: string;
  touched?: boolean;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address");
  }
  
  return { isValid: errors.length === 0, errors };
};

// Phone validation
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!phone.trim()) {
    errors.push("Phone number is required");
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ""))) {
    errors.push("Please enter a valid phone number");
  }
  
  return { isValid: errors.length === 0, errors };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name.trim()) {
    errors.push("Name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    errors.push("Name can only contain letters and spaces");
  }
  
  return { isValid: errors.length === 0, errors };
};

// Amount validation
export const validateAmount = (amount: string, min = 0.01, max = 1000000): ValidationResult => {
  const errors: string[] = [];
  
  if (!amount.trim()) {
    errors.push("Amount is required");
  } else {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      errors.push("Please enter a valid amount");
    } else if (numAmount < min) {
      errors.push(`Amount must be at least $${min}`);
    } else if (numAmount > max) {
      errors.push(`Amount cannot exceed $${max.toLocaleString()}`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Account number validation
export const validateAccountNumber = (accountNumber: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!accountNumber.trim()) {
    errors.push("Account number is required");
  } else if (!/^\d{10}$/.test(accountNumber.trim())) {
    errors.push("Account number must be exactly 10 digits");
  }
  
  return { isValid: errors.length === 0, errors };
};

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!address.trim()) {
    errors.push("Address is required");
  } else if (address.trim().length < 5) {
    errors.push("Address must be at least 5 characters long");
  }
  
  return { isValid: errors.length === 0, errors };
};

// Description validation (optional field)
export const validateDescription = (description: string, maxLength = 100): ValidationResult => {
  const errors: string[] = [];
  
  if (description && description.length > maxLength) {
    errors.push(`Description cannot exceed ${maxLength} characters`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push("Password is required");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&)");
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// General form validation function
export const validateForm = (
  fields: Record<string, string>,
  validators: Record<string, (value: string) => ValidationResult>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};
  
  for (const [fieldName, value] of Object.entries(fields)) {
    if (validators[fieldName]) {
      results[fieldName] = validators[fieldName](value);
    }
  }
  
  return results;
};

// Check if entire form is valid
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// Customer creation validation
export const validateCustomerCreation = (data: CustomerCreationData): FieldValidation => {
  return {
    name: validateName(data.name),
    email: validateEmail(data.email),
    password: validatePassword(data.password),
    phone: data.phone ? validatePhone(data.phone) : { isValid: true, errors: [] },
    initialBalance: validateAmount(data.initialBalance.toString(), 0, 1000000)
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Debounce function for real-time validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};