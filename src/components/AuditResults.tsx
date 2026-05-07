"use client";

import { useState, useEffect } from "react";
import { AuditResult } from "@/lib/auditEngine";
import { UserContext } from "@/lib/pricingData";

interface Props {
  result: AuditResult;
  context: UserContext;
  onReset: () => void;
}

export default function AuditResults({ result, context, onReset }: Props) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [shareId, setShareId] = useState("");
  const [summary, setSummary] = useState<string>("Generating personalized AI summary of your stack...");
  
  useEffect(() => {
    // Generate AI Summary on mount
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tools: context.tools,
            totalCurrentSpend: result.totalCurrentSpend,
            totalPotentialSavings: result.totalPotentialSavings,
          }),
        });
        const data = await res.json();
        if (data.summary) {
           setSummary(data.summary);
        }
      } catch (err) {
        console.error("Failed to fetch summary", err);
        setSummary("Your stack has been analyzed. See the breakdown below.");
      }
    };
    fetchSummary();
  }, [context, result]);

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          result: { ...result, summary }
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        setShareId(data.auditId);
        setCaptured(true);
      } else {
        alert("Something went wrong saving the audit. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center shadow-lg">
        <h2 className="text-2xl font-medium text-blue-100 mb-2">Total Potential Savings</h2>
        <div className="text-5xl font-bold mb-4">${result.totalPotentialSavings.toLocaleString()}<span className="text-xl font-normal text-blue-200">/mo</span></div>
        <div className="text-blue-100">
          That&apos;s <span className="font-semibold text-white">${(result.totalPotentialSavings * 12).toLocaleString()}</span> a year you could be reinvesting.
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Executive Summary</h3>
        <p className="text-gray-800 leading-relaxed italic border-l-4 border-blue-500 pl-4">
          &quot;{summary}&quot;
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Per-Tool Breakdown</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-lg text-gray-900">{rec.toolName}</div>
                {rec.savings > 0 ? (
                   <div className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full text-sm">
                     Save ${rec.savings}/mo
                   </div>
                ) : (
                   <div className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                     Optimized
                   </div>
                )}
              </div>
              <div className="text-gray-800 font-medium mb-1">
                Recommendation: {rec.recommendedAction}
              </div>
              <div className="text-gray-500 text-sm">
                {rec.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!captured ? (
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {result.isHighSavings ? "Want to realize these savings instantly?" : "Get your full personalized report"}
          </h3>
          <p className="text-gray-600 mb-6">
            {result.isHighSavings 
              ? "Book a free consultation with Credex to get discounted credits for your stack." 
              : "Enter your email to get a PDF copy of this audit and a shareable URL."}
          </p>
          <form onSubmit={handleCapture} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@startup.com"
              className="flex-1 rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? "Sending..." : "Send Report"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 rounded-xl p-8 border border-green-200 text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Report Sent!</h3>
          <p className="text-green-600 mb-4">Check your inbox for the full details and shareable link.</p>
          <div className="inline-block bg-white p-3 rounded border border-green-200 text-sm text-gray-500 select-all">
            Share URL: {window.location.origin}/audit/{shareId}
          </div>
        </div>
      )}

      <div className="text-center">
        <button onClick={onReset} className="text-gray-500 hover:text-gray-700 underline text-sm">
          ← Start over
        </button>
      </div>
    </div>
  );
}
