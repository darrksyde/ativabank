import { 
  AtivaBankDatabase, 
  User, 
  Customer, 
  Admin, 
  SuperAdmin, 
  Transaction, 
  CustomerCreationData, 
  TransactionCreationData, 
  LoginCredentials,
  CustomerFilters,
  TransactionFilters,
  SystemStats,
  UserRole,
  AccountStatus,
  ValidationResult
} from '@/lib/types';

class AtivaBankDB {
  private storageKey = 'ativabank_database';
  private backupKey = 'ativabank_backup';

  constructor() {
    this.initializeDatabase();
  }

  // Initialize database with default data
  private initializeDatabase(): void {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return; // Skip initialization on server-side
    }
    
    const existingData = localStorage.getItem(this.storageKey);
    
    if (!existingData) {
      const initialData: AtivaBankDatabase = {
        users: {},
        transactions: {},
        systemStats: {
          totalCustomers: 0,
          totalAdmins: 1,
          totalBalance: 0,
          totalTransactions: 0,
          recentActivity: [],
          lastUpdated: new Date().toISOString()
        },
        settings: {
          nextAccountNumber: 1000000001,
          nextCardNumber: '4532000000000001',
          defaultLimits: {
            dailyTransfer: 5000,
            monthlyTransfer: 50000,
            cardDaily: 1000,
            cardMonthly: 10000
          }
        }
      };

      // Create default super admin
      const superAdmin: SuperAdmin = {
        id: this.generateId(),
        email: 'superadmin@ativabank.com',
        password: 'admin123', // In production, this would be hashed
        role: 'super-admin',
        name: 'System Administrator',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      // Create default admin
      const defaultAdmin: Admin = {
        id: this.generateId(),
        email: 'admin@ativabank.com',
        password: 'admin123', // In production, this would be hashed
        role: 'admin',
        name: 'Default Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        createdBy: superAdmin.id,
        permissions: {
          canCreateCustomers: true,
          canManageCustomers: true,
          canViewAllTransactions: true,
          canManageTransactions: true
        }
      };

      // Create demo customer
      const demoCustomer: Customer = {
        id: this.generateId(),
        email: 'customer@ativabank.com',
        password: 'demo123',
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        createdBy: defaultAdmin.id,
        profile: {
          name: 'John Demo Customer',
          phone: '+1 (555) 123-4567',
          profilePhoto: ''
        },
        account: {
          accountNumber: '1000000001',
          balance: 5000.00,
          permissions: {
            canTransfer: true,
            canFundFromWallet: true,
            canViewHistory: true,
            canManageCard: true
          },
          dailyTransferLimit: 5000,
          monthlyTransferLimit: 50000
        },
        wallets: {
          btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          usdt: '0x742a4c2d2ef1d8e8b6c7a1b8d9f0e3a4b5c6d7e8'
        },
        card: {
          number: '4532000000000001',
          cvv: '123',
          expiryDate: '12/28',
          balance: 250.00,
          dailyLimit: 1000,
          monthlyLimit: 10000,
          status: 'active'
        }
      };

      initialData.users[superAdmin.id] = superAdmin;
      initialData.users[defaultAdmin.id] = defaultAdmin;
      initialData.users[demoCustomer.id] = demoCustomer;

      // Add some demo transactions for the customer
      const demoTransactions: Transaction[] = [
        {
          id: this.generateId(),
          customerId: demoCustomer.id,
          customerAccountNumber: demoCustomer.account.accountNumber,
          amount: 5000.00,
          type: 'credit',
          category: 'Initial Deposit',
          description: 'Welcome bonus - Account opening deposit',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          status: 'completed',
          balanceAfter: 5000.00,
          reference: 'INIT001'
        },
        {
          id: this.generateId(),
          customerId: demoCustomer.id,
          customerAccountNumber: demoCustomer.account.accountNumber,
          amount: 89.50,
          type: 'debit',
          category: 'Shopping',
          description: 'Online purchase - Amazon',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          status: 'completed',
          balanceAfter: 4910.50,
          reference: 'PUR001'
        },
        {
          id: this.generateId(),
          customerId: demoCustomer.id,
          customerAccountNumber: demoCustomer.account.accountNumber,
          amount: 250.00,
          type: 'debit',
          category: 'Transfer',
          description: 'Card funding',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          status: 'completed',
          balanceAfter: 4660.50,
          reference: 'CARD001'
        },
        {
          id: this.generateId(),
          customerId: demoCustomer.id,
          customerAccountNumber: demoCustomer.account.accountNumber,
          amount: 25.99,
          type: 'debit',
          category: 'Subscription',
          description: 'Netflix subscription',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          status: 'completed',
          balanceAfter: 4634.51,
          reference: 'SUB001'
        }
      ];

      demoTransactions.forEach(transaction => {
        initialData.transactions[transaction.id] = transaction;
      });

      // Update system stats
      initialData.systemStats.totalCustomers = 1;
      initialData.systemStats.totalBalance = demoCustomer.account.balance;
      initialData.systemStats.totalTransactions = demoTransactions.length;
      initialData.systemStats.recentActivity = demoTransactions;

      this.saveDatabase(initialData);
    }
  }

  // Save database to localStorage
  private saveDatabase(data: AtivaBankDatabase): void {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return; // Skip saving on server-side
    }
    
    try {
      // Create backup before saving
      const existing = localStorage.getItem(this.storageKey);
      if (existing) {
        localStorage.setItem(this.backupKey, existing);
      }
      
      data.systemStats.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      
      // Trigger storage event for real-time updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.storageKey,
        newValue: JSON.stringify(data),
        oldValue: existing
      }));
    } catch (error) {
      console.error('Failed to save database:', error);
      throw new Error('Database save failed');
    }
  }

  // Load database from localStorage
  private loadDatabase(): AtivaBankDatabase {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      // Return default data structure on server-side
      return {
        users: {},
        transactions: {},
        systemStats: {
          totalCustomers: 0,
          totalAdmins: 1,
          totalBalance: 0,
          totalTransactions: 0,
          recentActivity: [],
          lastUpdated: new Date().toISOString()
        },
        settings: {
          nextAccountNumber: 1000001,
          nextCardNumber: '4000000000000001',
          defaultLimits: {
            dailyTransfer: 10000,
            monthlyTransfer: 50000,
            cardDaily: 2000,
            cardMonthly: 10000
          }
        }
      };
    }
    
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        throw new Error('Database not found');
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load database:', error);
      // Try to restore from backup
      const backup = localStorage.getItem(this.backupKey);
      if (backup) {
        localStorage.setItem(this.storageKey, backup);
        return JSON.parse(backup);
      }
      throw new Error('Database corruption - no backup available');
    }
  }

  // Generate unique ID
  private generateId(): string {
    return 'ativ_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate account number
  private generateAccountNumber(db: AtivaBankDatabase): string {
    const accountNumber = db.settings.nextAccountNumber.toString();
    db.settings.nextAccountNumber += 1;
    return accountNumber;
  }

  // Generate card number
  private generateCardNumber(db: AtivaBankDatabase): string {
    const cardNumber = db.settings.nextCardNumber;
    // Simple increment for demo purposes
    const numPart = parseInt(cardNumber.slice(-4)) + 1;
    db.settings.nextCardNumber = cardNumber.slice(0, -4) + numPart.toString().padStart(4, '0');
    return cardNumber;
  }

  // Generate wallet addresses
  private generateWalletAddresses() {
    const btcChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const ethChars = '0123456789abcdef';
    
    // Generate BTC address (simplified)
    let btc = '1';
    for (let i = 0; i < 33; i++) {
      btc += btcChars.charAt(Math.floor(Math.random() * btcChars.length));
    }
    
    // Generate USDT address (ERC-20 format)
    let usdt = '0x';
    for (let i = 0; i < 40; i++) {
      usdt += ethChars.charAt(Math.floor(Math.random() * ethChars.length));
    }
    
    return { btc, usdt };
  }

  // Authentication
  authenticateUser(credentials: LoginCredentials): User | null {
    const db = this.loadDatabase();
    
    const user = Object.values(db.users).find(u => 
      u.email === credentials.email && 
      u.password === credentials.password && 
      u.role === credentials.role &&
      u.status === 'active'
    );

    if (user) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
      db.users[user.id] = user;
      this.saveDatabase(db);
    }

    return user || null;
  }

  // Create customer
  createCustomer(data: CustomerCreationData, adminId: string): Customer {
    const db = this.loadDatabase();
    
    // Validate email uniqueness
    const existingUser = Object.values(db.users).find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const wallets = data.btcWallet && data.usdtWallet ? 
      { btc: data.btcWallet, usdt: data.usdtWallet } : 
      this.generateWalletAddresses();

    const customer: Customer = {
      id: this.generateId(),
      email: data.email,
      password: data.password,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      createdBy: adminId,
      profile: {
        name: data.name,
        phone: data.phone,
        profilePhoto: data.profilePhoto
      },
      account: {
        accountNumber: this.generateAccountNumber(db),
        balance: data.initialBalance || 0,
        permissions: {
          canTransfer: data.permissions?.canTransfer ?? true,
          canFundFromWallet: data.permissions?.canFundFromWallet ?? true,
          canViewHistory: data.permissions?.canViewHistory ?? true,
          canManageCard: data.permissions?.canManageCard ?? true
        },
        dailyTransferLimit: data.dailyTransferLimit || db.settings.defaultLimits.dailyTransfer,
        monthlyTransferLimit: data.monthlyTransferLimit || db.settings.defaultLimits.monthlyTransfer
      },
      wallets,
      card: {
        number: this.generateCardNumber(db),
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        expiryDate: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7), // 4 years from now
        balance: 0,
        dailyLimit: data.cardDailyLimit || db.settings.defaultLimits.cardDaily,
        monthlyLimit: data.cardMonthlyLimit || db.settings.defaultLimits.cardMonthly,
        status: 'active'
      }
    };

    // Add initial deposit transaction if balance > 0
    if (data.initialBalance && data.initialBalance > 0) {
      const transaction: Transaction = {
        id: this.generateId(),
        customerId: customer.id,
        customerAccountNumber: customer.account.accountNumber,
        amount: data.initialBalance,
        type: 'credit',
        category: 'Initial Deposit',
        description: 'Initial account funding',
        timestamp: new Date().toISOString(),
        status: 'completed',
        balanceAfter: data.initialBalance,
        adminId,
        adminNote: 'Account creation deposit',
        metadata: {
          source: 'admin-action'
        }
      };
      
      db.transactions[transaction.id] = transaction;
    }

    db.users[customer.id] = customer;
    
    // Update system stats
    db.systemStats.totalCustomers += 1;
    db.systemStats.totalBalance += data.initialBalance || 0;
    if (data.initialBalance && data.initialBalance > 0) {
      db.systemStats.totalTransactions += 1;
    }

    this.saveDatabase(db);
    return customer;
  }

  // Get customer by ID
  getCustomerById(id: string): Customer | null {
    const db = this.loadDatabase();
    const user = db.users[id];
    return (user && user.role === 'customer') ? user as Customer : null;
  }

  // Get all customers
  getAllCustomers(filters?: CustomerFilters): Customer[] {
    const db = this.loadDatabase();
    let customers = Object.values(db.users)
      .filter(user => user.role === 'customer') as Customer[];

    if (filters) {
      if (filters.status) {
        customers = customers.filter(c => c.status === filters.status);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        customers = customers.filter(c => 
          c.profile.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.account.accountNumber.includes(term)
        );
      }
      if (filters.balanceMin !== undefined) {
        customers = customers.filter(c => c.account.balance >= filters.balanceMin!);
      }
      if (filters.balanceMax !== undefined) {
        customers = customers.filter(c => c.account.balance <= filters.balanceMax!);
      }
    }

    return customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Update customer
  updateCustomer(id: string, updates: Partial<Customer>): Customer {
    const db = this.loadDatabase();
    const customer = db.users[id] as Customer;
    
    if (!customer || customer.role !== 'customer') {
      throw new Error('Customer not found');
    }

    const updatedCustomer = {
      ...customer,
      ...updates,
      id: customer.id, // Ensure ID cannot be changed
      role: 'customer' as const, // Ensure role cannot be changed
      updatedAt: new Date().toISOString()
    };

    db.users[id] = updatedCustomer;
    this.saveDatabase(db);
    return updatedCustomer;
  }

  // Update customer status
  updateCustomerStatus(id: string, status: AccountStatus, adminId: string): Customer {
    const customer = this.getCustomerById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return this.updateCustomer(id, { status });
  }

  // Add transaction
  addTransaction(data: TransactionCreationData): Transaction {
    const db = this.loadDatabase();
    const customer = this.getCustomerById(data.customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    const transaction: Transaction = {
      id: this.generateId(),
      customerId: data.customerId,
      customerAccountNumber: customer.account.accountNumber,
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description,
      timestamp: new Date().toISOString(),
      status: 'completed',
      balanceAfter: customer.account.balance + (data.type === 'credit' ? data.amount : -data.amount),
      adminId: data.adminId,
      adminNote: data.adminNote,
      metadata: data.metadata
    };

    // Update customer balance
    const newBalance = customer.account.balance + (data.type === 'credit' ? data.amount : -data.amount);
    this.updateCustomer(data.customerId, {
      account: {
        ...customer.account,
        balance: newBalance
      }
    });

    db.transactions[transaction.id] = transaction;
    db.systemStats.totalTransactions += 1;
    db.systemStats.totalBalance += (data.type === 'credit' ? data.amount : -data.amount);
    
    this.saveDatabase(db);
    return transaction;
  }

  // Get transactions for customer
  getCustomerTransactions(customerId: string, filters?: TransactionFilters): Transaction[] {
    const db = this.loadDatabase();
    let transactions = Object.values(db.transactions)
      .filter(t => t.customerId === customerId);

    if (filters) {
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      if (filters.category) {
        transactions = transactions.filter(t => t.category === filters.category);
      }
      if (filters.status) {
        transactions = transactions.filter(t => t.status === filters.status);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        transactions = transactions.filter(t => 
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term)
        );
      }
    }

    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get all transactions (for admin)
  getAllTransactions(filters?: TransactionFilters): Transaction[] {
    const db = this.loadDatabase();
    let transactions = Object.values(db.transactions);

    if (filters) {
      if (filters.customerId) {
        transactions = transactions.filter(t => t.customerId === filters.customerId);
      }
      // Apply other filters...
    }

    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Get system statistics
  getSystemStats(): SystemStats {
    const db = this.loadDatabase();
    
    // Recalculate stats
    const customers = Object.values(db.users).filter(u => u.role === 'customer') as Customer[];
    const admins = Object.values(db.users).filter(u => u.role === 'admin');
    const totalBalance = customers.reduce((sum, customer) => sum + customer.account.balance, 0);
    const recentActivity = Object.values(db.transactions)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    const stats: SystemStats = {
      totalCustomers: customers.length,
      totalAdmins: admins.length,
      totalBalance,
      totalTransactions: Object.keys(db.transactions).length,
      recentActivity,
      lastUpdated: new Date().toISOString()
    };

    // Update stored stats
    db.systemStats = stats;
    this.saveDatabase(db);
    
    return stats;
  }

  // Validation helpers
  validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      errors: isValid ? [] : ['Invalid email format']
    };
  }

  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain at least one letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateAccountNumber(accountNumber: string): ValidationResult {
    const isValid = /^\d{10}$/.test(accountNumber);
    return {
      isValid,
      errors: isValid ? [] : ['Account number must be 10 digits']
    };
  }

  // Backup and restore
  createBackup(): string {
    const db = this.loadDatabase();
    return JSON.stringify(db, null, 2);
  }

  restoreFromBackup(backupData: string): void {
    try {
      const data = JSON.parse(backupData) as AtivaBankDatabase;
      this.saveDatabase(data);
    } catch (error) {
      throw new Error('Invalid backup data format');
    }
  }

  // Clear all data (for testing)
  clearAllData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.backupKey);
      this.initializeDatabase();
    }
  }
}

// Export singleton instance with lazy initialization
let dbInstance: AtivaBankDB | null = null;

export const getDatabase = (): AtivaBankDB => {
  if (!dbInstance) {
    dbInstance = new AtivaBankDB();
  }
  return dbInstance;
};

export const db = getDatabase();
export default getDatabase;