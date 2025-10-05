// Core data types for the Ativabank system

export type UserRole = 'customer' | 'admin' | 'super-admin';
export type AccountStatus = 'active' | 'blocked' | 'suspended';
export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type CardStatus = 'active' | 'frozen' | 'blocked';

// Base User interface
export interface BaseUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  status: AccountStatus;
  createdBy?: string; // ID of admin/super-admin who created this user
}

// Customer profile information
export interface CustomerProfile {
  name: string;
  phone?: string;
  profilePhoto?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
}

// Account permissions
export interface AccountPermissions {
  canTransfer: boolean;
  canFundFromWallet: boolean;
  canViewHistory: boolean;
  canManageCard: boolean;
}

// Wallet information
export interface Wallets {
  btc: string;
  usdt: string;
}

// Card information
export interface Card {
  number: string;
  cvv: string;
  expiryDate: string;
  balance: number;
  dailyLimit: number;
  monthlyLimit: number;
  status: CardStatus;
  lastUsed?: string;
}

// Account information
export interface Account {
  accountNumber: string;
  balance: number;
  permissions: AccountPermissions;
  dailyTransferLimit: number;
  monthlyTransferLimit: number;
}

// Full Customer interface
export interface Customer extends BaseUser {
  role: 'customer';
  profile: CustomerProfile;
  account: Account;
  wallets: Wallets;
  card: Card;
}

// Admin interface
export interface Admin extends BaseUser {
  role: 'admin';
  name: string;
  permissions: {
    canCreateCustomers: boolean;
    canManageCustomers: boolean;
    canViewAllTransactions: boolean;
    canManageTransactions: boolean;
  };
}

// Super Admin interface
export interface SuperAdmin extends BaseUser {
  role: 'super-admin';
  name: string;
}

// Union type for all users
export type User = Customer | Admin | SuperAdmin;

// Transaction interface
export interface Transaction {
  id: string;
  customerId: string;
  customerAccountNumber: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  timestamp: string;
  status: TransactionStatus;
  balanceAfter: number;
  reference?: string;
  adminId?: string; // If created/modified by admin
  adminNote?: string;
  metadata?: {
    recipientAccount?: string;
    recipientName?: string;
    source?: 'transfer' | 'card-funding' | 'deposit' | 'admin-action';
    location?: string;
    device?: string;
  };
}

// Customer creation data (what admin provides)
export interface CustomerCreationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePhoto?: string;
  initialBalance: number;
  btcWallet?: string;
  usdtWallet?: string;
  permissions?: Partial<AccountPermissions>;
  dailyTransferLimit?: number;
  monthlyTransferLimit?: number;
  cardDailyLimit?: number;
  cardMonthlyLimit?: number;
}

// Transaction creation data
export interface TransactionCreationData {
  customerId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  adminId?: string;
  adminNote?: string;
  metadata?: Transaction['metadata'];
}

// System statistics
export interface SystemStats {
  totalCustomers: number;
  totalAdmins: number;
  totalBalance: number;
  totalTransactions: number;
  recentActivity: Transaction[];
  lastUpdated: string;
}

// Database structure
export interface AtivaBankDatabase {
  users: Record<string, User>;
  transactions: Record<string, Transaction>;
  systemStats: SystemStats;
  settings: {
    nextAccountNumber: number;
    nextCardNumber: string;
    defaultLimits: {
      dailyTransfer: number;
      monthlyTransfer: number;
      cardDaily: number;
      cardMonthly: number;
    };
  };
}

// Search and filter interfaces
export interface TransactionFilters {
  customerId?: string;
  type?: TransactionType;
  category?: string;
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  searchTerm?: string;
}

export interface CustomerFilters {
  status?: AccountStatus;
  searchTerm?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  balanceMin?: number;
  balanceMax?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token?: string;
  expiresAt?: string;
}

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  [fieldName: string]: ValidationResult;
}