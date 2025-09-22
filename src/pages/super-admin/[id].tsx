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

// Mock admin data - in a real app, this would come from an API
const mockAdminData = {
  admin_001: {
    id: "admin_001",
    name: "Sarah Wilson",
    email: "sarah.wilson@ativabank.com",
    phone: "+1 (555) 987-6543",
    role: "Senior Admin",
    status: "Active",
    joinDate: "2024-01-10",
    lastLogin: "2024-07-28 14:30",
    department: "Operations",
    permissions: ["Customer Management", "Transaction Oversight", "Report Generation"],
    address: "456 Corporate Blvd, Business District, State 54321",
  },
  admin_002: {
    id: "admin_002",
    name: "Michael Chen",
    email: "michael.chen@ativabank.com",
    phone: "+1 (555) 876-5432",
    role: "Customer Service Admin",
    status: "Active",
    joinDate: "2024-02-15",
    lastLogin: "2024-07-28 09:15",
    department: "Customer Service",
    permissions: ["Customer Support", "Account Recovery", "Basic Transactions"],
    address: "789 Service St, Customer Care Complex, State 98765",
  },
  admin_003: {
    id: "admin_003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@ativabank.com",
    phone: "+1 (555) 765-4321",
    role: "Compliance Admin",
    status: "Blocked",
    joinDate: "2024-03-20",
    lastLogin: "2024-07-25 16:45",
    department: "Compliance",
    permissions: ["Audit Reports", "Regulatory Compliance", "Risk Assessment"],
    address: "321 Compliance Ave, Legal District, State 13579",
  },
  admin_004: {
    id: "admin_004",
    name: "David Thompson",
    email: "david.thompson@ativabank.com",
    phone: "+1 (555) 654-3210",
    role: "Operations Admin",
    status: "Active",
    joinDate: "2024-04-12",
    lastLogin: "2024-07-28 11:20",
    department: "Operations",
    permissions: ["System Maintenance", "User Management", "Technical Support"],
    address: "987 Tech Park, Operations Center, State 24680",
  },
};

// Mock activity log data
const mockActivityLog = [
  { id: "log_1", date: "2024-07-28 14:30", action: "Logged in", details: "Successful login from IP: 192.168.1.100" },
  { id: "log_2", date: "2024-07-28 14:25", action: "Updated Customer", details: "Modified account details for customer ID: cust_001" },
  { id: "log_3", date: "2024-07-28 13:45", action: "Generated Report", details: "Downloaded monthly transaction report" },
  { id: "log_4", date: "2024-07-28 10:15", action: "Created Customer", details: "Added new customer account: John Smith" },
  { id: "log_5", date: "2024-07-27 16:30", action: "Logged out", details: "Session ended normally" },
];

export default function ManageAdmin() {
  const router = useRouter();
  const { id } = router.query;
  const [adminData, setAdminData] = useState(
    mockAdminData[id as keyof typeof mockAdminData] || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(adminData || {});

  if (!adminData) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header title="Super Admin" />
        <div className="flex flex-1">
          <main className="flex-1 p-6">
            <Card>
              <CardContent className="p-6">
                <p>Admin not found</p>
                <Link href="/super-admin">
                  <Button className="mt-4">Back to Super Admin Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setAdminData(editForm);
    setIsEditing(false);
    alert("Admin information updated successfully!");
  };

  const handleStatusToggle = () => {
    const newStatus = adminData.status === "Active" ? "Blocked" : "Active";
    setAdminData({ ...adminData, status: newStatus });
    alert(`Admin ${newStatus.toLowerCase()} successfully!`);
  };

  const handleResetPassword = () => {
    const newPassword = prompt("Enter new temporary password for this admin:");
    if (newPassword && newPassword.length >= 6) {
      alert(`Password reset successfully! New temporary password: ${newPassword}`);
    } else if (newPassword) {
      alert("Password must be at least 6 characters long.");
    }
  };

  const handlePermissionUpdate = () => {
    alert("Permission management interface would be implemented here in a real application.");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Super Admin" />
      <div className="flex flex-1">
        <main className="flex-1 p-6 space-y-6">
          {/* Back Button */}
          <Link href="/super-admin">
            <Button variant="outline">← Back to Super Admin Dashboard</Button>
          </Link>

          {/* Admin Information Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Information</CardTitle>
                <CardDescription>
                  Manage administrator account details and permissions.
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
                    setEditForm(adminData);
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
                    <p className="text-sm font-medium">{adminData.name}</p>
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
                    <p className="text-sm font-medium">{adminData.email}</p>
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
                    <p className="text-sm font-medium">{adminData.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  {isEditing ? (
                    <Input
                      id="role"
                      value={editForm.role || ""}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium">{adminData.role}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  {isEditing ? (
                    <Input
                      id="department"
                      value={editForm.department || ""}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium">{adminData.department}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        adminData.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {adminData.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <p className="text-sm font-medium">{adminData.joinDate}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastLogin">Last Login</Label>
                  <p className="text-sm font-medium">{adminData.lastLogin}</p>
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
                  <p className="text-sm font-medium">{adminData.address}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissions">Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {adminData.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="inline-flex rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>
                Perform administrative actions on this admin account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleResetPassword}>Reset Password</Button>
                <Button
                  variant={adminData.status === "Active" ? "destructive" : "default"}
                  onClick={handleStatusToggle}
                >
                  {adminData.status === "Active" ? "Block Admin" : "Activate Admin"}
                </Button>
                <Button variant="outline" onClick={handlePermissionUpdate}>
                  Update Permissions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Admin's recent actions and system activity log.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActivityLog.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-sm">
                        {log.date}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.details}
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