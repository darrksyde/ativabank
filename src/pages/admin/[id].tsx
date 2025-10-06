import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import databaseManager from '@/lib/database-enhanced';
import { Customer, Transaction } from '@/lib/types-enhanced';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminCustomerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuthContext();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editForm, setEditForm] = useState<Partial<Customer> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    
    const customers = databaseManager.getCustomers();
    const foundCustomer = customers.find(c => c.id === id);
    if (foundCustomer) {
      setCustomer(foundCustomer);
      const allTransactions = databaseManager.getTransactions({ customerId: id });
      setTransactions(allTransactions);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  
  if (!currentUser) return null;

  if (!customer) {
    return (
      <div className="p-8">
        <p>Customer not found</p>
        <Link href="/admin">
          <Button className="mt-4">Back to Admin Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleSaveCustomer = () => {
    if (!editForm || !customer || !currentUser) return;
    
    const updated = databaseManager.updateCustomer(customer.id, editForm, currentUser.email);
    if (updated.success && updated.data) {
      setCustomer(updated.data);
      setIsEditDialogOpen(false);
      setEditForm(null);
    }
  };

  const handleEditClick = () => {
    setEditForm({
      name: customer.name,
      email: customer.email,
      profile: customer.profile,
      account: customer.account,
      wallets: customer.wallets
    });
    setIsEditDialogOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!customer || !currentUser) return;
    
    const newStatus = customer.status === "active" ? "blocked" : "active";
    const updated = await databaseManager.updateCustomerStatus(customer.id, newStatus, currentUser.email);
    if (updated.success && updated.data) {
      setCustomer(updated.data);
    }
  };

  const handleAddTransaction = async () => {
    if (!transactionAmount || !transactionDescription || !customer || !currentUser) return;
    
    const amount = parseFloat(transactionAmount);
    
    // Update customer balance
    const newBalance = transactionType === 'credit' 
      ? customer.account.balance + amount 
      : customer.account.balance - amount;
    
    const updatedAccount = { ...customer.account, balance: newBalance };
    
    const updateResponse = databaseManager.updateCustomer(customer.id, {
      account: updatedAccount
    }, currentUser.email);
    
    if (updateResponse.success && updateResponse.data) {
      setCustomer(updateResponse.data);
    }
    
    // Create transaction record
    const transactionResponse = await databaseManager.createTransaction({
      customerId: customer.id,
      type: transactionType,
      amount,
      description: transactionDescription,
      category: 'deposit'
    }, currentUser.email);
    
    if (transactionResponse.success) {
      // Refresh transactions
      const allTransactions = databaseManager.getTransactions({ customerId: customer.id });
      setTransactions(allTransactions);
    }
    
    setIsTransactionDialogOpen(false);
    setTransactionAmount('');
    setTransactionDescription('');
  };

  return (
    <div className="p-8 space-y-6">
      {/* Back Button */}
      <Link href="/admin">
        <Button variant="outline">← Back to Admin Dashboard</Button>
      </Link>

      {/* Customer Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Customer Information</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEditClick}>Edit Information</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <p className="text-sm font-medium">{customer.name}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm font-medium">{customer.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <p className="text-sm font-medium">{customer.profile.phone || 'Not provided'}</p>
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <p className="text-sm font-medium">{customer.account.accountNumber}</p>
            </div>
            <div className="space-y-2">
              <Label>Balance</Label>
              <p className="text-sm font-medium">${customer.account.balance.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    customer.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {customer.status === "active" ? "Active" : "Blocked"}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>BTC Wallet</Label>
            <p className="text-sm font-medium">{customer.wallets.btc}</p>
          </div>
          <div className="space-y-2">
            <Label>USDT Wallet</Label>
            <p className="text-sm font-medium">{customer.wallets.usdt}</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={() => setIsTransactionDialogOpen(true)}>Add Transaction</Button>
            <Button
              variant={customer.status === "active" ? "destructive" : "default"}
              onClick={handleToggleStatus}
            >
              {customer.status === "active" ? "Block Account" : "Activate Account"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === "debit"
                        ? "text-destructive"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.type === "debit" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm?.name || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={editForm?.email || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm?.profile?.phone || ""}
                onChange={(e) => setEditForm(prev => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    profile: { 
                      ...prev.profile,
                      name: prev.profile?.name || '',
                      phone: e.target.value 
                    }
                  };
                })}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCustomer}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Manual Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <select 
                value={transactionType} 
                onChange={(e) => setTransactionType(e.target.value as 'credit' | 'debit')}
                className="w-full p-2 border rounded"
              >
                <option value="credit">Credit (Add Money)</option>
                <option value="debit">Debit (Remove Money)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction-amount">Amount</Label>
              <Input
                id="transaction-amount"
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction-description">Description</Label>
              <Input
                id="transaction-description"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                placeholder="Transaction description"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTransaction}>Add Transaction</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminCustomerDetailPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
      <AdminCustomerDetail />
    </ProtectedRoute>
  );
}