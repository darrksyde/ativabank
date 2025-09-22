import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Enhanced mock customer data with all required fields
const mockCustomerData = {
  "1": {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    accountNumber: "ACC001",
    balance: 15420.50,
    status: "Active",
    joinDate: "2024-01-15",
    lastLogin: "2024-12-22",
    address: "123 Main St, City, State 12345",
    btcWallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    usdtWallet: "0x742a4c2d2ef1d8e8b6c7a1b8d9f0e3a4b5c6d7e8",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    password: "temp123", // In real app, this would be hashed
    createdAt: "2024-01-15"
  },
  "2": {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 (555) 234-5678",
    accountNumber: "ACC002",
    balance: 8750.25,
    status: "Active",
    joinDate: "2024-02-01",
    lastLogin: "2024-12-21",
    address: "456 Oak Ave, City, State 67890",
    btcWallet: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    usdtWallet: "0x8e9f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    password: "secure456",
    createdAt: "2024-02-01"
  },
  "3": {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    phone: "+1 (555) 345-6789",
    accountNumber: "ACC003",
    balance: 32180.75,
    status: "Blocked",
    joinDate: "2024-01-28",
    lastLogin: "2024-12-20",
    address: "789 Pine St, City, State 13579",
    btcWallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    usdtWallet: "0x1f2e3d4c5b6a7980e1f2e3d4c5b6a798",
    profilePhoto: "",
    canTransfer: false,
    canFundWithWallet: false,
    password: "blocked789",
    createdAt: "2024-01-28"
  },
  "4": {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 (555) 456-7890",
    accountNumber: "ACC004",
    balance: 5220.00,
    status: "Active",
    joinDate: "2024-03-10",
    lastLogin: "2024-12-22",
    address: "321 Elm Dr, City, State 24680",
    btcWallet: "36UPz5zY8QpFdBCXeHqS7UvgMcVfzLKDfm",
    usdtWallet: "0x4f5e6d7c8b9a0123456789abcdef0123",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    password: "david2024",
    createdAt: "2024-03-10"
  },
  "5": {
    id: "5",
    name: "Eva Brown",
    email: "eva@example.com",
    phone: "+1 (555) 567-8901",
    accountNumber: "ACC005",
    balance: 12840.30,
    status: "Active",
    joinDate: "2024-02-15",
    lastLogin: "2024-12-21",
    address: "987 Cedar Blvd, City, State 97531",
    btcWallet: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    usdtWallet: "0x9876543210abcdef0123456789abcdef",
    profilePhoto: "",
    canTransfer: true,
    canFundWithWallet: true,
    password: "eva2024!",
    createdAt: "2024-02-15"
  }
};

// Enhanced mock transaction data
const mockTransactions = [
  { id: "txn_1", date: "2024-12-22", time: "14:30", type: "Credit", amount: 1000.00, description: "Salary Deposit", category: "Income", status: "Completed" },
  { id: "txn_2", date: "2024-12-21", time: "16:45", type: "Debit", amount: -50.00, description: "ATM Withdrawal", category: "Cash", status: "Completed" },
  { id: "txn_3", date: "2024-12-21", time: "10:20", type: "Debit", amount: -200.00, description: "Transfer to Jane Smith", category: "Transfer", status: "Completed" },
  { id: "txn_4", date: "2024-12-20", time: "09:15", type: "Credit", amount: 500.00, description: "Freelance Payment", category: "Income", status: "Completed" },
  { id: "txn_5", date: "2024-12-19", time: "18:30", type: "Debit", amount: -75.50, description: "Grocery Store", category: "Shopping", status: "Completed" },
];

export default function ManageCustomer() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>(null);
  const [customerData, setCustomerData] = useState(
    mockCustomerData[id as keyof typeof mockCustomerData] || null
  );
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(customerData || {});
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "Credit",
    amount: "",
    description: "",
    category: "Income"
  });
  const [newPassword, setNewPassword] = useState("");

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

  if (!user) return null;

  if (!customerData) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header title="Admin" />
        <div className="flex flex-1">
          <main className="flex-1 p-6">
            <Card>
              <CardContent className="p-6">
                <p>Customer not found</p>
                <Link href="/admin">
                  <Button className="mt-4">Back to Admin Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setCustomerData(editForm);
    setIsEditing(false);
    alert("Customer information updated successfully!");
  };

  const handleStatusToggle = () => {
    const newStatus = customerData.status === "Active" ? "Blocked" : "Active";
    setCustomerData({ ...customerData, status: newStatus });
    alert(`Customer ${newStatus.toLowerCase()} successfully!`);
  };

  const handleFundAccount = () => {
    const amount = prompt("Enter amount to add to account:");
    if (amount && !isNaN(parseFloat(amount))) {
      const newBalance = customerData.balance + parseFloat(amount);
      setCustomerData({ ...customerData, balance: newBalance });
      alert(`$${amount} added to account successfully!`);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Admin" />
      <div className="flex flex-1">
        <main className="flex-1 p-6 space-y-6">
          {/* Back Button */}
          <Link href="/admin">
            <Button variant="outline">← Back to Admin Dashboard</Button>
          </Link>

          {/* Customer Information Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Manage customer account details and settings.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => {
                    setEditForm(customerData);
                    setIsEditing(true);
                  }}>
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium">{customerData.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium">{customerData.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editForm.phone || ""}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium">{customerData.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <p className="text-sm font-medium">{customerData.accountNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Balance</Label>
                  <p className="text-sm font-medium">${customerData.balance.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        customerData.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customerData.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editForm.address || ""}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium">{customerData.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Perform administrative actions on this customer account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={handleFundAccount}>Fund Account</Button>
                <Button
                  variant={customerData.status === "Active" ? "destructive" : "default"}
                  onClick={handleStatusToggle}
                >
                  {customerData.status === "Active" ? "Block Account" : "Activate Account"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Customer's transaction history and account activity.
              </CardDescription>
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
                  {mockTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          transaction.amount < 0
                            ? "text-destructive"
                            : "text-green-600"
                        }`}
                      >
                        {transaction.amount < 0 ? "-" : "+"}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}