"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function Live() {
  const [logs, setLogs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    refreshJobs();
    const es = new EventSource("/api/logs");
    es.onmessage = (e) =>
      setLogs((prev) => [...prev.slice(-199), JSON.parse(e.data)]);
    return () => es.close();
  }, []);

  const refreshJobs = async () => {
    try {
      const res = await apiFetch("/strategies/jobs");
      setJobs(res.jobs);
    } catch {
      setJobs([]);
    }
  };

  const stop = async (id) => {
    await apiFetch("/strategies/stop", { body: { jobId: id } });
    await refreshJobs();
  };

  return (
    <div className="container py-10 grid lg:grid-cols-2 gap-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Active jobs</h2>
          <div className="space-y-3">
            {jobs.length === 0 && (
              <p className="text-gray-500">No active strategies.</p>
            )}
            {jobs.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-3"
              >
                <div>
                  <div className="font-medium">
                    {j.strategyId} on {j.exchange} {j.symbol}
                  </div>
                  <div className="text-xs text-gray-500">
                    {j.timeframe}, size ${j.amountUSDT}
                  </div>
                </div>
                <Button variant="destructive" onClick={() => stop(j.id)}>
                  Stop
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Logs</h2>
          <div className="h-96 overflow-auto bg-gray-50 rounded-xl p-3 text-xs">
            {logs.map((l, i) => (
              <div key={i}>
                <span className="text-gray-400">
                  {new Date(l.ts).toLocaleTimeString()}:
                </span>{" "}
                {l.msg}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
