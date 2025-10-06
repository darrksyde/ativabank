// Enhanced Banking System Types for Ativabank
export type UserRole = 'customer' | 'admin' | 'super-admin';

export interface BaseUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'blocked' | 'suspended';
}

export interface SuperAdmin extends BaseUser {
  role: 'super-admin';
}

export interface Admin extends BaseUser {
  role: 'admin';
  createdBy: string; // Super admin ID
  permissions: {
    canCreateCustomers: boolean;
    canManageCustomers: boolean;
    canViewAllTransactions: boolean;
    canManageTransactions: boolean;
    canBlockAccounts: boolean;
    canResetPasswords: boolean;
  };
}

export interface CustomerProfile {
  name: string;
  phone?: string;
  profilePhoto?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CustomerAccount {
  accountNumber: string;
  balance: number;
  permissions: {
    canTransfer: boolean;
    canFundFromWallet: boolean;
    canViewHistory: boolean;
    canManageCard: boolean;
  };
  limits: {
    dailyTransferLimit: number;
    monthlyTransferLimit: number;
    cardDailyLimit: number;
    cardMonthlyLimit: number;
  };
  status: 'active' | 'blocked' | 'suspended';
}

export interface CustomerWallets {
  btc: string;
  usdt: string;
}

export interface CustomerCard {
  number: string;
  cvv: string;
  expiryDate: string;
  balance: number;
  dailyLimit: number;
  monthlyLimit: number;
  status: 'active' | 'blocked' | 'expired';
  lastUsed?: string;
}

export interface Customer extends BaseUser {
  role: 'customer';
  createdBy: string; // Admin ID
  profile: CustomerProfile;
  account: CustomerAccount;
  wallets: CustomerWallets;
  card: CustomerCard;
  lastLogin?: string;
}

export type User = SuperAdmin | Admin | Customer;

export type TransactionType = 'credit' | 'debit';
export type TransactionCategory = 
  | 'transfer' 
  | 'deposit' 
  | 'withdrawal' 
  | 'card-funding' 
  | 'wallet-funding' 
  | 'payment' 
  | 'refund' 
  | 'fee' 
  | 'adjustment' 
  | 'initial-deposit';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'reversed';

export interface Transaction {
  id: string;
  customerId: string;
  customerAccountNumber: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  status: TransactionStatus;
  description: string;
  timestamp: string;
  balanceAfter: number;
  reference: string;
  
  // Enhanced fields
  createdBy?: string; // Admin ID if admin-created
  tags?: string[];
  metadata?: {
    transferTo?: string; // Account number for transfers
    walletAddress?: string; // For crypto funding
    cardLast4?: string; // For card transactions
    adminNote?: string; // Admin comments
    reversalOf?: string; // Original transaction ID if this is a reversal
  };
  
  // Audit trail
  reversedAt?: string;
  reversedBy?: string; // Admin ID
  reversalReason?: string;
}

export interface TransferRequest {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  description: string;
  password?: string; // Customer password verification
}

export interface SystemStats {
  totalCustomers: number;
  totalBalance: number;
  totalTransactions: number;
  recentActivity: Transaction[];
  monthlyStats: {
    newCustomers: number;
    totalTransfers: number;
    totalVolume: number;
  };
}

export interface AtivaBankDatabase {
  users: Record<string, User>;
  transactions: Record<string, Transaction>;
  systemStats: SystemStats;
  settings: {
    nextAccountNumber: string;
    nextCardNumber: string;
    defaultLimits: {
      dailyTransfer: number;
      monthlyTransfer: number;
      cardDaily: number;
      cardMonthly: number;
    };
    fees: {
      transferFee: number;
      cardFundingFee: number;
      withdrawalFee: number;
    };
  };
}

// Form types for UI
export interface CustomerCreationData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  profilePhoto?: string;
  initialBalance: number;
  btcWallet: string;
  usdtWallet: string;
  permissions?: {
    canTransfer?: boolean;
    canFundFromWallet?: boolean;
    canViewHistory?: boolean;
    canManageCard?: boolean;
  };
  limits?: {
    dailyTransferLimit?: number;
    monthlyTransferLimit?: number;
    cardDailyLimit?: number;
    cardMonthlyLimit?: number;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface TransactionCreationData {
  customerId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  adminNote?: string;
  tags?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Filter types for queries
export interface CustomerFilters {
  status?: 'active' | 'blocked' | 'suspended';
  createdAfter?: string;
  createdBefore?: string;
  minBalance?: number;
  maxBalance?: number;
  search?: string; // Name or email search
}

export interface TransactionFilters {
  customerId?: string;
  type?: TransactionType;
  category?: TransactionCategory;
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string; // Description or reference search
  tags?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Event types for audit trail
export type AuditEventType = 
  | 'user-login'
  | 'user-logout'
  | 'customer-created'
  | 'customer-updated'
  | 'customer-blocked'
  | 'transaction-created'
  | 'transaction-reversed'
  | 'transfer-initiated'
  | 'card-funded'
  | 'password-reset';

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  userId: string; // Who performed the action
  targetId?: string; // What was affected (customer ID, transaction ID, etc.)
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}