"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Metric from "@/components/Metric";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold leading-tight"
      >
        Invest in proven{" "}
        <span className="text-blue-600">trading algorithms</span>
      </motion.h1>
      <p className="mt-4 text-gray-600 max-w-xl">
        Discover, compare, and allocate capital across vetted strategies with
        transparent risk and performance metrics.
      </p>
      <div className="mt-6 flex gap-3 flex-wrap">
        <Link href="/strategies">
          <Button size="lg">Explore strategies</Button>
        </Link>
        <Link href="/connect">
          <Button size="lg" variant="secondary">
            Connect exchange
          </Button>
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Metric label="Active strategies" value="32" />
        <Metric label="Avg. Sharpe" value="1.45" />
        <Metric label="Investors" value="2,184" />
      </div>
    </div>
  );
}
