import { useState } from "react";
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

// Mock data for transaction history
const transactions = [
  {
    id: "txn_1",
    date: "2024-07-28",
    time: "2:30 PM",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: -15.99,
    status: "Completed",
    balance: 10432.55,
  },
  {
    id: "txn_2",
    date: "2024-07-28",
    time: "9:00 AM",
    description: "Salary Deposit",
    category: "Income",
    amount: 2500.0,
    status: "Completed",
    balance: 10448.54,
  },
  {
    id: "txn_3",
    date: "2024-07-27",
    time: "11:45 AM",
    description: "Starbucks Coffee",
    category: "Food & Dining",
    amount: -5.75,
    status: "Completed",
    balance: 7948.54,
  },
  {
    id: "txn_4",
    date: "2024-07-26",
    time: "4:20 PM",
    description: "Gas Station",
    category: "Transportation",
    amount: -45.3,
    status: "Completed",
    balance: 7954.29,
  },
  {
    id: "txn_5",
    date: "2024-07-25",
    time: "3:15 PM",
    description: "Amazon Purchase",
    category: "Shopping",
    amount: -89.99,
    status: "Completed",
    balance: 7999.59,
  },
  {
    id: "txn_6",
    date: "2024-07-24",
    time: "1:00 PM",
    description: "ATM Withdrawal",
    category: "Cash",
    amount: -100.0,
    status: "Completed",
    balance: 8089.58,
  },
  {
    id: "txn_7",
    date: "2024-07-23",
    time: "10:30 AM",
    description: "Rent Payment",
    category: "Housing",
    amount: -1200.0,
    status: "Completed",
    balance: 8189.58,
  },
  {
    id: "txn_8",
    date: "2024-07-22",
    time: "6:45 PM",
    description: "Restaurant Dinner",
    category: "Food & Dining",
    amount: -67.23,
    status: "Completed",
    balance: 9389.58,
  },
];

const categories = ["All", "Income", "Food & Dining", "Entertainment", "Shopping", "Transportation", "Housing", "Cash"];

export default function HistoryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = selectedCategory === "All" || transaction.category === selectedCategory;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = transaction.date === "2024-07-28";
    } else if (dateFilter === "week") {
      const transactionDate = new Date(transaction.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = transactionDate >= weekAgo;
    } else if (dateFilter === "month") {
      const transactionDate = new Date(transaction.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = transactionDate >= monthAgo;
    }
    
    return matchesCategory && matchesSearch && matchesDate;
  });

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
                            <p className="font-medium">{transaction.date}</p>
                            <p className="text-sm text-gray-500">{transaction.time}</p>
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
                          <span className="text-gray-600">${transaction.balance.toFixed(2)}</span>
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