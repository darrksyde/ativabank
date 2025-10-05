import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthContext } from "@/contexts/AuthContext";
import { Customer } from "@/lib/types";
import Link from "next/link";

function CustomerDashboardContent() {
  const { currentUser, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <CustomerLayout title="Dashboard">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (!currentUser || currentUser.role !== 'customer') {
    return (
      <CustomerLayout title="Dashboard">
        <div className="text-center py-8">
          <p className="text-red-600">Access denied. Please login as a customer.</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Dashboard">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Welcome back, {currentUser.name}
        </h1>
        <p className="text-gray-600">Account: {currentUser.email}</p>
      </div>

      {/* Account Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Account Balance</h2>
        <p className="text-3xl font-bold">$5,000.00</p>
        <p className="text-blue-100 text-sm">Available funds</p>
      </div>

      {/* Wallets Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              ₿
            </span>
            Bitcoin Wallet
          </h3>
          <p className="text-sm text-gray-600 mb-2">Wallet Address:</p>
          <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">
            bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              ₮
            </span>
            USDT Wallet
          </h3>
          <p className="text-sm text-gray-600 mb-2">Wallet Address:</p>
          <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">
            0x742a4c2d2ef1d8e8b6c7a1b8d9f0e3a4b5c6d7e8
          </p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-gray-800 text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/customer/transfers" className="bg-blue-600 text-white rounded-lg p-4 text-center">
            Transfer
          </Link>
          <Link href="/customer/card" className="bg-purple-600 text-white rounded-lg p-4 text-center">
            Fund Card
          </Link>
          <Link href="/customer/history" className="bg-green-600 text-white rounded-lg p-4 text-center">
            History
          </Link>
          <Link href="/customer/settings" className="bg-orange-600 text-white rounded-lg p-4 text-center">
            Settings
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  );
}
