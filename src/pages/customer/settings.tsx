import { useState } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ValidatedInput } from "@/components/ui/validated-input";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "New York",
    zipCode: "10001",
    country: "United States"
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginNotifications: true,
    transactionAlerts: true
  });

  const [preferences, setPreferences] = useState({
    language: "English",
    currency: "USD",
    timezone: "America/New_York",
    theme: "light",
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (security.newPassword !== security.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSecurity({
        ...security,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      alert("Password changed successfully!");
    } catch {
      alert("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Preferences updated successfully!");
    } catch {
      alert("Failed to update preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomerLayout title="Settings">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ValidatedInput
                      label="First Name"
                      value={profile.firstName}
                      onChange={(value) => setProfile({...profile, firstName: value})}
                      required
                    />
                    <ValidatedInput
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(value) => setProfile({...profile, lastName: value})}
                      required
                    />
                  </div>
                  
                  <ValidatedInput
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(value) => setProfile({...profile, email: value})}
                    required
                  />
                  
                  <ValidatedInput
                    label="Phone Number"
                    type="tel"
                    value={profile.phone}
                    onChange={(value) => setProfile({...profile, phone: value})}
                    required
                  />
                  
                  <ValidatedInput
                    label="Address"
                    value={profile.address}
                    onChange={(value) => setProfile({...profile, address: value})}
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ValidatedInput
                      label="City"
                      value={profile.city}
                      onChange={(value) => setProfile({...profile, city: value})}
                      required
                    />
                    <ValidatedInput
                      label="ZIP Code"
                      value={profile.zipCode}
                      onChange={(value) => setProfile({...profile, zipCode: value})}
                      required
                    />
                    <ValidatedInput
                      label="Country"
                      value={profile.country}
                      onChange={(value) => setProfile({...profile, country: value})}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </button>
                </form>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Change your password and manage security preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <ValidatedInput
                    label="Current Password"
                    type="password"
                    value={security.currentPassword}
                    onChange={(value) => setSecurity({...security, currentPassword: value})}
                    required
                  />
                  
                  <ValidatedInput
                    label="New Password"
                    type="password"
                    value={security.newPassword}
                    onChange={(value) => setSecurity({...security, newPassword: value})}
                    required
                  />
                  
                  <ValidatedInput
                    label="Confirm New Password"
                    type="password"
                    value={security.confirmPassword}
                    onChange={(value) => setSecurity({...security, confirmPassword: value})}
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? "Changing..." : "Change Password"}
                  </button>
                </form>

                {/* Two-Factor Authentication */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      <p className="text-sm text-gray-500">Status: {security.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
                    </div>
                    <button
                      onClick={() => setSecurity({...security, twoFactorEnabled: !security.twoFactorEnabled})}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        security.twoFactorEnabled
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {security.twoFactorEnabled ? "Disable" : "Enable"} 2FA
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your account preferences and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Language & Region */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Language & Region</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={preferences.currency}
                          onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={preferences.timezone}
                          onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={security.loginNotifications}
                          onChange={(e) => setSecurity({...security, loginNotifications: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Login notifications</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={security.transactionAlerts}
                          onChange={(e) => setSecurity({...security, transactionAlerts: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Transaction alerts</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Email notifications</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferences.smsNotifications}
                          onChange={(e) => setPreferences({...preferences, smsNotifications: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">SMS notifications</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preferences.marketingEmails}
                          onChange={(e) => setPreferences({...preferences, marketingEmails: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Marketing emails</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handlePreferencesUpdate}
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? "Updating..." : "Save Preferences"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">JD</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{profile.firstName} {profile.lastName}</p>
                      <p className="text-sm text-gray-500">Personal Account</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Type:</span>
                      <span className="text-sm font-medium">Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Member Since:</span>
                      <span className="text-sm font-medium">Jan 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-left">
                    Download Account Statement
                  </button>
                  <button className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-left">
                    Request Account Closure
                  </button>
                  <button className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-left">
                    Contact Support
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Password Strength:</span>
                    <span className="text-sm font-medium text-green-600">Strong</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Two-Factor Auth:</span>
                    <span className={`text-sm font-medium ${security.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                      {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Login:</span>
                    <span className="text-sm font-medium">Today, 2:30 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}