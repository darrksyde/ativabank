import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import databaseManager from "@/lib/database-enhanced";
import { Customer, Transaction } from "@/lib/types-enhanced";
import { CustomerLayout } from "@/components/layout/CustomerLayout";

export default function CardPage() {
  const { currentUser } = useAuthContext();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cardTransactions, setCardTransactions] = useState<Transaction[]>([]);
  const [fundAmount, setFundAmount] = useState("");
  const [selectedFundingMethod, setSelectedFundingMethod] = useState("balance");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{fundAmount?: string}>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!currentUser?.email) return;
    
    const customers = databaseManager.getCustomers();
    const foundCustomer = customers.find(c => c.email === currentUser.email);
    if (foundCustomer) {
      setCustomer(foundCustomer);
      
      // Load card-related transactions
      const transactions = databaseManager.getTransactions({ customerId: foundCustomer.id });
      const cardTxns = transactions.filter(t => t.category === 'card-funding');
      setCardTransactions(cardTxns);
    }
  }, [currentUser]);

  const validateForm = () => {
    const newErrors: {fundAmount?: string} = {};
    
    if (!fundAmount.trim()) {
      newErrors.fundAmount = "Amount is required";
    } else if (isNaN(Number(fundAmount)) || Number(fundAmount) <= 0) {
      newErrors.fundAmount = "Amount must be a positive number";
    } else if (selectedFundingMethod === "balance" && customer && Number(fundAmount) > customer.account.balance) {
      newErrors.fundAmount = "Insufficient account balance";
    } else if (customer && Number(fundAmount) > (customer.card.dailyLimit || 5000)) {
      newErrors.fundAmount = `Maximum daily funding amount is $${customer.card.dailyLimit || 5000}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !customer || !currentUser?.email) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    setErrors({});
    
    try {
      const amount = parseFloat(fundAmount);
      
      if (selectedFundingMethod === "balance") {
        // Check permissions
        if (!customer.account.permissions.canFundFromWallet) {
          setErrors({ fundAmount: "Card funding is disabled for your account" });
          return;
        }
        
        // Deduct from account balance and add to card balance
        const newAccountBalance = customer.account.balance - amount;
        const newCardBalance = customer.card.balance + amount;
        
        // Update customer account and card
        const updatedAccount = { ...customer.account, balance: newAccountBalance };
        const updatedCard = { ...customer.card, balance: newCardBalance };
        
        const updateResponse = databaseManager.updateCustomer(customer.id, {
          account: updatedAccount,
          card: updatedCard
        });
        
        if (updateResponse.success && updateResponse.data) {
          setCustomer(updateResponse.data);
          
          // Create transaction records
          // 1. Debit from account
          await databaseManager.createTransaction({
            customerId: customer.id,
            type: 'debit',
            amount,
            description: `Card funding from account balance`,
            category: 'card-funding'
          });
          
          // 2. Credit to card (separate transaction for tracking)
          const cardTxnResponse = await databaseManager.createTransaction({
            customerId: customer.id,
            type: 'credit',
            amount,
            description: `Card balance top-up`,
            category: 'card-funding'
          });
          
          if (cardTxnResponse.success) {
            // Refresh card transactions
            const transactions = databaseManager.getTransactions({ customerId: customer.id });
            const cardTxns = transactions.filter(t => t.category === 'card-funding');
            setCardTransactions(cardTxns);
          }
          
          setSuccessMessage(`Card funded successfully with $${amount.toFixed(2)}!`);
          setFundAmount("");
        } else {
          setErrors({ fundAmount: "Failed to process card funding. Please try again." });
        }
      } else {
        // For crypto funding, show instructions (simulated)
        setSuccessMessage(`Please send ${fundAmount} USD worth of ${selectedFundingMethod.toUpperCase()} to your wallet address. Your card will be funded once the transaction is confirmed.`);
        setFundAmount("");
      }
    } catch (error) {
      setErrors({ fundAmount: "Funding failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage("Address copied to clipboard!");
  };

  const quickAmounts = customer ? [25, 50, 100, 250, 500, Math.min(1000, customer.card.dailyLimit)] : [25, 50, 100, 250, 500, 1000];

  // Calculate card usage statistics
  const monthlySpending = cardTransactions
    .filter(t => t.type === 'debit' && new Date(t.timestamp).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  
  const todayTransactions = cardTransactions
    .filter(t => t.type === 'debit' && new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);
    
  const availableToday = (customer?.card.dailyLimit || 0) - todayTransactions;

  if (!customer) {
    return (
      <CustomerLayout title="Card Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your card information...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

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
                    <p className="text-2xl font-bold">${customer?.card.balance.toLocaleString() || '0.00'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm mb-1">Valid Thru</p>
                    <p className="font-mono">{customer?.card.expiryDate || '12/28'}</p>
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
                            <p className="text-sm text-gray-500">${customer?.account.balance.toLocaleString() || '0.00'}</p>
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

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="text-green-400">✓</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{successMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

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
                      onChange={(e) => {
                        setFundAmount(e.target.value);
                        setSuccessMessage("");
                        setErrors({});
                      }}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      max={customer?.card.dailyLimit || 5000}
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
                        onClick={() => copyToClipboard(selectedFundingMethod === "btc" ? customer?.wallets.btc || '' : customer?.wallets.usdt || '')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="font-mono text-sm bg-white p-3 rounded border break-all">
                      {selectedFundingMethod === "btc" ? customer?.wallets.btc : customer?.wallets.usdt}
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
                  <span className="font-medium text-green-600">${customer?.card.balance.toLocaleString() || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Spending:</span>
                  <span className="font-medium">${monthlySpending.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Limit:</span>
                  <span className="font-medium">${customer?.card.dailyLimit.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Today:</span>
                  <span className="font-medium text-blue-600">${availableToday.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Status:</span>
                  <span className={`font-medium ${customer?.card.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {customer?.card.status === 'active' ? 'Active' : customer?.card.status === 'blocked' ? 'Blocked' : 'Expired'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Card Activity</h3>
              <div className="space-y-3">
                {cardTransactions.slice(0, 3).length > 0 ? cardTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                        {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{transaction.category}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>No recent card activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Controls</h3>
              <div className="space-y-3">
                <button 
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    customer?.card.status === 'active' 
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                  onClick={() => setSuccessMessage("Card control feature coming soon!")}
                >
                  {customer?.card.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
                </button>
                <button 
                  className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                  onClick={() => setSuccessMessage("Spending limit management coming soon!")}
                >
                  Manage Limits
                </button>
                <button 
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setSuccessMessage(`Card CVV: ${customer?.card.cvv || '123'}`)}
                >
                  View CVV
                </button>
              </div>
            </div>

            {/* Funding History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Funding History</h3>
              <div className="space-y-3">
                {cardTransactions.filter(t => t.type === 'credit').slice(0, 5).length > 0 ? (
                  cardTransactions.filter(t => t.type === 'credit').slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                      </div>
                      <p className="font-medium text-green-600">+${transaction.amount.toFixed(2)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p className="text-sm">No funding history yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}