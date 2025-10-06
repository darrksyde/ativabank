import { 
  AtivaBankDatabase, 
  User, 
  Customer, 
  Admin, 
  SuperAdmin,
  Transaction, 
  CustomerCreationData, 
  TransactionCreationData,
  TransferRequest,
  AuditEvent,
  AuditEventType,
  LoginCredentials,
  CustomerFilters,
  TransactionFilters,
  ApiResponse,
  ValidationResult,
  ValidationError
} from './types-enhanced';
import { validateCustomerCreation, validateTransactionCreation, validateTransfer } from './validation-enhanced';

class AtivaBankDatabaseManager {
  private storageKey = 'ativabank_database_v2';
  
  constructor() {
    this.initializeDatabase();
  }

  // Initialize database with default data
  private initializeDatabase(): void {
    if (typeof window === 'undefined') return;

    const existing = localStorage.getItem(this.storageKey);
    if (existing) return;

    const initialData: AtivaBankDatabase = {
      users: {},
      transactions: {},
      systemStats: {
        totalCustomers: 0,
        totalBalance: 0,
        totalTransactions: 0,
        recentActivity: [],
        monthlyStats: {
          newCustomers: 0,
          totalTransfers: 0,
          totalVolume: 0
        }
      },
      settings: {
        nextAccountNumber: '1000000001',
        nextCardNumber: '4532000000000001',
        defaultLimits: {
          dailyTransfer: 5000,
          monthlyTransfer: 50000,
          cardDaily: 1000,
          cardMonthly: 10000
        },
        fees: {
          transferFee: 0,
          cardFundingFee: 0,
          withdrawalFee: 0
        }
      }
    };

    // Create default users
    this.createDefaultUsers(initialData);
    this.saveDatabase(initialData);
  }

  private createDefaultUsers(database: AtivaBankDatabase): void {
    // Super Admin
    const superAdmin: SuperAdmin = {
      id: this.generateId(),
      email: 'superadmin@ativabank.com',
      password: 'super123',
      role: 'super-admin',
      name: 'System Administrator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    // Default Admin
    const defaultAdmin: Admin = {
      id: this.generateId(),
      email: 'admin@ativabank.com',
      password: 'admin123',
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
        canManageTransactions: true,
        canBlockAccounts: true,
        canResetPasswords: true
      }
    };

    // Demo Customer
    const demoCustomer: Customer = {
      id: this.generateId(),
      email: 'customer@ativabank.com',
      password: 'customer123',
      role: 'customer',
      name: 'John Demo Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      createdBy: defaultAdmin.id,
      profile: {
        name: 'John Demo Customer',
        phone: '+1 (555) 123-4567',
        profilePhoto: '',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
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
        limits: {
          dailyTransferLimit: 5000,
          monthlyTransferLimit: 50000,
          cardDailyLimit: 1000,
          cardMonthlyLimit: 10000
        },
        status: 'active'
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

    database.users[superAdmin.id] = superAdmin;
    database.users[defaultAdmin.id] = defaultAdmin;
    database.users[demoCustomer.id] = demoCustomer;

    // Create demo transactions
    this.createDemoTransactions(database, demoCustomer);
  }

  private createDemoTransactions(database: AtivaBankDatabase, customer: Customer): void {
    const transactions: Transaction[] = [
      {
        id: this.generateId(),
        customerId: customer.id,
        customerAccountNumber: customer.account.accountNumber,
        amount: 5000.00,
        type: 'credit',
        category: 'initial-deposit',
        status: 'completed',
        description: 'Welcome bonus - Account opening deposit',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        balanceAfter: 5000.00,
        reference: 'INIT001',
        tags: ['welcome', 'deposit'],
        metadata: {
          adminNote: 'Initial account setup'
        }
      },
      {
        id: this.generateId(),
        customerId: customer.id,
        customerAccountNumber: customer.account.accountNumber,
        amount: 250.00,
        type: 'debit',
        category: 'card-funding',
        status: 'completed',
        description: 'Card funding from account balance',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        balanceAfter: 4750.00,
        reference: 'CARD001',
        tags: ['card', 'funding'],
        metadata: {
          cardLast4: '0001'
        }
      }
    ];

    transactions.forEach(transaction => {
      database.transactions[transaction.id] = transaction;
    });

    // Update system stats
    database.systemStats.totalCustomers = 1;
    database.systemStats.totalBalance = customer.account.balance;
    database.systemStats.totalTransactions = transactions.length;
    database.systemStats.recentActivity = transactions;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveDatabase(data: AtivaBankDatabase): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private loadDatabase(): AtivaBankDatabase {
    if (typeof window === 'undefined') {
      return this.getEmptyDatabase();
    }

    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      this.initializeDatabase();
      return this.loadDatabase();
    }

    try {
      return JSON.parse(data) as AtivaBankDatabase;
    } catch (error) {
      console.error('Failed to parse database:', error);
      this.initializeDatabase();
      return this.loadDatabase();
    }
  }

  private getEmptyDatabase(): AtivaBankDatabase {
    return {
      users: {},
      transactions: {},
      systemStats: {
        totalCustomers: 0,
        totalBalance: 0,
        totalTransactions: 0,
        recentActivity: [],
        monthlyStats: {
          newCustomers: 0,
          totalTransfers: 0,
          totalVolume: 0
        }
      },
      settings: {
        nextAccountNumber: '1000000001',
        nextCardNumber: '4532000000000001',
        defaultLimits: {
          dailyTransfer: 5000,
          monthlyTransfer: 50000,
          cardDaily: 1000,
          cardMonthly: 10000
        },
        fees: {
          transferFee: 0,
          cardFundingFee: 0,
          withdrawalFee: 0
        }
      }
    };
  }

  // Authentication
  authenticateUser(credentials: LoginCredentials): User | null {
    const database = this.loadDatabase();
    const users = Object.values(database.users);
    
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password &&
      u.status === 'active'
    );

    if (user) {
      this.logAuditEvent('user-login', user.id, {
        email: user.email,
        role: user.role
      });
    }

    return user || null;
  }

  // Customer Management
  async createCustomer(data: CustomerCreationData, createdByAdminId: string): Promise<ApiResponse<Customer>> {
    const validation = validateCustomerCreation(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.map((e: any) => e.message).join(', ')
      };
    }

    const database = this.loadDatabase();
    
    // Check if email already exists
    const existingUser = Object.values(database.users).find(u => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists'
      };
    }

    const customer: Customer = {
      id: this.generateId(),
      email: data.email,
      password: data.password,
      role: 'customer',
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      createdBy: createdByAdminId,
      profile: {
        name: data.name,
        phone: data.phone,
        profilePhoto: data.profilePhoto,
        address: data.address
      },
      account: {
        accountNumber: database.settings.nextAccountNumber,
        balance: data.initialBalance,
        permissions: {
          canTransfer: data.permissions?.canTransfer ?? true,
          canFundFromWallet: data.permissions?.canFundFromWallet ?? true,
          canViewHistory: data.permissions?.canViewHistory ?? true,
          canManageCard: data.permissions?.canManageCard ?? true
        },
        limits: {
          dailyTransferLimit: data.limits?.dailyTransferLimit || database.settings.defaultLimits.dailyTransfer,
          monthlyTransferLimit: data.limits?.monthlyTransferLimit || database.settings.defaultLimits.monthlyTransfer,
          cardDailyLimit: data.limits?.cardDailyLimit || database.settings.defaultLimits.cardDaily,
          cardMonthlyLimit: data.limits?.cardMonthlyLimit || database.settings.defaultLimits.cardMonthly
        },
        status: 'active'
      },
      wallets: {
        btc: data.btcWallet,
        usdt: data.usdtWallet
      },
      card: {
        number: database.settings.nextCardNumber,
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        expiryDate: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 7).replace('-', '/'),
        balance: 0,
        dailyLimit: data.limits?.cardDailyLimit || database.settings.defaultLimits.cardDaily,
        monthlyLimit: data.limits?.cardMonthlyLimit || database.settings.defaultLimits.cardMonthly,
        status: 'active'
      }
    };

    // Add customer to database
    database.users[customer.id] = customer;

    // Update next account and card numbers
    database.settings.nextAccountNumber = (parseInt(database.settings.nextAccountNumber) + 1).toString().padStart(10, '0');
    database.settings.nextCardNumber = (parseInt(database.settings.nextCardNumber) + 1).toString();

    // Create initial deposit transaction if amount > 0
    if (data.initialBalance > 0) {
      const transaction: Transaction = {
        id: this.generateId(),
        customerId: customer.id,
        customerAccountNumber: customer.account.accountNumber,
        amount: data.initialBalance,
        type: 'credit',
        category: 'initial-deposit',
        status: 'completed',
        description: 'Initial account deposit',
        timestamp: new Date().toISOString(),
        balanceAfter: data.initialBalance,
        reference: `INIT${customer.account.accountNumber}`,
        createdBy: createdByAdminId,
        tags: ['initial', 'deposit'],
        metadata: {
          adminNote: 'Account opening deposit'
        }
      };

      database.transactions[transaction.id] = transaction;
      database.systemStats.totalTransactions++;
      database.systemStats.recentActivity = [transaction, ...database.systemStats.recentActivity.slice(0, 9)];
    }

    // Update system stats
    database.systemStats.totalCustomers++;
    database.systemStats.totalBalance += data.initialBalance;
    database.systemStats.monthlyStats.newCustomers++;

    this.saveDatabase(database);

    this.logAuditEvent('customer-created', createdByAdminId, {
      customerId: customer.id,
      customerEmail: customer.email,
      initialBalance: data.initialBalance
    });

    return {
      success: true,
      data: customer,
      message: 'Customer created successfully'
    };
  }

  getCustomers(filters?: CustomerFilters): Customer[] {
    const database = this.loadDatabase();
    let customers = Object.values(database.users).filter(u => u.role === 'customer') as Customer[];

    if (filters) {
      if (filters.status) {
        customers = customers.filter(c => c.status === filters.status);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        customers = customers.filter(c => 
          c.name.toLowerCase().includes(search) || 
          c.email.toLowerCase().includes(search)
        );
      }
      if (filters.minBalance !== undefined) {
        customers = customers.filter(c => c.account.balance >= filters.minBalance!);
      }
      if (filters.maxBalance !== undefined) {
        customers = customers.filter(c => c.account.balance <= filters.maxBalance!);
      }
      if (filters.createdAfter) {
        customers = customers.filter(c => c.createdAt >= filters.createdAfter!);
      }
      if (filters.createdBefore) {
        customers = customers.filter(c => c.createdAt <= filters.createdBefore!);
      }
    }

    return customers;
  }

  getCustomerById(id: string): Customer | null {
    const database = this.loadDatabase();
    const user = database.users[id];
    return (user && user.role === 'customer') ? user as Customer : null;
  }

  getCustomerByEmail(email: string): { success: boolean; data?: Customer; error?: string } {
    const database = this.loadDatabase();
    const user = Object.values(database.users).find(u => u.email === email && u.role === 'customer');
    
    if (user) {
      return { success: true, data: user as Customer };
    }
    
    return { success: false, error: 'Customer not found' };
  }

  async updateCustomerStatus(customerId: string, status: 'active' | 'blocked' | 'suspended', updatedByAdminId: string): Promise<ApiResponse<Customer>> {
    const database = this.loadDatabase();
    const customer = database.users[customerId];
    
    if (!customer || customer.role !== 'customer') {
      return { success: false, error: 'Customer not found' };
    }

    // Update status
    (customer as Customer).account.status = status;

    // Create audit entry
    const auditEntry: AuditEvent = {
      id: this.generateId(),
      type: 'customer-blocked',
      userId: updatedByAdminId,
      targetId: customerId,
      details: {
        previousStatus: (customer as Customer).account.status,
        newStatus: status
      },
      timestamp: new Date().toISOString()
    };

    // For now, we'll skip audit logging since auditEvents is not in database structure
    // database.auditEvents[auditEntry.id] = auditEntry;
    this.saveDatabase(database);

    return { success: true, data: customer as Customer };
  }

  async deleteCustomer(customerId: string, deletedByAdminId: string): Promise<ApiResponse<boolean>> {
    const database = this.loadDatabase();
    const customer = database.users[customerId];
    
    if (!customer || customer.role !== 'customer') {
      return { success: false, error: 'Customer not found' };
    }

    // Check if customer has any recent transactions or positive balance
    const customerTransactions = Object.values(database.transactions).filter(t => t.customerId === customerId);
    const recentTransactions = customerTransactions.filter(t => {
      const transactionDate = new Date(t.timestamp);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return transactionDate >= thirtyDaysAgo;
    });

    if ((customer as Customer).account.balance > 0) {
      return { success: false, error: 'Cannot delete customer with positive balance' };
    }

    if (recentTransactions.length > 0) {
      return { success: false, error: 'Cannot delete customer with transactions in the last 30 days' };
    }

    // Create audit entry before deletion
    const auditEntry: AuditEvent = {
      id: this.generateId(),
      type: 'customer-updated',
      userId: deletedByAdminId,
      targetId: customerId,
      details: {
        action: 'deleted',
        customerData: {
          name: customer.name,
          email: customer.email,
          accountNumber: (customer as Customer).account.accountNumber
        }
      },
      timestamp: new Date().toISOString()
    };

    // For now, we'll skip audit logging since auditEvents is not in database structure
    // database.auditEvents[auditEntry.id] = auditEntry;

    // Delete customer
    delete database.users[customerId];
    
    this.saveDatabase(database);
    return { success: true, data: true };
  }

  getCustomerTransactions(customerId: string, filters?: TransactionFilters): Transaction[] {
    const database = this.loadDatabase();
    let transactions = Object.values(database.transactions).filter(t => t.customerId === customerId);

    if (filters) {
      if (filters.dateFrom) {
        transactions = transactions.filter(t => new Date(t.timestamp) >= new Date(filters.dateFrom!));
      }
      if (filters.dateTo) {
        transactions = transactions.filter(t => new Date(t.timestamp) <= new Date(filters.dateTo!));
      }
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      if (filters.category) {
        transactions = transactions.filter(t => t.category === filters.category);
      }
      if (filters.minAmount !== undefined) {
        transactions = transactions.filter(t => t.amount >= filters.minAmount!);
      }
      if (filters.maxAmount !== undefined) {
        transactions = transactions.filter(t => t.amount <= filters.maxAmount!);
      }
      if (filters.search) {
        transactions = transactions.filter(t => 
          t.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
          (t.reference && t.reference.toLowerCase().includes(filters.search!.toLowerCase()))
        );
      }
    }

    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  updateCustomer(id: string, updates: Partial<Customer>, updatedByAdminId?: string): ApiResponse<Customer> {
    const database = this.loadDatabase();
    const customer = database.users[id] as Customer;

    if (!customer || customer.role !== 'customer') {
      return {
        success: false,
        error: 'Customer not found'
      };
    }

    const updatedCustomer = {
      ...customer,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    database.users[id] = updatedCustomer;
    this.saveDatabase(database);

    if (updatedByAdminId) {
      this.logAuditEvent('customer-updated', updatedByAdminId, {
        customerId: id,
        updates: Object.keys(updates)
      });
    }

    return {
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully'
    };
  }

  // Transaction Management
  async createTransaction(data: TransactionCreationData, createdByAdminId?: string): Promise<ApiResponse<Transaction>> {
    const validation = validateTransactionCreation(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.map((e: any) => e.message).join(', ')
      };
    }

    const database = this.loadDatabase();
    const customer = this.getCustomerById(data.customerId);

    if (!customer) {
      return {
        success: false,
        error: 'Customer not found'
      };
    }

    // Calculate new balance
    let newBalance = customer.account.balance;
    if (data.type === 'credit') {
      newBalance += data.amount;
    } else {
      newBalance -= data.amount;
      if (newBalance < 0) {
        return {
          success: false,
          error: 'Insufficient funds'
        };
      }
    }

    const transaction: Transaction = {
      id: this.generateId(),
      customerId: data.customerId,
      customerAccountNumber: customer.account.accountNumber,
      amount: data.amount,
      type: data.type,
      category: data.category,
      status: 'completed',
      description: data.description,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance,
      reference: `TXN${Date.now()}`,
      createdBy: createdByAdminId,
      tags: data.tags,
      metadata: {
        adminNote: data.adminNote
      }
    };

    // Update customer balance
    const updatedCustomer = {
      ...customer,
      account: {
        ...customer.account,
        balance: newBalance
      },
      updatedAt: new Date().toISOString()
    };

    database.users[customer.id] = updatedCustomer;
    database.transactions[transaction.id] = transaction;

    // Update system stats
    database.systemStats.totalTransactions++;
    database.systemStats.totalBalance += (data.type === 'credit' ? data.amount : -data.amount);
    database.systemStats.recentActivity = [transaction, ...database.systemStats.recentActivity.slice(0, 9)];

    this.saveDatabase(database);

    this.logAuditEvent('transaction-created', createdByAdminId || data.customerId, {
      transactionId: transaction.id,
      customerId: data.customerId,
      amount: data.amount,
      type: data.type
    });

    return {
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    };
  }

  getTransactions(filters?: TransactionFilters): Transaction[] {
    const database = this.loadDatabase();
    let transactions = Object.values(database.transactions);

    if (filters) {
      if (filters.customerId) {
        transactions = transactions.filter(t => t.customerId === filters.customerId);
      }
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      if (filters.category) {
        transactions = transactions.filter(t => t.category === filters.category);
      }
      if (filters.status) {
        transactions = transactions.filter(t => t.status === filters.status);
      }
      if (filters.dateFrom) {
        transactions = transactions.filter(t => t.timestamp >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        transactions = transactions.filter(t => t.timestamp <= filters.dateTo!);
      }
      if (filters.minAmount !== undefined) {
        transactions = transactions.filter(t => t.amount >= filters.minAmount!);
      }
      if (filters.maxAmount !== undefined) {
        transactions = transactions.filter(t => t.amount <= filters.maxAmount!);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        transactions = transactions.filter(t => 
          t.description.toLowerCase().includes(search) || 
          t.reference.toLowerCase().includes(search)
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        transactions = transactions.filter(t => 
          t.tags && t.tags.some(tag => filters.tags!.includes(tag))
        );
      }
    }

    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Transfer functionality
  async processTransfer(transferData: TransferRequest, initiatedByCustomerId: string): Promise<ApiResponse<Transaction[]>> {
    const validation = validateTransfer(transferData);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.map((e: any) => e.message).join(', ')
      };
    }

    const database = this.loadDatabase();
    
    // Get source and destination customers
    const sourceCustomer = Object.values(database.users).find(u => 
      u.role === 'customer' && (u as Customer).account.accountNumber === transferData.fromAccountNumber
    ) as Customer;

    const destCustomer = Object.values(database.users).find(u => 
      u.role === 'customer' && (u as Customer).account.accountNumber === transferData.toAccountNumber
    ) as Customer;

    if (!sourceCustomer || !destCustomer) {
      return {
        success: false,
        error: 'Invalid account number(s)'
      };
    }

    // Verify customer is transferring from their own account
    if (sourceCustomer.id !== initiatedByCustomerId) {
      return {
        success: false,
        error: 'Unauthorized transfer attempt'
      };
    }

    // Check if transfers are allowed
    if (!sourceCustomer.account.permissions.canTransfer) {
      return {
        success: false,
        error: 'Transfers are not allowed for this account'
      };
    }

    // Check balance
    if (sourceCustomer.account.balance < transferData.amount) {
      return {
        success: false,
        error: 'Insufficient funds'
      };
    }

    // Check daily limits (simplified check)
    if (transferData.amount > sourceCustomer.account.limits.dailyTransferLimit) {
      return {
        success: false,
        error: 'Transfer amount exceeds daily limit'
      };
    }

    const transferReference = `TRF${Date.now()}`;

    // Create debit transaction for source
    const debitTransaction: Transaction = {
      id: this.generateId(),
      customerId: sourceCustomer.id,
      customerAccountNumber: sourceCustomer.account.accountNumber,
      amount: transferData.amount,
      type: 'debit',
      category: 'transfer',
      status: 'completed',
      description: `Transfer to ${destCustomer.account.accountNumber} - ${transferData.description}`,
      timestamp: new Date().toISOString(),
      balanceAfter: sourceCustomer.account.balance - transferData.amount,
      reference: transferReference,
      tags: ['transfer', 'outgoing'],
      metadata: {
        transferTo: destCustomer.account.accountNumber
      }
    };

    // Create credit transaction for destination
    const creditTransaction: Transaction = {
      id: this.generateId(),
      customerId: destCustomer.id,
      customerAccountNumber: destCustomer.account.accountNumber,
      amount: transferData.amount,
      type: 'credit',
      category: 'transfer',
      status: 'completed',
      description: `Transfer from ${sourceCustomer.account.accountNumber} - ${transferData.description}`,
      timestamp: new Date().toISOString(),
      balanceAfter: destCustomer.account.balance + transferData.amount,
      reference: transferReference,
      tags: ['transfer', 'incoming'],
      metadata: {
        transferTo: sourceCustomer.account.accountNumber
      }
    };

    // Update balances
    const updatedSourceCustomer = {
      ...sourceCustomer,
      account: {
        ...sourceCustomer.account,
        balance: sourceCustomer.account.balance - transferData.amount
      },
      updatedAt: new Date().toISOString()
    };

    const updatedDestCustomer = {
      ...destCustomer,
      account: {
        ...destCustomer.account,
        balance: destCustomer.account.balance + transferData.amount
      },
      updatedAt: new Date().toISOString()
    };

    // Save to database
    database.users[sourceCustomer.id] = updatedSourceCustomer;
    database.users[destCustomer.id] = updatedDestCustomer;
    database.transactions[debitTransaction.id] = debitTransaction;
    database.transactions[creditTransaction.id] = creditTransaction;

    // Update system stats
    database.systemStats.totalTransactions += 2;
    database.systemStats.monthlyStats.totalTransfers++;
    database.systemStats.monthlyStats.totalVolume += transferData.amount;
    database.systemStats.recentActivity = [
      creditTransaction, 
      debitTransaction, 
      ...database.systemStats.recentActivity.slice(0, 8)
    ];

    this.saveDatabase(database);

    this.logAuditEvent('transfer-initiated', initiatedByCustomerId, {
      fromAccount: transferData.fromAccountNumber,
      toAccount: transferData.toAccountNumber,
      amount: transferData.amount,
      reference: transferReference
    });

    return {
      success: true,
      data: [debitTransaction, creditTransaction],
      message: 'Transfer completed successfully'
    };
  }

  // Audit logging
  private logAuditEvent(type: AuditEventType, userId: string, details: Record<string, any>): void {
    // In a real system, this would log to a separate audit table
    console.log(`Audit: ${type} by ${userId}`, details);
  }

  // Utility methods
  clearAllData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    this.initializeDatabase();
  }

  getSystemStats() {
    const database = this.loadDatabase();
    return database.systemStats;
  }
}

// Singleton instance
export const databaseManager = new AtivaBankDatabaseManager();
export default databaseManager;