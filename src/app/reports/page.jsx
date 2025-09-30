import { Card, CardContent } from "@/components/ui/card";

const rows = [
  { id: 1, type: "Deposit", amount: 5000, date: "2025-08-01" },
  { id: 2, type: "Allocation", amount: -2000, date: "2025-08-05" },
  { id: 3, type: "Payout", amount: 180, date: "2025-08-18" },
];

export default function Page() {
  return (
    <div className="container py-10">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-semibold mb-6">
            Transactions & Reports
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-3">Date</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Amount (USD)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-3">{r.date}</td>
                    <td className="py-3">{r.type}</td>
                    <td className="py-3">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
