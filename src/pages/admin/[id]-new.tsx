import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthContext } from "@/contexts/AuthContext";
import databaseManager from "@/lib/database-enhanced";
import { Customer, Transaction, TransactionCreationData } from "@/lib/types-enhanced";
import { formatCurrency, formatDate } from "@/lib/validation-enhanced";

function ManageCustomerContent() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser, logout } = useAuthContext();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTransaction, setNewTransaction] = useState({
    type: "credit" as "credit" | "debit",
    amount: "",
    description: "",
    category: "adjustment" as any
  });

  // Load customer data
  useEffect(() => {
    if (id && typeof id === 'string') {
      setLoading(true);
      
      // Get customer by ID
      const foundCustomer = databaseManager.getCustomerById(id);
      if (foundCustomer) {
        setCustomer(foundCustomer);
        setEditForm(foundCustomer);
        
        // Get customer transactions
        const customerTransactions = databaseManager.getCustomerTransactions(id);
        setTransactions(customerTransactions);
      }
      
      setLoading(false);
    }
  }, [id]);

  // Refresh data
  const refreshData = () => {
    if (id && typeof id === 'string') {
      const foundCustomer = databaseManager.getCustomerById(id);
      if (foundCustomer) {
        setCustomer(foundCustomer);
        setEditForm(foundCustomer);
        
        const customerTransactions = databaseManager.getCustomerTransactions(id);
        setTransactions(customerTransactions);
      }
    }
  };

  // Handle save customer changes
  const handleSaveChanges = async () => {
    if (!customer || !editForm) return;

    try {
      const result = await databaseManager.updateCustomer(customer.id, editForm, currentUser?.email || 'admin');
      
      if (result.success) {
        setIsEditing(false);
        refreshData();
        alert("Customer updated successfully!");
      } else {
        alert(`Failed to update customer: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to update customer. Please try again.");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async () => {
    if (!customer) return;

    const newStatus = customer.account.status === 'active' ? 'blocked' : 'active';
    
    try {
      const result = await databaseManager.updateCustomerStatus(customer.id, newStatus, currentUser?.email || 'admin');
      
      if (result.success) {
        refreshData();
        alert(`Customer ${newStatus === 'active' ? 'activated' : 'blocked'} successfully!`);
      } else {
        alert(`Failed to ${newStatus === 'active' ? 'activate' : 'block'} customer: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to update customer status. Please try again.");
    }
  };

  // Handle add transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    const transactionData: TransactionCreationData = {
      customerId: customer.id,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      description: newTransaction.description,
      category: newTransaction.category,
      adminNote: `Manual ${newTransaction.type} by admin: ${currentUser?.email}`
    };

    try {
      const result = await databaseManager.createTransaction(transactionData, currentUser?.email);
      
      if (result.success) {
        setNewTransaction({
          type: "credit",
          amount: "",
          description: "",
          category: "adjustment"
        });
        setIsAddTransactionOpen(false);
        refreshData();
        alert("Transaction added successfully!");
      } else {
        alert(`Failed to add transaction: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to add transaction. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Manage Customer" onLogout={logout} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Manage Customer" onLogout={logout} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer not found</h2>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800">
              ← Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manage Customer" onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">Account #{customer.account.accountNumber}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleToggleStatus}
              variant={customer.account.status === 'active' ? 'destructive' : 'default'}
            >
              {customer.account.status === 'active' ? 'Block Customer' : 'Unblock Customer'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Personal and account details</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (isEditing) {
                      handleSaveChanges();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  {isEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{customer.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium">{customer.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Account Number</Label>
                    <p className="text-sm font-medium">{customer.account.accountNumber}</p>
                  </div>
                  
                  <div>
                    <Label>Status</Label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.account.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.account.status}
                    </span>
                  </div>
                  
                  <div>
                    <Label>BTC Wallet</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.wallets?.btc || ""}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          wallets: { ...editForm.wallets, btc: e.target.value } as any
                        })}
                      />
                    ) : (
                      <p className="text-sm font-medium break-all">{customer.wallets.btc}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>USDT Wallet</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.wallets?.usdt || ""}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          wallets: { ...editForm.wallets, usdt: e.target.value } as any
                        })}
                      />
                    ) : (
                      <p className="text-sm font-medium break-all">{customer.wallets.usdt}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Recent account activity</CardDescription>
                </div>
                <Button onClick={() => setIsAddTransactionOpen(true)}>
                  Add Transaction
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Balance After</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length > 0 ? (
                        transactions.slice(0, 10).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>{formatCurrency(transaction.balanceAfter)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Balance</Label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(customer.account.balance)}
                  </p>
                </div>
                
                <div>
                  <Label>Created Date</Label>
                  <p className="text-sm">{formatDate(customer.createdAt)}</p>
                </div>
                
                <div>
                  <Label>Total Transactions</Label>
                  <p className="text-sm font-medium">{transactions.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissions & Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Can Transfer:</span>
                  <span className={customer.account.permissions.canTransfer ? 'text-green-600' : 'text-red-600'}>
                    {customer.account.permissions.canTransfer ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Can Fund from Wallet:</span>
                  <span className={customer.account.permissions.canFundFromWallet ? 'text-green-600' : 'text-red-600'}>
                    {customer.account.permissions.canFundFromWallet ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Daily Transfer Limit:</span>
                    <span>{formatCurrency(customer.account.limits.dailyTransferLimit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Transfer Limit:</span>
                    <span>{formatCurrency(customer.account.limits.monthlyTransferLimit)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {isAddTransactionOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>
              </div>
              
              <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
                <div>
                  <Label>Transaction Type</Label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as "credit" | "debit"})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="credit">Credit (Add Money)</option>
                    <option value="debit">Debit (Remove Money)</option>
                  </select>
                </div>
                
                <div>
                  <Label>Amount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Input
                    required
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    placeholder="Reason for transaction"
                  />
                </div>
                
                <div>
                  <Label>Category</Label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="adjustment">Adjustment</option>
                    <option value="deposit">Deposit</option>
                    <option value="refund">Refund</option>
                    <option value="fee">Fee</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddTransactionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Transaction
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManageCustomer() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <ManageCustomerContent />
    </ProtectedRoute>
  );
}