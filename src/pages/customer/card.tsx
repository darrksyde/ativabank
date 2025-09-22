import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";

export default function CardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [selectedFundingMethod, setSelectedFundingMethod] = useState("balance");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const cardBalance = 1250.75;
  const accountBalance = 10432.55;

  // Mock wallet addresses
  const btcAddress = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2";
  const usdtAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('ativabank_user');
    if (!userData) {
      router.push('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== 'customer') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ativabank_user');
    router.push('/');
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!fundAmount.trim()) {
      newErrors.fundAmount = "Amount is required";
    } else if (isNaN(Number(fundAmount)) || Number(fundAmount) <= 0) {
      newErrors.fundAmount = "Amount must be a positive number";
    } else if (selectedFundingMethod === "balance" && Number(fundAmount) > accountBalance) {
      newErrors.fundAmount = "Insufficient account balance";
    } else if (Number(fundAmount) > 5000) {
      newErrors.fundAmount = "Daily funding limit is $5,000";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFundCard = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (selectedFundingMethod === "balance") {
        alert(`Successfully funded card with $${fundAmount} from account balance`);
      } else {
        alert(`Funding instructions sent. Please transfer ${selectedFundingMethod.toUpperCase()} to the provided address.`);
      }
      
      setFundAmount("");
      setErrors({});
    } catch (error) {
      alert("Funding failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    alert(`${type} address copied to clipboard!`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <Header title="Card Funding" onLogout={handleLogout} />
      <Navigation userType="customer" />
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Card Funding
            </h1>
            <p className="text-gray-600">Add money to your Ativabank card using various methods</p>
          </div>

          {/* Card Balance Display */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">Current Card Balance</h3>
                <p className="text-4xl font-bold">${cardBalance.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl">💳</div>
                <p className="text-sm opacity-90">**** **** **** 4521</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Funding Methods */}
            <div className="space-y-6">
              {/* Fund with Balance */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Fund with Account Balance</h2>
                <p className="text-gray-600 mb-6">Transfer money directly from your account to your card</p>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-2xl font-bold text-blue-600">${accountBalance.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Fund *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                          errors.fundAmount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        max="5000"
                      />
                    </div>
                    {errors.fundAmount && (
                      <p className="mt-1 text-sm text-red-600">{errors.fundAmount}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">Daily funding limit: $5,000</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFundingMethod("balance");
                      handleFundCard();
                    }}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading && selectedFundingMethod === "balance" ? "Processing..." : "Fund Card"}
                  </button>
                </div>
              </div>
            </div>

            {/* Crypto Funding */}
            <div className="space-y-6">
              {/* Bitcoin Funding */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">₿</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Bitcoin (BTC)</h3>
                    <p className="text-gray-600">Fund your card with Bitcoin</p>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">BTC Wallet Address:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white p-2 rounded border text-xs font-mono break-all">
                      {btcAddress}
                    </code>
                    <button
                      onClick={() => copyToClipboard(btcAddress, "BTC")}
                      className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                  Send Bitcoin to this address and your card will be funded within 30 minutes after 3 confirmations.
                </p>
              </div>

              {/* USDT Funding */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">₮</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Tether (USDT)</h3>
                    <p className="text-gray-600">Fund your card with USDT</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">USDT Wallet Address (TRC20):</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white p-2 rounded border text-xs font-mono break-all">
                      {usdtAddress}
                    </code>
                    <button
                      onClick={() => copyToClipboard(usdtAddress, "USDT")}
                      className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                  Send USDT (TRC20) to this address and your card will be funded within 10 minutes after confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Funding History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Funding History</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">Account Balance Transfer</p>
                  <p className="text-sm text-gray-500">Jan 15, 2024 • 14:30</p>
                </div>
                <span className="text-lg font-semibold text-green-600">+$500.00</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">Bitcoin Deposit</p>
                  <p className="text-sm text-gray-500">Jan 12, 2024 • 09:15</p>
                </div>
                <span className="text-lg font-semibold text-green-600">+$750.75</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">USDT Deposit</p>
                  <p className="text-sm text-gray-500">Jan 10, 2024 • 16:45</p>
                </div>
                <span className="text-lg font-semibold text-green-600">+$1,000.00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}