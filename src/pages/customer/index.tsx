import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import Link from "next/link";

// Mock data
const mockUser = {
  name: "John Doe",
  balance: 10432.55,
  transactions: [
    { id: 1, description: "Coffee Shop", amount: -4.99, date: "2024-01-15", category: "Food & Dining" },
    { id: 2, description: "Salary Deposit", amount: 3500.00, date: "2024-01-14", category: "Income" },
    { id: 3, description: "Grocery Store", amount: -89.23, date: "2024-01-13", category: "Groceries" },
    { id: 4, description: "Netflix Subscription", amount: -15.99, date: "2024-01-12", category: "Entertainment" },
  ],
  wallets: {
    btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    usdt: "0x1234567890abcdef1234567890abcdef12345678"
  }
};

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('ativabank_user');
    if (!userData) {
      router.push('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== 'customer') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ativabank_user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header title="Customer Dashboard" onLogout={handleLogout} />
      <Navigation userType="customer" />
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {mockUser.name}
              </h1>
              <p className="text-gray-600">Manage your finances with confidence</p>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Account Balance */}
              <div className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <div className="relative">
                  <h3 className="text-white/90 text-lg font-semibold mb-1">Account Balance</h3>
                  <p className="text-white/70 text-sm mb-4">Available funds</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    ${mockUser.balance.toLocaleString()}
                  </p>
                  <p className="text-white/80 text-sm">+2.5% from last month</p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
              </div>

              {/* Monthly Spending */}
              <div className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl p-6">
                <h3 className="text-gray-700 text-lg font-semibold mb-1">Monthly Spending</h3>
                <p className="text-gray-500 text-sm mb-4">This month's expenses</p>
                <p className="text-3xl font-bold text-red-500 mb-2">$1,247.82</p>
                <p className="text-gray-600 text-sm">15% less than last month</p>
              </div>

              {/* Savings */}
              <div className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl p-6">
                <h3 className="text-gray-700 text-lg font-semibold mb-1">Total Savings</h3>
                <p className="text-gray-500 text-sm mb-4">Across all accounts</p>
                <p className="text-3xl font-bold text-green-500 mb-2">$25,843.21</p>
                <p className="text-gray-600 text-sm">Great progress!</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-0 shadow-lg bg-white rounded-xl p-6">
              <h3 className="text-gray-800 text-lg font-semibold mb-1">Quick Actions</h3>
              <p className="text-gray-500 text-sm mb-6">Common banking operations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/customer/transfers">
                  <button className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg text-white rounded-lg transition-all duration-200">
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span className="text-sm font-medium">Transfer</span>
                    </div>
                  </button>
                </Link>
                <Link href="/customer/card">
                  <button className="w-full h-16 border border-purple-200 hover:bg-purple-50 hover:border-purple-300 rounded-lg transition-all duration-200">
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-sm font-medium text-purple-700">Fund Card</span>
                    </div>
                  </button>
                </Link>
                <Link href="/customer/history">
                  <button className="w-full h-16 border border-green-200 hover:bg-green-50 hover:border-green-300 rounded-lg transition-all duration-200">
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-700">History</span>
                    </div>
                  </button>
                </Link>
                <button className="w-full h-16 border border-orange-200 hover:bg-orange-50 hover:border-orange-300 rounded-lg transition-all duration-200">
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm font-medium text-orange-700">Analytics</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div className="border-0 shadow-lg bg-white rounded-xl p-6">
                <h3 className="text-gray-800 text-lg font-semibold mb-1">Recent Transactions</h3>
                <p className="text-gray-500 text-sm mb-6">Your latest activity</p>
                <div className="space-y-4">
                  {mockUser.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : '-'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 border border-blue-200 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors duration-200">
                  View All Transactions
                </button>
              </div>

              {/* Crypto Wallets */}
              <div className="border-0 shadow-lg bg-white rounded-xl p-6">
                <h3 className="text-gray-800 text-lg font-semibold mb-1">Crypto Wallets</h3>
                <p className="text-gray-500 text-sm mb-6">Your cryptocurrency addresses</p>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        ₿
                      </div>
                      <div>
                        <p className="font-semibold text-orange-800">Bitcoin (BTC)</p>
                        <p className="text-sm text-orange-600">Primary wallet</p>
                      </div>
                    </div>
                    <p className="text-sm bg-white/80 p-3 rounded-lg font-mono text-gray-700 break-all">
                      {mockUser.wallets.btc}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        ₮
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">Tether (USDT)</p>
                        <p className="text-sm text-green-600">Stablecoin wallet</p>
                      </div>
                    </div>
                    <p className="text-sm bg-white/80 p-3 rounded-lg font-mono text-gray-700 break-all">
                      {mockUser.wallets.usdt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}

