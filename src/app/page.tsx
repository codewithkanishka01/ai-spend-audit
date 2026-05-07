"use client";

import { useState } from "react";
import SpendInputForm from "@/components/SpendInputForm";
import AuditResults from "@/components/AuditResults";
import { UserContext } from "@/lib/pricingData";
import { runAudit, AuditResult } from "@/lib/auditEngine";

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const handleAudit = (context: UserContext) => {
    const result = runAudit(context);
    setAuditResult(result);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAudit = () => {
    setAuditResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Stop Overpaying for AI Tools
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Get an instant audit of your startup&apos;s AI spend. Discover cheaper plans, better alternatives, and hidden savings in 30 seconds.
          </p>
        </div>

        {!auditResult ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <SpendInputForm onAudit={handleAudit} />
          </div>
        ) : (
          <AuditResults result={auditResult} onReset={resetAudit} />
        )}

      </div>
      <div className="mt-20 text-center text-sm text-slate-400">
        <p>Built for startups. Powered by Credex.</p>
      </div>
    </main>
  );
}
