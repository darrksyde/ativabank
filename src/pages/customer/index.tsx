import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthContext } from "@/contexts/AuthContext";
import { Customer, Transaction } from "@/lib/types-enhanced";
import databaseManager from "@/lib/database-enhanced";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function CustomerDashboardContent() {
  const { currentUser, isLoading } = useAuthContext();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.email) return;
    
    const customers = databaseManager.getCustomers();
    const foundCustomer = customers.find(c => c.email === currentUser.email);
    
    if (foundCustomer) {
      setCustomer(foundCustomer);
      
      // Load recent transactions (last 5)
      const transactions = databaseManager.getTransactions({ customerId: foundCustomer.id });
      const sortedTransactions = transactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRecentTransactions(sortedTransactions.slice(0, 5));
    }
    
    setLoading(false);
  }, [currentUser]);

  if (isLoading || loading) {
    return (
      <CustomerLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (!currentUser || currentUser.role !== 'customer' || !customer) {
    return (
      <CustomerLayout title="Dashboard">
        <div className="text-center py-8">
          <p className="text-red-600">Unable to load customer data. Please try logging in again.</p>
        </div>
      </CustomerLayout>
    );
  }

  // Calculate some dashboard statistics
  const monthlyTransactions = recentTransactions.filter(t => 
    new Date(t.timestamp).getMonth() === new Date().getMonth()
  );
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <CustomerLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, {customer.name}
          </h1>
          <p className="text-gray-600">Account: {customer.account.accountNumber}</p>
          <p className="text-sm text-gray-500">
            Last login: {customer.lastLogin ? new Date(customer.lastLogin).toLocaleString() : 'First time'}
          </p>
        </div>

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <Card className="md:col-span-2">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-semibold">Account Balance</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                ${customer.account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-gray-600 mb-4">Available funds</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Monthly Income</p>
                  <p className="font-semibold text-green-600">+${monthlyIncome.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly Expenses</p>
                  <p className="font-semibold text-red-600">-${monthlyExpenses.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Virtual Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                ${customer.card.balance.toFixed(2)}
              </div>
              <p className="text-gray-600 text-sm mb-3">Card Balance</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Daily Limit:</span>
                  <span className="font-medium">${customer.card.dailyLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium capitalize ${
                    customer.card.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {customer.card.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallets Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 text-orange-600 font-bold">
                  ₿
                </span>
                Bitcoin Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">Wallet Address:</p>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="font-mono text-sm break-all">{customer.wallets.btc}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(customer.wallets.btc);
                    // You could add a toast notification here
                  }}
                >
                  Copy Address
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600 font-bold">
                  ₮
                </span>
                USDT Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">Wallet Address:</p>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="font-mono text-sm break-all">{customer.wallets.usdt}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(customer.wallets.usdt);
                    // You could add a toast notification here
                  }}
                >
                  Copy Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/customer/transfers">
                <Button className="w-full h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">💸</span>
                  <span>Transfer Money</span>
                </Button>
              </Link>
              
              <Link href="/customer/card">
                <Button className="w-full h-20 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">💳</span>
                  <span>Fund Card</span>
                </Button>
              </Link>
              
              <Link href="/customer/history">
                <Button className="w-full h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span>Transaction History</span>
                </Button>
              </Link>
              
              <Link href="/customer/settings">
                <Button className="w-full h-20 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  <span>Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link href="/customer/history">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.timestamp).toLocaleDateString()} • {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent transactions</p>
                <p className="text-sm">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Limits & Permissions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Money Transfers</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    customer.account.permissions.canTransfer 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.account.permissions.canTransfer ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Wallet Funding</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    customer.account.permissions.canFundFromWallet 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.account.permissions.canFundFromWallet ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Card Management</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    customer.account.permissions.canManageCard 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.account.permissions.canManageCard ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Transfer Limit:</span>
                  <span className="font-medium">${customer.account.limits.dailyTransferLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Transfer Limit:</span>
                  <span className="font-medium">${customer.account.limits.monthlyTransferLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Daily Limit:</span>
                  <span className="font-medium">${customer.account.limits.cardDailyLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Monthly Limit:</span>
                  <span className="font-medium">${customer.account.limits.cardMonthlyLimit.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  );
}
