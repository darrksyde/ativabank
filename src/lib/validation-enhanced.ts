import { 
  CustomerCreationData, 
  TransactionCreationData, 
  TransferRequest, 
  ValidationResult, 
  ValidationError 
} from './types-enhanced';

export function validateCustomerCreation(data: CustomerCreationData): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!data.password || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (data.initialBalance < 0) {
    errors.push({ field: 'initialBalance', message: 'Initial balance cannot be negative' });
  }

  if (data.initialBalance > 1000000) {
    errors.push({ field: 'initialBalance', message: 'Initial balance cannot exceed $1,000,000' });
  }

  // Wallet validation
  if (!data.btcWallet || !isValidBitcoinAddress(data.btcWallet)) {
    errors.push({ field: 'btcWallet', message: 'Please provide a valid Bitcoin wallet address' });
  }

  if (!data.usdtWallet || !isValidEthereumAddress(data.usdtWallet)) {
    errors.push({ field: 'usdtWallet', message: 'Please provide a valid USDT (Ethereum) wallet address' });
  }

  // Phone validation (if provided)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please provide a valid phone number' });
  }

  // Limits validation
  if (data.limits) {
    if (data.limits.dailyTransferLimit && data.limits.dailyTransferLimit < 0) {
      errors.push({ field: 'dailyTransferLimit', message: 'Daily transfer limit cannot be negative' });
    }

    if (data.limits.monthlyTransferLimit && data.limits.monthlyTransferLimit < 0) {
      errors.push({ field: 'monthlyTransferLimit', message: 'Monthly transfer limit cannot be negative' });
    }

    if (data.limits.dailyTransferLimit && data.limits.monthlyTransferLimit && 
        data.limits.dailyTransferLimit > data.limits.monthlyTransferLimit) {
      errors.push({ field: 'limits', message: 'Daily limit cannot exceed monthly limit' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateTransactionCreation(data: TransactionCreationData): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!data.customerId || data.customerId.trim().length === 0) {
    errors.push({ field: 'customerId', message: 'Customer ID is required' });
  }

  if (!data.amount || data.amount <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
  }

  if (data.amount > 1000000) {
    errors.push({ field: 'amount', message: 'Transaction amount cannot exceed $1,000,000' });
  }

  if (!data.description || data.description.trim().length < 3) {
    errors.push({ field: 'description', message: 'Description must be at least 3 characters long' });
  }

  if (data.description && data.description.length > 255) {
    errors.push({ field: 'description', message: 'Description cannot exceed 255 characters' });
  }

  // Type and category validation
  const validTypes = ['credit', 'debit'];
  if (!validTypes.includes(data.type)) {
    errors.push({ field: 'type', message: 'Transaction type must be either credit or debit' });
  }

  const validCategories = [
    'transfer', 'deposit', 'withdrawal', 'card-funding', 'wallet-funding', 
    'payment', 'refund', 'fee', 'adjustment', 'initial-deposit'
  ];
  if (!validCategories.includes(data.category)) {
    errors.push({ field: 'category', message: 'Invalid transaction category' });
  }

  // Admin note validation (if provided)
  if (data.adminNote && data.adminNote.length > 500) {
    errors.push({ field: 'adminNote', message: 'Admin note cannot exceed 500 characters' });
  }

  // Tags validation
  if (data.tags) {
    if (data.tags.length > 10) {
      errors.push({ field: 'tags', message: 'Cannot have more than 10 tags' });
    }

    for (const tag of data.tags) {
      if (tag.length > 50) {
        errors.push({ field: 'tags', message: 'Each tag cannot exceed 50 characters' });
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateTransfer(data: TransferRequest): ValidationResult {
  const errors: ValidationError[] = [];

  // Account number validation
  if (!data.fromAccountNumber || !isValidAccountNumber(data.fromAccountNumber)) {
    errors.push({ field: 'fromAccountNumber', message: 'Invalid source account number' });
  }

  if (!data.toAccountNumber || !isValidAccountNumber(data.toAccountNumber)) {
    errors.push({ field: 'toAccountNumber', message: 'Invalid destination account number' });
  }

  // Cannot transfer to same account
  if (data.fromAccountNumber === data.toAccountNumber) {
    errors.push({ field: 'toAccountNumber', message: 'Cannot transfer to the same account' });
  }

  // Amount validation
  if (!data.amount || data.amount <= 0) {
    errors.push({ field: 'amount', message: 'Transfer amount must be greater than 0' });
  }

  if (data.amount < 0.01) {
    errors.push({ field: 'amount', message: 'Minimum transfer amount is $0.01' });
  }

  if (data.amount > 100000) {
    errors.push({ field: 'amount', message: 'Maximum transfer amount is $100,000' });
  }

  // Description validation
  if (!data.description || data.description.trim().length < 3) {
    errors.push({ field: 'description', message: 'Transfer description must be at least 3 characters long' });
  }

  if (data.description && data.description.length > 200) {
    errors.push({ field: 'description', message: 'Transfer description cannot exceed 200 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Simple phone validation - accepts various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

function isValidBitcoinAddress(address: string): boolean {
  // Basic Bitcoin address validation (supports legacy, segwit, and bech32)
  const btcRegex = /^(bc1|[13]|tb1|[2mn])[a-zA-HJ-NP-Z0-9]{25,87}$/;
  return btcRegex.test(address);
}

function isValidEthereumAddress(address: string): boolean {
  // Ethereum address validation (including USDT on Ethereum)
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethRegex.test(address);
}

function isValidAccountNumber(accountNumber: string): boolean {
  // Ativabank account numbers are 10-digit strings starting with 1
  const accountRegex = /^1\d{9}$/;
  return accountRegex.test(accountNumber);
}

// Additional validation utilities
export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (password.length > 50) {
    errors.push({ field: 'password', message: 'Password cannot exceed 50 characters' });
  }

  if (!/(?=.*[a-zA-Z])/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one letter' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateAmount(amount: number, min: number = 0, max: number = 1000000): ValidationResult {
  const errors: ValidationError[] = [];

  if (isNaN(amount)) {
    errors.push({ field: 'amount', message: 'Amount must be a valid number' });
  }

  if (amount < min) {
    errors.push({ field: 'amount', message: `Amount must be at least $${min.toFixed(2)}` });
  }

  if (amount > max) {
    errors.push({ field: 'amount', message: `Amount cannot exceed $${max.toLocaleString()}` });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}