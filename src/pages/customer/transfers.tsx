import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { ValidatedInput } from "@/components/ui/validated-input";
import { 
  validateAccountNumber, 
  validateAmount, 
  validateDescription, 
  isFormValid
} from "@/lib/validation";
import databaseManager from "@/lib/database-enhanced";
import { useAuthContext } from "@/contexts/AuthContext";
import { Customer, TransferRequest, Transaction } from "@/lib/types-enhanced";
import { formatCurrency } from "@/lib/validation-enhanced";

export default function TransfersPage() {
  const { currentUser } = useAuthContext();
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [transferResult, setTransferResult] = useState<{ success: boolean; message: string; transactions?: Transaction[] } | null>(null);

  // Load current customer data
  useEffect(() => {
    if (currentUser?.email) {
      const customer = databaseManager.getCustomerByEmail(currentUser.email);
      if (customer.success && customer.data) {
        setCurrentCustomer(customer.data);
      }
    }
  }, [currentUser]);

  const validateTransferForm = () => {
    const results = {
      accountNumber: validateAccountNumber(accountNumber),
      amount: validateAmount(amount, 0.01, 10000),
      description: validateDescription(description, 100)
    };
    
    return isFormValid(results);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTransferForm() || !currentCustomer) {
      return;
    }

    if (!currentCustomer.account.permissions.canTransfer) {
      setTransferResult({
        success: false,
        message: "Transfers are disabled for your account. Please contact support."
      });
      return;
    }

    setIsLoading(true);
    setTransferResult(null);
    
    try {
      const transferRequest: TransferRequest = {
        fromAccountNumber: currentCustomer.account.accountNumber,
        toAccountNumber: accountNumber,
        amount: parseFloat(amount),
        description: description || "Transfer"
      };

      const result = await databaseManager.processTransfer(transferRequest, currentCustomer.id);
      
      if (result.success) {
        setTransferResult({
          success: true,
          message: "Transfer completed successfully!",
          transactions: result.data
        });
        
        // Reset form on success
        setAccountNumber("");
        setAmount("");
        setDescription("");
        
        // Refresh customer data to show updated balance
        const updatedCustomer = databaseManager.getCustomerByEmail(currentCustomer.email);
        if (updatedCustomer.success && updatedCustomer.data) {
          setCurrentCustomer(updatedCustomer.data);
        }
      } else {
        setTransferResult({
          success: false,
          message: result.error || "Transfer failed"
        });
      }
    } catch (error) {
      setTransferResult({
        success: false,
        message: "Transfer failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recentRecipients = [
    { id: 1, name: "Alice Johnson", accountNumber: "1234567890", lastTransfer: "2024-01-10" },
    { id: 2, name: "Bob Smith", accountNumber: "2345678901", lastTransfer: "2024-01-08" },
    { id: 3, name: "Carol Brown", accountNumber: "3456789012", lastTransfer: "2024-01-05" },
  ];

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <CustomerLayout title="Transfers">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Send Money
          </h1>
          <p className="text-gray-600">Transfer funds to another account quickly and securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">New Transfer</h2>
              
              {/* Transfer Result */}
              {transferResult && (
                <div className={`p-4 rounded-lg border ${
                  transferResult.success 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {transferResult.success ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <p className="font-medium">{transferResult.message}</p>
                  </div>
                  
                  {transferResult.success && transferResult.transactions && (
                    <div className="mt-3 text-sm">
                      <p>Transfer ID: {transferResult.transactions[0]?.id}</p>
                      <p>Amount: {formatCurrency(transferResult.transactions[0]?.amount || 0)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Current Balance Display */}
              {currentCustomer && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Current Balance</h3>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(currentCustomer.account.balance)}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <ValidatedInput
                  label="Recipient Account Number"
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={setAccountNumber}
                  validator={validateAccountNumber}
                  required
                />

                <ValidatedInput
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={setAmount}
                  validator={(val) => validateAmount(val, 0.01, 10000)}
                  required
                />

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Amounts
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount.toString())}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                      >
                        ${quickAmount}
                      </button>
                    ))}
                  </div>
                </div>

                <ValidatedInput
                  label="Description"
                  type="text"
                  placeholder="What&apos;s this for? (optional)"
                  value={description}
                  onChange={setDescription}
                  validator={(val) => validateDescription(val, 100)}
                />

                {/* Transfer Summary */}
                {amount && accountNumber && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Transfer Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Amount:</span>
                        <span className="font-medium text-blue-800">${amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Fee:</span>
                        <span className="font-medium text-blue-800">$0.00</span>
                      </div>
                      <div className="flex justify-between border-t border-blue-200 pt-2">
                        <span className="text-blue-600 font-medium">Total:</span>
                        <span className="font-bold text-blue-800">${amount}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !currentCustomer?.account.permissions.canTransfer}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    currentCustomer?.account.permissions.canTransfer 
                      ? "Send Transfer" 
                      : "Transfers Disabled"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Recipients */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Recipients</h3>
              <div className="space-y-3">
                {recentRecipients.map((recipient) => (
                  <div 
                    key={recipient.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setAccountNumber(recipient.accountNumber)}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{recipient.name}</p>
                      <p className="text-sm text-gray-500">{recipient.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{recipient.lastTransfer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfer Limits */}
            {currentCustomer && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transfer Limits</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Limit:</span>
                    <span className="font-medium">
                      {formatCurrency(currentCustomer.account.limits.dailyTransferLimit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Limit:</span>
                    <span className="font-medium">
                      {formatCurrency(currentCustomer.account.limits.monthlyTransferLimit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      currentCustomer.account.permissions.canTransfer 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {currentCustomer.account.permissions.canTransfer ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                
                {!currentCustomer.account.permissions.canTransfer && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      Transfers are currently disabled for your account. Please contact support.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Security Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800 text-sm">Security Tip</p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Always verify the recipient&apos;s account number before sending money. Transfers cannot be reversed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}