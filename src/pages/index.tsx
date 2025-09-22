import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "admin" | "super-admin">("customer");

  const handleLogin = () => {
    // Simple mock authentication - store user data and redirect
    const userData = {
      email,
      userType,
      loginTime: new Date().toISOString(),
    };
    
    // Store in localStorage for session management
    localStorage.setItem('ativabank_user', JSON.stringify(userData));
    
    // Redirect based on user type
    router.push(`/${userType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Ativabank</h1>
          <p className="text-blue-200">Secure. Reliable. Modern Banking.</p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-blue-200">Sign in to access your account</p>
          </div>
          
          <div className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium block">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "customer", label: "Customer" },
                  { value: "admin", label: "Admin" },
                  { value: "super-admin", label: "Super Admin" }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setUserType(type.value as any)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      userType === type.value
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-white/10 text-blue-200 hover:bg-white/20"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-lg focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-lg focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Login Button */}
            <button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </button>

            {/* Additional Links */}
            <div className="text-center space-y-2">
              <button className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
                Forgot your password?
              </button>
              <div className="text-blue-300 text-sm">
                Don&apos;t have an account?{" "}
                <button className="text-white hover:underline font-medium">
                  Contact your administrator
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-black/20 rounded-lg backdrop-blur-sm">
          <h3 className="text-white font-medium mb-2">Demo Credentials</h3>
          <div className="text-sm text-blue-200 space-y-1">
            <p><strong>Email:</strong> demo@ativabank.com</p>
            <p><strong>Password:</strong> demo123</p>
            <p className="text-xs text-blue-300 mt-2">Select your role above and click Sign In</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200 text-sm">
          <p>&copy; 2024 Ativabank. All rights reserved.</p>
          <p className="mt-2">Demo Mode - No real transactions will be processed</p>
        </div>
      </div>
    </div>
  );
}