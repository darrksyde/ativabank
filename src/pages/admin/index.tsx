import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Mock data for customers
const mockCustomers = [
  {
    id: "cust_001",
    name: "John Doe",
    email: "john.doe@email.com",
    accountNumber: "1234567890",
    balance: 10432.55,
    status: "Active",
  },
  {
    id: "cust_002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    accountNumber: "2345678901",
    balance: 7850.30,
    status: "Active",
  },
  {
    id: "cust_003",
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    accountNumber: "3456789012",
    balance: 2150.75,
    status: "Blocked",
  },
  {
    id: "cust_004",
    name: "Alice Brown",
    email: "alice.brown@email.com",
    accountNumber: "4567890123",
    balance: 15687.90,
    status: "Active",
  },
];

export default function AdminDashboard() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    initialDeposit: "",
  });

  const handleCreateCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.initialDeposit) {
      alert("Please fill in all required fields.");
      return;
    }

    const customer = {
      id: `cust_${String(customers.length + 1).padStart(3, "0")}`,
      name: newCustomer.name,
      email: newCustomer.email,
      accountNumber: String(Math.floor(Math.random() * 10000000000)),
      balance: parseFloat(newCustomer.initialDeposit),
      status: "Active",
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: "", email: "", initialDeposit: "" });
    setIsDialogOpen(false);
    alert("Customer created successfully!");
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((customer) => customer.id !== customerId));
      alert("Customer deleted successfully!");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Admin" />
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  Manage all customer accounts and their details.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create New Customer</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Customer</DialogTitle>
                    <DialogDescription>
                      Add a new customer account to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, name: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, email: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="deposit" className="text-right">
                        Initial Deposit
                      </Label>
                      <Input
                        id="deposit"
                        type="number"
                        value={newCustomer.initialDeposit}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            initialDeposit: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateCustomer}>
                      Create Customer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.accountNumber}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell className="text-right">
                        ${customer.balance.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            customer.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/${customer.id}`}>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            Delete
                          </Button>
                        </div>
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
