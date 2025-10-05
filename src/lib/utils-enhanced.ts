import { Transaction, Customer } from '@/lib/types';

// Format currency for display
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(dateString));
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString: string): string => {
  return new Date(dateString).toISOString().split('T')[0];
};

// Calculate account balance from transactions
export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((balance, transaction) => {
    return balance + (transaction.type === 'credit' ? transaction.amount : -transaction.amount);
  }, 0);
};

// Get transaction type display text
export const getTransactionTypeDisplay = (type: 'credit' | 'debit'): string => {
  return type === 'credit' ? 'Credit' : 'Debit';
};

// Get transaction status color
export const getTransactionStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'failed':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Get account status color
export const getAccountStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'blocked':
      return 'text-red-600 bg-red-100';
    case 'suspended':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Generate account number display format
export const formatAccountNumber = (accountNumber: string): string => {
  // Format as ****-****-12 (showing last 2 digits)
  if (accountNumber.length === 10) {
    return `****-****-${accountNumber.slice(-2)}`;
  }
  return accountNumber;
};

// Generate card number display format
export const formatCardNumber = (cardNumber: string): string => {
  // Format as 4532 •••• •••• 8901
  if (cardNumber.length >= 16) {
    return `${cardNumber.slice(0, 4)} •••• •••• ${cardNumber.slice(-4)}`;
  }
  return cardNumber;
};

// Mask sensitive information
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `${username[0]}*@${domain}`;
  }
  return `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}@${domain}`;
};

// Generate transaction reference
export const generateTransactionReference = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TXN${timestamp}${random}`.toUpperCase();
};

// Calculate transaction statistics
export const calculateTransactionStats = (transactions: Transaction[]) => {
  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalCredits - totalDebits;
  
  const categoryStats = transactions.reduce((stats, transaction) => {
    const category = transaction.category;
    if (!stats[category]) {
      stats[category] = { count: 0, amount: 0 };
    }
    stats[category].count += 1;
    stats[category].amount += transaction.type === 'credit' ? transaction.amount : -transaction.amount;
    return stats;
  }, {} as Record<string, { count: number; amount: number }>);

  return {
    totalTransactions: transactions.length,
    totalCredits,
    totalDebits,
    netAmount,
    averageTransaction: transactions.length > 0 ? (totalCredits + totalDebits) / transactions.length : 0,
    categoryStats
  };
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (
  transactions: Transaction[], 
  startDate: string, 
  endDate: string
): Transaction[] => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return transactions.filter(transaction => {
    const transactionTime = new Date(transaction.timestamp).getTime();
    return transactionTime >= start && transactionTime <= end;
  });
};

// Group transactions by date
export const groupTransactionsByDate = (transactions: Transaction[]): Record<string, Transaction[]> => {
  return transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);
};

// Calculate customer metrics
export const calculateCustomerMetrics = (customer: Customer, transactions: Transaction[]) => {
  const customerTransactions = transactions.filter(t => t.customerId === customer.id);
  const transactionStats = calculateTransactionStats(customerTransactions);
  
  const accountAge = Math.floor(
    (Date.now() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const lastTransaction = customerTransactions.length > 0 
    ? customerTransactions[0].timestamp 
    : null;

  const dailyLimitUsage = customer.account.dailyTransferLimit > 0 
    ? (transactionStats.totalDebits / customer.account.dailyTransferLimit) * 100 
    : 0;

  return {
    accountAge,
    lastTransaction,
    transactionStats,
    dailyLimitUsage: Math.min(dailyLimitUsage, 100),
    cardUtilization: customer.card.balance / Math.max(customer.card.dailyLimit, 1) * 100
  };
};

// Export transactions to CSV format
export const exportTransactionsToCSV = (transactions: Transaction[]): string => {
  const headers = [
    'Date',
    'Description',
    'Category', 
    'Type',
    'Amount',
    'Balance After',
    'Status',
    'Reference'
  ];

  const rows = transactions.map(transaction => [
    formatDate(transaction.timestamp, { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    transaction.description,
    transaction.category,
    getTransactionTypeDisplay(transaction.type),
    formatCurrency(transaction.amount),
    formatCurrency(transaction.balanceAfter),
    transaction.status,
    transaction.reference || transaction.id
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
};

// Download CSV file
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Validate transfer between accounts
export const validateTransfer = (
  fromCustomer: Customer,
  toAccountNumber: string,
  amount: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if customer exists and can transfer
  if (!fromCustomer.account.permissions.canTransfer) {
    errors.push('Transfer permission is disabled for this account');
  }

  // Check balance
  if (fromCustomer.account.balance < amount) {
    errors.push('Insufficient account balance');
  }

  // Check daily limit
  if (amount > fromCustomer.account.dailyTransferLimit) {
    errors.push(`Transfer amount exceeds daily limit of ${formatCurrency(fromCustomer.account.dailyTransferLimit)}`);
  }

  // Check if transferring to same account
  if (fromCustomer.account.accountNumber === toAccountNumber) {
    errors.push('Cannot transfer to the same account');
  }

  return {
    isValid: errors.length === 0,
    errors
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

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce function for search inputs
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};