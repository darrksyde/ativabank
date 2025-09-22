import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

// Enhanced mock customer data
const mockCustomers = [
  { 
    id: 1, 
    name: "Alice Johnson", 
    email: "alice@example.com", 
    balance: 15420.50, 
    status: "Active", 
    accountNumber: "ACC001",
    phone: "+1 (555) 123-4567",
    btcWallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    usdtWallet: "0x742a4c2d2ef1d8e8b6c7a1b8d9f0e3a4b5c6d7e8",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    createdAt: "2024-01-15",
    lastLogin: "2024-12-22"
  },
  { 
    id: 2, 
    name: "Bob Smith", 
    email: "bob@example.com", 
    balance: 8750.25, 
    status: "Active", 
    accountNumber: "ACC002",
    phone: "+1 (555) 234-5678",
    btcWallet: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    usdtWallet: "0x8e9f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    createdAt: "2024-02-01",
    lastLogin: "2024-12-21"
  },
  { 
    id: 3, 
    name: "Carol Davis", 
    email: "carol@example.com", 
    balance: 32180.75, 
    status: "Blocked", 
    accountNumber: "ACC003",
    phone: "+1 (555) 345-6789",
    btcWallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    usdtWallet: "0x1f2e3d4c5b6a7980e1f2e3d4c5b6a798",
    profilePhoto: "",
    canTransfer: false,
    canFundWithWallet: false,
    createdAt: "2024-01-28",
    lastLogin: "2024-12-20"
  },
  { 
    id: 4, 
    name: "David Wilson", 
    email: "david@example.com", 
    balance: 5220.00, 
    status: "Active", 
    accountNumber: "ACC004",
    phone: "+1 (555) 456-7890",
    btcWallet: "36UPz5zY8QpFdBCXeHqS7UvgMcVfzLKDfm",
    usdtWallet: "0x4f5e6d7c8b9a0123456789abcdef0123",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    createdAt: "2024-03-10",
    lastLogin: "2024-12-22"
  },
  { 
    id: 5, 
    name: "Eva Brown", 
    email: "eva@example.com", 
    balance: 12840.30, 
    status: "Active", 
    accountNumber: "ACC005",
    phone: "+1 (555) 567-8901",
    btcWallet: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    usdtWallet: "0x9876543210abcdef0123456789abcdef",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    createdAt: "2024-02-15",
    lastLogin: "2024-12-21"
  },
  { 
    id: 6, 
    name: "Michael Chen", 
    email: "michael@example.com", 
    balance: 25680.90, 
    status: "Active", 
    accountNumber: "ACC006",
    phone: "+1 (555) 678-9012",
    btcWallet: "3FKjRfnvYdX4HfnZBHd5CQsF8SzMQrZxV8",
    usdtWallet: "0xabcdef0123456789abcdef0123456789",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    createdAt: "2024-03-20",
    lastLogin: "2024-12-22"
  }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [newCustomer, setNewCustomer] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    initialBalance: "",
    btcWallet: "",
    usdtWallet: "",
    canTransfer: true,
    canFundWithWallet: true
  });

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('ativabank_user');
    if (!userData) {
      router.push('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== 'admin') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  // Filter and search customers
  useEffect(() => {
    let filtered = customers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "balance":
          aValue = a.balance;
          bValue = b.balance;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleLogout = () => {
    localStorage.removeItem('ativabank_user');
    router.push('/');
  };

  const handleCreateCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.initialBalance) {
      const customer = {
        id: customers.length + 1,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        balance: parseFloat(newCustomer.initialBalance),
        status: "Active",
        accountNumber: `ACC${String(customers.length + 1).padStart(3, '0')}`,
        btcWallet: newCustomer.btcWallet || `1${Math.random().toString(36).substring(2, 27)}`,
        usdtWallet: newCustomer.usdtWallet || `0x${Math.random().toString(16).substring(2, 42)}`,
        profilePhoto: "",
        canTransfer: newCustomer.canTransfer,
        canFundWithWallet: newCustomer.canFundWithWallet,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0]
      };
      setCustomers([...customers, customer]);
      setNewCustomer({ 
        name: "", 
        email: "", 
        phone: "",
        initialBalance: "",
        btcWallet: "",
        usdtWallet: "",
        canTransfer: true,
        canFundWithWallet: true
      });
      setIsCreateDialogOpen(false);
    }
  };

  const toggleCustomerStatus = (id: number) => {
    setCustomers(customers.map(customer => 
      customer.id === id 
        ? { ...customer, status: customer.status === "Active" ? "Blocked" : "Active" }
        : customer
    ));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header title="Admin Dashboard" onLogout={handleLogout} />
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage customer accounts and banking operations</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-100 text-sm font-medium">Total Customers</h3>
                  <p className="text-3xl font-bold">{customers.length}</p>
                </div>
                <div className="text-4xl opacity-80">👥</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-100 text-sm font-medium">Active Accounts</h3>
                  <p className="text-3xl font-bold">
                    {customers.filter(c => c.status === "Active").length}
                  </p>
                </div>
                <div className="text-4xl opacity-80">✅</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-red-100 text-sm font-medium">Blocked Accounts</h3>
                  <p className="text-3xl font-bold">
                    {customers.filter(c => c.status === "Blocked").length}
                  </p>
                </div>
                <div className="text-4xl opacity-80">🚫</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-purple-100 text-sm font-medium">Total Balance</h3>
                  <p className="text-3xl font-bold">
                    ${customers.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-4xl opacity-80">💰</div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Customers</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, or account..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="balance">Balance</option>
                  <option value="createdAt">Date Created</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
                <p className="text-gray-600">Showing {filteredCustomers.length} of {customers.length} customers</p>
              </div>
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
              >
                ➕ Create New Customer
              </button>
            </div>

            {/* Customer Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Account</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Balance</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Permissions</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Last Login</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-gray-800">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                            <p className="text-xs text-gray-400">{customer.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {customer.accountNumber}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-green-600">
                            ${customer.balance.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            customer.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-1">
                            {customer.canTransfer && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Transfer
                              </span>
                            )}
                            {customer.canFundWithWallet && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Wallet
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">{customer.lastLogin}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/${customer.id}`}>
                              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                Manage
                              </button>
                            </Link>
                            <button
                              onClick={() => toggleCustomerStatus(customer.id)}
                              className={`px-3 py-1 rounded text-sm transition-colors ${
                                customer.status === "Active"
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "bg-green-500 hover:bg-green-600 text-white"
                              }`}
                            >
                              {customer.status === "Active" ? "Block" : "Unblock"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center">
                        <div className="text-gray-500">
                          <div className="text-4xl mb-2">🔍</div>
                          <p className="text-lg font-medium">No customers found</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Create Customer Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Create New Customer</h3>
              <p className="text-gray-600 mb-6">Fill in the customer details to create a new account</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Personal Information</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCustomer.initialBalance}
                    onChange={(e) => setNewCustomer({...newCustomer, initialBalance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Crypto Wallets */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Crypto Wallets</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BTC Wallet Address</label>
                  <input
                    type="text"
                    value={newCustomer.btcWallet}
                    onChange={(e) => setNewCustomer({...newCustomer, btcWallet: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Auto-generated if empty"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">USDT Wallet Address</label>
                  <input
                    type="text"
                    value={newCustomer.usdtWallet}
                    onChange={(e) => setNewCustomer({...newCustomer, usdtWallet: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Auto-generated if empty"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
                </div>

                {/* Account Permissions */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Account Permissions</h4>
                </div>
                
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="canTransfer"
                        checked={newCustomer.canTransfer}
                        onChange={(e) => setNewCustomer({...newCustomer, canTransfer: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="canTransfer" className="ml-2 block text-sm text-gray-900">
                        Allow Transfers
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="canFundWithWallet"
                        checked={newCustomer.canFundWithWallet}
                        onChange={(e) => setNewCustomer({...newCustomer, canFundWithWallet: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="canFundWithWallet" className="ml-2 block text-sm text-gray-900">
                        Allow Wallet Funding
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCustomer}
                  disabled={!newCustomer.name || !newCustomer.email || !newCustomer.initialBalance}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
