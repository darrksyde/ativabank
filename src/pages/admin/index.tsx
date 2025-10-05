import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";

// Simple mock customer data
const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@ativabank.com',
    accountNumber: '1000000001',
    balance: 5000.00,
    status: 'Active',
    createdAt: '2024-01-15'
  },
  {
    id: '2', 
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    accountNumber: '1000000002',
    balance: 12500.50,
    status: 'Active',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Mike Johnson', 
    email: 'mike.johnson@email.com',
    accountNumber: '1000000003',
    balance: 750.25,
    status: 'Blocked',
    createdAt: '2024-03-10'
  }
];

function AdminDashboardContent() {
  const { currentUser, logout } = useAuthContext();
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Create New Customer
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Customers ({customers.length})</h2>
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
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${customer.balance.toLocaleString()}
                        </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link 
                          href={`/admin/${customer.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Manage
                        </Link>
                        <button className="text-red-600 hover:text-red-900">
                          Block
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
