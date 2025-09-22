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

// Mock data for admin users
const mockAdmins = [
  {
    id: "admin_001",
    name: "Sarah Wilson",
    email: "sarah.wilson@ativabank.com",
    role: "Senior Admin",
    status: "Active",
    joinDate: "2024-01-10",
    lastLogin: "2024-07-28 14:30",
  },
  {
    id: "admin_002",
    name: "Michael Chen",
    email: "michael.chen@ativabank.com",
    role: "Customer Service Admin",
    status: "Active",
    joinDate: "2024-02-15",
    lastLogin: "2024-07-28 09:15",
  },
  {
    id: "admin_003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@ativabank.com",
    role: "Compliance Admin",
    status: "Blocked",
    joinDate: "2024-03-20",
    lastLogin: "2024-07-25 16:45",
  },
  {
    id: "admin_004",
    name: "David Thompson",
    email: "david.thompson@ativabank.com",
    role: "Operations Admin",
    status: "Active",
    joinDate: "2024-04-12",
    lastLogin: "2024-07-28 11:20",
  },
];

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState(mockAdmins);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const handleCreateAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.role || !newAdmin.password) {
      alert("Please fill in all required fields.");
      return;
    }

    const admin = {
      id: `admin_${String(admins.length + 1).padStart(3, "0")}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: "Active" as const,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: "Never",
    };

    setAdmins([...admins, admin]);
    setNewAdmin({ name: "", email: "", role: "", password: "" });
    setIsDialogOpen(false);
    alert("Admin created successfully!");
  };

  const handleToggleStatus = (adminId: string) => {
    setAdmins(admins.map(admin => {
      if (admin.id === adminId) {
        const newStatus = admin.status === "Active" ? "Blocked" : "Active";
        return { ...admin, status: newStatus };
      }
      return admin;
    }));
    alert("Admin status updated successfully!");
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      setAdmins(admins.filter(admin => admin.id !== adminId));
      alert("Admin deleted successfully!");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Super Admin" />
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>
                  Manage all administrator accounts and their permissions.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create New Admin</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Admin</DialogTitle>
                    <DialogDescription>
                      Add a new administrator to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newAdmin.name}
                        onChange={(e) =>
                          setNewAdmin({ ...newAdmin, name: e.target.value })
                        }
                        className="col-span-3"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) =>
                          setNewAdmin({ ...newAdmin, email: e.target.value })
                        }
                        className="col-span-3"
                        placeholder="admin@ativabank.com"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <Input
                        id="role"
                        value={newAdmin.role}
                        onChange={(e) =>
                          setNewAdmin({ ...newAdmin, role: e.target.value })
                        }
                        className="col-span-3"
                        placeholder="e.g., Customer Service Admin"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newAdmin.password}
                        onChange={(e) =>
                          setNewAdmin({ ...newAdmin, password: e.target.value })
                        }
                        className="col-span-3"
                        placeholder="Temporary password"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateAdmin}>
                      Create Admin
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
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        {admin.name}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.role}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            admin.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {admin.lastLogin}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/super-admin/${admin.id}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant={admin.status === "Active" ? "secondary" : "default"}
                            size="sm"
                            onClick={() => handleToggleStatus(admin.id)}
                          >
                            {admin.status === "Active" ? "Block" : "Unblock"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin.id)}
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
