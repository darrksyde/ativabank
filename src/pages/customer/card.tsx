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

export default function CardPage() {
  const [fundAmount, setFundAmount] = useState("");

  const handleFundFromBalance = () => {
    if (!fundAmount) {
      alert("Please enter an amount to fund.");
      return;
    }
    console.log(`Funding card with $${fundAmount} from account balance.`);
    alert(`Successfully funded card with $${fundAmount}!`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Card Funding" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Fund with Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Fund with Account Balance</CardTitle>
                <CardDescription>
                  Transfer money directly from your account to your card.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fundAmount">Amount</Label>
                  <Input
                    id="fundAmount"
                    type="number"
                    placeholder="100.00"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleFundFromBalance}>Fund Card</Button>
              </CardContent>
            </Card>

            {/* Crypto Funding Info */}
            <div className="space-y-6">
              {/* BTC Funding */}
              <Card>
                <CardHeader>
                  <CardTitle>Fund with BTC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Credit your BTC address to fund your card.
                  </p>
                  <p className="font-mono text-sm break-all bg-muted p-2 rounded-md">
                    bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                  </p>
                </CardContent>
              </Card>

              {/* USDT Funding */}
              <Card>
                <CardHeader>
                  <CardTitle>Fund with USDT</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Credit your USDT address to fund your card.
                  </p>
                  <p className="font-mono text-sm break-all bg-muted p-2 rounded-md">
                    0x1234567890abcdef1234567890abcdef12345678
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
