import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { ValidatedInput } from "@/components/ui/validated-input";
import { 
  validateAccountNumber, 
  validateAmount, 
  validateDescription, 
  isFormValid,
  ValidationResult 
} from "@/lib/validation";

export default function TransfersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("ativabank_user");
    if (!userData) {
      router.push("/");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== "customer") {
      router.push("/");
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("ativabank_user");
    router.push("/");
  };

  const validateTransferForm = () => {
    const results = {
      accountNumber: validateAccountNumber(accountNumber),
      amount: validateAmount(amount, 0.01, 10000),
      description: validateDescription(description, 100)
    };
    
    setValidationResults(results);
    return isFormValid(results);
  };

  const handleTransfer = async () => {
    if (!validateTransferForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully transferred $${amount} to account ${accountNumber}`);
      setAccountNumber("");
      setAmount("");
      setDescription("");
      setValidationResults({});
      
    } catch (error) {
      alert("Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header title="Money Transfers" onLogout={handleLogout} />
      <Navigation userType="customer" />

      <main className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Send Money</h1>
              <p className="text-gray-600">Transfer funds to another Ativabank account securely</p>
            </div>

            <div className="space-y-6">
              {/* Account Number Input */}
              <ValidatedInput
                label="Recipient Account Number"
                type="text"
                value={accountNumber}
                onChange={setAccountNumber}
                validator={validateAccountNumber}
                placeholder="ACC001"
                required
                icon="🏦"
                description="Enter the recipient's account number (format: ACC###)"
              />

              {/* Amount Input */}
              <ValidatedInput
                label="Transfer Amount"
                type="number"
                value={amount}
                onChange={setAmount}
                validator={(val) => validateAmount(val, 0.01, 10000)}
                placeholder="0.00"
                required
                icon="💰"
                description="Minimum: $0.01, Maximum: $10,000"
              />

              {/* Description Input */}
              <ValidatedInput
                label="Description"
                type="text"
                value={description}
                onChange={setDescription}
                validator={(val) => validateDescription(val, 100)}
                placeholder="What is this transfer for? (optional)"
                icon="📝"
                description="Optional description for your records (max 100 characters)"
              />

              {/* Transfer Summary */}
              {accountNumber && amount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Transfer Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">To Account:</span>
                      <span className="font-medium">{accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${amount || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <hr className="border-blue-200" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-blue-800">${amount || "0.00"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleTransfer}
                  disabled={isLoading || !accountNumber || !amount}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isLoading || !accountNumber || !amount
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Send Transfer"
                  )}
                </button>

                <button
                  onClick={() => {
                    setAccountNumber("");
                    setAmount("");
                    setDescription("");
                    setValidationResults({});
                  }}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transfers</h2>
            <div className="space-y-3">
              {[
                { id: 1, account: "ACC002", amount: 250.00, date: "2024-01-20", description: "Rent payment" },
                { id: 2, account: "ACC003", amount: 75.50, date: "2024-01-19", description: "Dinner split" },
                { id: 3, account: "ACC004", amount: 500.00, date: "2024-01-18", description: "Loan repayment" },
              ].map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-800">To {transfer.account}</p>
                    <p className="text-sm text-gray-600">{transfer.description}</p>
                    <p className="text-xs text-gray-500">{transfer.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-${transfer.amount.toFixed(2)}</p>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
