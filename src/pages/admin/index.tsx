import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

// Mock customer data
const mockCustomers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", balance: 15420.50, status: "Active", accountNumber: "ACC001" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", balance: 8750.25, status: "Active", accountNumber: "ACC002" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", balance: 32180.75, status: "Blocked", accountNumber: "ACC003" },
  { id: 4, name: "David Wilson", email: "david@example.com", balance: 5220.00, status: "Active", accountNumber: "ACC004" },
  { id: 5, name: "Eva Brown", email: "eva@example.com", balance: 12840.30, status: "Active", accountNumber: "ACC005" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState(mockCustomers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", initialBalance: "" });

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
        balance: parseFloat(newCustomer.initialBalance),
        status: "Active",
        accountNumber: `ACC${String(customers.length + 1).padStart(3, '0')}`
      };
      setCustomers([...customers, customer]);
      setNewCustomer({ name: "", email: "", initialBalance: "" });
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
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
              <h3 className="text-gray-600 text-sm font-medium">Total Customers</h3>
              <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <h3 className="text-gray-600 text-sm font-medium">Active Accounts</h3>
              <p className="text-3xl font-bold text-gray-800">
                {customers.filter(c => c.status === "Active").length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
              <h3 className="text-gray-600 text-sm font-medium">Blocked Accounts</h3>
              <p className="text-3xl font-bold text-gray-800">
                {customers.filter(c => c.status === "Blocked").length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <h3 className="text-gray-600 text-sm font-medium">Total Balance</h3>
              <p className="text-3xl font-bold text-gray-800">
                ${customers.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Customer Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
                <p className="text-gray-600">View and manage all customer accounts</p>
              </div>
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
              >
                Create New Customer
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
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-gray-800">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Create Customer Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Customer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                <input
                  type="number"
                  value={newCustomer.initialBalance}
                  onChange={(e) => setNewCustomer({...newCustomer, initialBalance: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter initial balance"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomer}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Create Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
