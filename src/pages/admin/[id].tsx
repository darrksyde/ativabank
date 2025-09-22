import { useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/layout/Header";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Mock customer data - in a real app, this would come from an API
const mockCustomerData = {
  cust_001: {
    id: "cust_001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    accountNumber: "1234567890",
    balance: 10432.55,
    status: "Active",
    joinDate: "2024-01-15",
    address: "123 Main St, City, State 12345",
  },
  cust_002: {
    id: "cust_002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 234-5678",
    accountNumber: "2345678901",
    balance: 7850.30,
    status: "Active",
    joinDate: "2024-02-20",
    address: "456 Oak Ave, City, State 67890",
  },
  cust_003: {
    id: "cust_003",
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1 (555) 345-6789",
    accountNumber: "3456789012",
    balance: 2150.75,
    status: "Blocked",
    joinDate: "2024-03-10",
    address: "789 Pine St, City, State 13579",
  },
  cust_004: {
    id: "cust_004",
    name: "Alice Brown",
    email: "alice.brown@email.com",
    phone: "+1 (555) 456-7890",
    accountNumber: "4567890123",
    balance: 15687.90,
    status: "Active",
    joinDate: "2024-04-05",
    address: "321 Elm Dr, City, State 24680",
  },
};

// Mock transaction data
const mockTransactions = [
  { id: "txn_1", date: "2024-07-28", type: "Deposit", amount: 1000.00, description: "Salary" },
  { id: "txn_2", date: "2024-07-27", type: "Withdrawal", amount: -50.00, description: "ATM Withdrawal" },
  { id: "txn_3", date: "2024-07-26", type: "Transfer", amount: -200.00, description: "Transfer to Jane" },
  { id: "txn_4", date: "2024-07-25", type: "Deposit", amount: 500.00, description: "Freelance Payment" },
];

export default function ManageCustomer() {
  const router = useRouter();
  const { id } = router.query;
  const [customerData, setCustomerData] = useState(
    mockCustomerData[id as keyof typeof mockCustomerData] || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(customerData || {});

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