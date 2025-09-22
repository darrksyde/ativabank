import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

// Mock admin data
const mockAdmins = [
  { id: 1, name: "Michael Johnson", email: "michael@ativabank.com", status: "Active", createdAt: "2024-01-15", adminId: "ADM001" },
  { id: 2, name: "Sarah Williams", email: "sarah@ativabank.com", status: "Active", createdAt: "2024-01-20", adminId: "ADM002" },
  { id: 3, name: "David Lee", email: "david@ativabank.com", status: "Blocked", createdAt: "2024-02-01", adminId: "ADM003" },
  { id: 4, name: "Emily Chen", email: "emily@ativabank.com", status: "Active", createdAt: "2024-02-10", adminId: "ADM004" },
];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [admins, setAdmins] = useState(mockAdmins);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('ativabank_user');
    if (!userData) {
      router.push('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== 'super-admin') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ativabank_user');
    router.push('/');
  };

  const handleCreateAdmin = () => {
    if (newAdmin.name && newAdmin.email && newAdmin.password) {
      const admin = {
        id: admins.length + 1,
        name: newAdmin.name,
        email: newAdmin.email,
        status: "Active" as const,
        createdAt: new Date().toISOString().split("T")[0],
        adminId: `ADM${String(admins.length + 1).padStart(3, '0')}`
      };
      setAdmins([...admins, admin]);
      setNewAdmin({ name: "", email: "", password: "" });
      setIsCreateDialogOpen(false);
    }
  };

  const toggleAdminStatus = (id: number) => {
    setAdmins(admins.map(admin => 
      admin.id === id 
        ? { ...admin, status: admin.status === "Active" ? "Blocked" : "Active" }
        : admin
    ));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      <Header title="Super Admin Dashboard" onLogout={handleLogout} />
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage admin users and system operations</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
              <h3 className="text-gray-600 text-sm font-medium">Total Admins</h3>
              <p className="text-3xl font-bold text-gray-800">{admins.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <h3 className="text-gray-600 text-sm font-medium">Active Admins</h3>
              <p className="text-3xl font-bold text-gray-800">
                {admins.filter(a => a.status === "Active").length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
              <h3 className="text-gray-600 text-sm font-medium">Blocked Admins</h3>
              <p className="text-3xl font-bold text-gray-800">
                {admins.filter(a => a.status === "Blocked").length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <h3 className="text-gray-600 text-sm font-medium">System Health</h3>
              <p className="text-3xl font-bold text-green-600">Optimal</p>
            </div>
          </div>

          {/* Admin Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
                <p className="text-gray-600">Create and manage administrator accounts</p>
              </div>
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
              >
                Create New Admin
              </button>
            </div>

            {/* Admin Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Administrator</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Admin ID</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Created</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-gray-800">{admin.name}</p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {admin.adminId}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          admin.status === "Active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{admin.createdAt}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link href={`/super-admin/${admin.id}`}>
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm transition-colors">
                              Manage
                            </button>
                          </Link>
                          <button
                            onClick={() => toggleAdminStatus(admin.id)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              admin.status === "Active"
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            {admin.status === "Active" ? "Block" : "Unblock"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Create Admin Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter admin name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter secure password"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
