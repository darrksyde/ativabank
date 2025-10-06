import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import databaseManager from "@/lib/database-enhanced";
import { useAuthContext } from "@/contexts/AuthContext";
import { Customer, Transaction, TransactionFilters } from "@/lib/types-enhanced";
import { formatCurrency, formatDate } from "@/lib/validation-enhanced";

const categories = [
  "All", 
  "transfer", 
  "deposit", 
  "withdrawal", 
  "card-funding", 
  "wallet-funding", 
  "payment", 
  "refund", 
  "fee", 
  "adjustment", 
  "initial-deposit"
];

export default function HistoryPage() {
  const { currentUser } = useAuthContext();
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Load customer data and transactions
  useEffect(() => {
    if (currentUser?.email) {
      setIsLoading(true);
      
      // Get customer data
      const customer = databaseManager.getCustomerByEmail(currentUser.email);
      if (customer.success && customer.data) {
        setCurrentCustomer(customer.data);
        
        // Get transactions for this customer
        const customerTransactions = databaseManager.getCustomerTransactions(customer.data.id);
        setTransactions(customerTransactions);
      }
      
      setIsLoading(false);
    }
  }, [currentUser]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = selectedCategory === "All" || transaction.category === selectedCategory;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    const transactionDate = new Date(transaction.timestamp);
    
    if (dateFilter === "today") {
      const today = new Date();
      matchesDate = transactionDate.toDateString() === today.toDateString();
    } else if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = transactionDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = transactionDate >= monthAgo;
    }

    // Advanced date filters
    if (customDateFrom) {
      const fromDate = new Date(customDateFrom);
      matchesDate = matchesDate && transactionDate >= fromDate;
    }
    
    if (customDateTo) {
      const toDate = new Date(customDateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire day
      matchesDate = matchesDate && transactionDate <= toDate;
    }

    // Amount filters
    let matchesAmount = true;
    if (minAmount) {
      const min = parseFloat(minAmount);
      matchesAmount = matchesAmount && Math.abs(transaction.amount) >= min;
    }
    
    if (maxAmount) {
      const max = parseFloat(maxAmount);
      matchesAmount = matchesAmount && Math.abs(transaction.amount) <= max;
    }
    
    return matchesCategory && matchesSearch && matchesDate && matchesAmount;
  });

  const exportTransactions = () => {
    const csvContent = [
      // CSV Header
      ['Date', 'Description', 'Category', 'Type', 'Amount', 'Balance After', 'Status', 'Reference'].join(','),
      // CSV Data
      ...filteredTransactions.map(t => [
        formatDate(t.timestamp),
        `"${t.description}"`,
        t.category,
        t.type,
        t.amount,
        t.balanceAfter,
        t.status,
        t.reference
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ativabank-transactions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Income":
        return "💰";
      case "Food & Dining":
        return "🍽️";
      case "Entertainment":
        return "🎬";
      case "Shopping":
        return "🛍️";
      case "Transportation":
        return "🚗";
      case "Housing":
        return "🏠";
      case "Cash":
        return "💵";
      default:
        return "📝";
    }
  };

  return (
    <CustomerLayout title="Transaction History">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600">View and analyze your account activity</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter your transactions by category, date, or search terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Transactions
                </label>
                <input
                  type="text"
                  placeholder="Search by description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3 flex-wrap">
              <button
                onClick={exportTransactions}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Advanced Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-4">Advanced Filters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={customDateFrom}
                      onChange={(e) => setCustomDateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={customDateTo}
                      onChange={(e) => setCustomDateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Amount ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Amount ($)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setCustomDateFrom("");
                      setCustomDateTo("");
                      setMinAmount("");
                      setMaxAmount("");
                      setSelectedCategory("All");
                      setSearchTerm("");
                      setDateFilter("all");
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">↗</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-lg font-bold text-green-600">$2,500.00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">↘</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-lg font-bold text-red-600">-$1,524.27</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">#</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-lg font-bold text-blue-600">{filteredTransactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">Ø</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Transaction</p>
                  <p className="text-lg font-bold text-purple-600">$190.53</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No transactions found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatDate(transaction.timestamp)}</p>
                            <p className="text-sm text-gray-500">ID: {transaction.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                            <span className="font-medium">{transaction.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {transaction.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${
                              transaction.amount > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600">{formatCurrency(transaction.balanceAfter)}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Export Transactions</h3>
                <p className="text-sm text-gray-600">Download your transaction history</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Export as CSV
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Export as PDF
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}