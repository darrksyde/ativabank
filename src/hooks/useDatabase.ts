import { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Customer, 
  Transaction, 
  CustomerCreationData, 
  TransactionCreationData, 
  LoginCredentials,
  CustomerFilters,
  TransactionFilters,
  SystemStats,
  AccountStatus
} from '@/lib/types';
import { getDatabase } from '@/lib/database';

// Hook for authentication
export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This should only run once on mount
    let mounted = true;
    
    // Check for existing session
    const initializeAuth = () => {
      if (typeof window !== 'undefined' && mounted) {
        const sessionData = localStorage.getItem('ativabank_session');
        if (sessionData) {
          try {
            const user = JSON.parse(sessionData) as User;
            if (mounted) {
              setCurrentUser(user);
            }
          } catch (error) {
            console.error('Invalid session data:', error);
            localStorage.removeItem('ativabank_session');
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const database = getDatabase();
      const user = database.authenticateUser(credentials);
      if (user) {
        setCurrentUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ativabank_session', JSON.stringify(user));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ativabank_session');
    }
  }, []);

  const updateCurrentUser = useCallback((updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ativabank_session', JSON.stringify(updatedUser));
    }
  }, []);

  return {
    currentUser,
    isLoading,
    login,
    logout,
    updateCurrentUser,
    isAuthenticated: !!currentUser
  };
}

// Hook for customer management (admin use)
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async (filters?: CustomerFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const customerList = getDatabase().getAllCustomers(filters);
      setCustomers(customerList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCustomer = useCallback(async (data: CustomerCreationData, adminId: string): Promise<Customer | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newCustomer = getDatabase().createCustomer(data, adminId);
      setCustomers(prev => [newCustomer, ...prev]);
      return newCustomer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCustomer = getDatabase().updateCustomer(id, updates);
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCustomerStatus = useCallback(async (id: string, status: AccountStatus, adminId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCustomer = getDatabase().updateCustomerStatus(id, status, adminId);
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer status');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCustomer = useCallback((id: string): Customer | null => {
    return getDatabase().getCustomerById(id);
  }, []);

  return {
    customers,
    isLoading,
    error,
    loadCustomers,
    createCustomer,
    updateCustomer,
    updateCustomerStatus,
    getCustomer
  };
}

// Hook for transaction management
export function useTransactions(customerId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async (filters?: TransactionFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const transactionList = customerId 
        ? getDatabase().getCustomerTransactions(customerId, filters)
        : getDatabase().getAllTransactions(filters);
      setTransactions(transactionList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  const addTransaction = useCallback(async (data: TransactionCreationData): Promise<Transaction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newTransaction = getDatabase().addTransaction(data);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
    addTransaction
  };
}

// Hook for system statistics (super admin/admin use)
export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const systemStats = getDatabase().getSystemStats();
      setStats(systemStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: loadStats
  };
}

// Hook for real-time data updates
export function useRealTimeUpdates() {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ativabank_database') {
        setLastUpdate(new Date().toISOString());
        
        // Dispatch custom event for components to react to
        window.dispatchEvent(new CustomEvent('ativabank-data-updated', {
          detail: { timestamp: new Date().toISOString() }
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { lastUpdate };
}

// Hook for customer data (customer use)
export function useCustomerData(customerId: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomerData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const customerData = getDatabase().getCustomerById(customerId);
      setCustomer(customerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer data');
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) {
      loadCustomerData();
    }
  }, [customerId, loadCustomerData]);

  // Listen for real-time updates
  useEffect(() => {
    const handleDataUpdate = () => {
      loadCustomerData();
    };

    window.addEventListener('ativabank-data-updated', handleDataUpdate);
    return () => window.removeEventListener('ativabank-data-updated', handleDataUpdate);
  }, [loadCustomerData]);

  return {
    customer,
    isLoading,
    error,
    refreshCustomer: loadCustomerData
  };
}
