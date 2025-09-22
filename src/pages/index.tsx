import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-white text-2xl font-bold">A</span>
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
          
          <div className="space-y-4">
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-lg focus:bg-white/20 focus:border-blue-400 focus:outline-none"
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-lg focus:bg-white/20 focus:border-blue-400 focus:outline-none"
              />
            </div>

            {/* Login Button */}
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
              Sign In
            </button>
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