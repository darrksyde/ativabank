import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for transaction history
const transactions = [
  {
    id: "txn_1",
    date: "2024-07-28",
    description: "Netflix Subscription",
    amount: -15.99,
    status: "Completed",
  },
  {
    id: "txn_2",
    date: "2024-07-28",
    description: "Salary Deposit",
    amount: 2500.0,
    status: "Completed",
  },
  {
    id: "txn_3",
    date: "2024-07-27",
    description: "Starbucks Coffee",
    amount: -5.75,
    status: "Completed",
  },
  {
    id: "txn_4",
    date: "2024-07-26",
    description: "Gas Station",
    amount: -45.3,
    status: "Completed",
  },
  {
    id: "txn_5",
    date: "2024-07-25",
    description: "Online Shopping",
    amount: -150.0,
    status: "Pending",
  },
  {
    id: "txn_6",
    date: "2024-07-24",
    description: "Refund from Amazon",
    amount: 25.5,
    status: "Completed",
  },
];

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Transaction History" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Transactions</CardTitle>
              <CardDescription>
                A complete record of your account activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell className="font-medium">
                        {tx.description}
                      </TableCell>
                      <TableCell>{tx.status}</TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          tx.amount < 0
                            ? "text-destructive"
                            : "text-green-600"
                        }`}
                      >
                        {tx.amount < 0 ? "-" : "+"}$
                        {Math.abs(tx.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
