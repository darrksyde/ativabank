import { useState } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";

export default function CardPage() {
  const [fundAmount, setFundAmount] = useState("");
  const [selectedFundingMethod, setSelectedFundingMethod] = useState("balance");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{fundAmount?: string}>({});

  const cardBalance = 1250.75;
  const accountBalance = 10432.55;

  // Mock wallet addresses
  const btcAddress = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2";
  const usdtAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

  const validateForm = () => {
    const newErrors: {fundAmount?: string} = {};
    
    if (!fundAmount.trim()) {
      newErrors.fundAmount = "Amount is required";
    } else if (isNaN(Number(fundAmount)) || Number(fundAmount) <= 0) {
      newErrors.fundAmount = "Amount must be a positive number";
    } else if (selectedFundingMethod === "balance" && Number(fundAmount) > accountBalance) {
      newErrors.fundAmount = "Insufficient account balance";
    } else if (Number(fundAmount) > 5000) {
      newErrors.fundAmount = "Maximum funding amount is $5,000";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form on success
      setFundAmount("");
      setErrors({});
      
      alert(`Card funded successfully with $${fundAmount}!`);
    } catch {
      alert("Funding failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  return (
    <CustomerLayout title="Card Management">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Card Management
          </h1>
          <p className="text-gray-600">Fund your virtual card and manage your spending</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Virtual Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white/90">Ativabank Virtual Card</h3>
                    <p className="text-white/70 text-sm">Prepaid Card</p>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
                      <span className="text-xs font-bold">VISA</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <p className="text-white/70 text-sm mb-1">Card Number</p>
                  <p className="font-mono text-xl tracking-wider">4532 •••• •••• 8901</p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Balance</p>
                    <p className="text-2xl font-bold">${cardBalance.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm mb-1">Valid Thru</p>
                    <p className="font-mono">12/28</p>
                  </div>
                </div>
                
                {/* Card chip */}
                <div className="absolute top-20 left-8 w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg"></div>
              </div>
            </div>

            {/* Funding Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Fund Your Card</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Funding Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Funding Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="fundingMethod"
                        value="balance"
                        checked={selectedFundingMethod === "balance"}
                        onChange={(e) => setSelectedFundingMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 transition-all ${
                        selectedFundingMethod === "balance"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm">$</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Account Balance</p>
                            <p className="text-sm text-gray-500">${accountBalance.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="fundingMethod"
                        value="btc"
                        checked={selectedFundingMethod === "btc"}
                        onChange={(e) => setSelectedFundingMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 transition-all ${
                        selectedFundingMethod === "btc"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 text-sm">₿</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Bitcoin</p>
                            <p className="text-sm text-gray-500">BTC Wallet</p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="fundingMethod"
                        value="usdt"
                        checked={selectedFundingMethod === "usdt"}
                        onChange={(e) => setSelectedFundingMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 transition-all ${
                        selectedFundingMethod === "usdt"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm">₮</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Tether</p>
                            <p className="text-sm text-gray-500">USDT Wallet</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      max="5000"
                      className={`pl-8 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.fundAmount ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.fundAmount && (
                    <p className="mt-1 text-sm text-red-600">{errors.fundAmount}</p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Amounts
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setFundAmount(amount.toString())}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wallet Address Display */}
                {(selectedFundingMethod === "btc" || selectedFundingMethod === "usdt") && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">
                        {selectedFundingMethod === "btc" ? "Bitcoin" : "Tether"} Wallet Address
                      </h3>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedFundingMethod === "btc" ? btcAddress : usdtAddress)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="font-mono text-sm bg-white p-3 rounded border break-all">
                      {selectedFundingMethod === "btc" ? btcAddress : usdtAddress}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Send {selectedFundingMethod.toUpperCase()} to this address to fund your card.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || selectedFundingMethod !== "balance"}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : selectedFundingMethod === "balance" ? (
                    "Fund Card"
                  ) : (
                    "Fund via Crypto Transfer"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className="font-medium text-green-600">${cardBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Spending:</span>
                  <span className="font-medium">$847.32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Limit:</span>
                  <span className="font-medium">$1,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Today:</span>
                  <span className="font-medium text-blue-600">$1,000</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Card Activity</h3>
              <div className="space-y-3">
                {[
                  { merchant: "Amazon", amount: -89.99, date: "Today", category: "Online" },
                  { merchant: "Starbucks", amount: -5.47, date: "Yesterday", category: "Food" },
                  { merchant: "Gas Station", amount: -42.50, date: "Jan 20", category: "Fuel" },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{transaction.merchant}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">${Math.abs(transaction.amount).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Controls</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors">
                  Freeze Card
                </button>
                <button className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                  Set Spending Limit
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                  View PIN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}