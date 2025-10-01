"use client";

import { portfolio } from "./mock";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Page() {
  const total = portfolio.reduce((sum, p) => sum + p.value, 0);
  const pie = portfolio.map((p) => ({
    name: p.name,
    value: Math.round((p.value / total) * 100),
  }));
  return (
    <div className="container py-10 grid lg:grid-cols-2 gap-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Allocation by Strategy</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolio}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Diversification</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {pie.map((entry, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
