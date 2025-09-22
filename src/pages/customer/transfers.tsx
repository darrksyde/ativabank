import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TransfersPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleTransfer = () => {
    // Form validation
    if (!accountNumber || !amount) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Transfer initiated:", {
      accountNumber,
      amount,
      description,
    });
    // In a real app, you'd call an API here
    alert("Transfer successful!");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Transfers" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Make a Transfer</CardTitle>
              <CardDescription>
                Send funds to another Ativabank account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Recipient Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="e.g., For dinner"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleTransfer}>
                Send Money
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
