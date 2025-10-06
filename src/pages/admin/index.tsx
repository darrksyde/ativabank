import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import databaseManager from "@/lib/database-enhanced";
import { Customer, CustomerCreationData, TransactionCreationData } from "@/lib/types-enhanced";
import { formatCurrency, formatDate } from "@/lib/validation-enhanced";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidatedInput } from "@/components/ui/validated-input";
import { validateAccountNumber, validateAmount, validateDescription } from "@/lib/validation";

function AdminDashboardContent() {
  const { currentUser, logout } = useAuthContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Create customer form state
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    initialBalance: "",
    btcWallet: "",
    usdtWallet: ""
  });
  const [isCreating, setIsCreating] = useState(false);

  // Load customers
  const loadCustomers = () => {
    const allCustomers = databaseManager.getCustomers();
    setCustomers(allCustomers);
  };

  useEffect(() => {
    loadCustomers();
    setLoading(false);
  }, []);

  // Filter customers based on search and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.account.accountNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || customer.account.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle customer blocking/unblocking
  const handleToggleCustomerStatus = async (customerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const result = await databaseManager.updateCustomerStatus(customerId, newStatus, currentUser?.email || 'admin');
    
    if (result.success) {
      loadCustomers(); // Refresh the list
    } else {
      alert(`Failed to ${newStatus === 'active' ? 'unblock' : 'block'} customer: ${result.error}`);
    }
  };

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    if (confirm(`Are you sure you want to delete customer "${customerName}"? This action cannot be undone.`)) {
      const result = await databaseManager.deleteCustomer(customerId, currentUser?.email || 'admin');
      
      if (result.success) {
        loadCustomers(); // Refresh the list
      } else {
        alert(`Failed to delete customer: ${result.error}`);
      }
    }
  };

  // Handle customer creation
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const customerData: CustomerCreationData = {
        name: createForm.name,
        email: createForm.email,
        phone: createForm.phone || undefined,
        password: createForm.password,
        initialBalance: parseFloat(createForm.initialBalance) || 0,
        btcWallet: createForm.btcWallet,
        usdtWallet: createForm.usdtWallet,
        permissions: {
          canTransfer: true,
          canFundFromWallet: true,
          canViewHistory: true,
          canManageCard: true
        }
      };

      const result = await databaseManager.createCustomer(customerData, currentUser?.email || 'admin');
      
      if (result.success) {
        // Reset form
        setCreateForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          initialBalance: "",
          btcWallet: "",
          usdtWallet: ""
        });
        setShowCreateModal(false);
        loadCustomers(); // Refresh the list
        alert("Customer created successfully!");
      } else {
        alert(`Failed to create customer: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to create customer. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Admin Dashboard" 
          onLogout={logout}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Admin Dashboard" 
        onLogout={logout}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600">Manage customer accounts and settings</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create New Customer
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Customers
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or account number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Customers ({filteredCustomers.length} of {customers.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(customer.account.balance)}
                        </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.account.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : customer.account.status === 'blocked'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {customer.account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link 
                          href={`/admin/${customer.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Manage
                        </Link>
                        <button 
                          onClick={() => handleToggleCustomerStatus(customer.id, customer.account.status)}
                          className={`mr-3 ${
                            customer.account.status === 'active' 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {customer.account.status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-purple-600 hover:text-purple-900 mr-3"
                        >
                          Add Transaction
                        </button>
                        <button 
                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No customers found. Create your first customer to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Customer Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Create New Customer</h2>
              </div>
              
              <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.name}
                      onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={createForm.email}
                      onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={createForm.password}
                      onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Balance ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={createForm.initialBalance}
                      onChange={(e) => setCreateForm({...createForm, initialBalance: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BTC Wallet Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.btcWallet}
                      onChange={(e) => setCreateForm({...createForm, btcWallet: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      USDT Wallet Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.usdtWallet}
                      onChange={(e) => setCreateForm({...createForm, usdtWallet: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {isCreating ? 'Creating...' : 'Create Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
