"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="container pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
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
      </div>
    </section>
  );
}
