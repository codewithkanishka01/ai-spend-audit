import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Cache for 60 seconds

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
        <h1 className="text-2xl font-bold">Database not configured.</h1>
        <p>This is a demo. Shareable URLs require a connected database.</p>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('audits')
    .select('result_data, created_at')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const result = data.result_data;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">AI Spend Audit Result</h1>
          <p className="text-slate-500 mt-2">Generated on {new Date(data.created_at).toLocaleDateString()}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center shadow-lg">
          <h2 className="text-2xl font-medium text-blue-100 mb-2">Total Potential Savings</h2>
          <div className="text-5xl font-bold mb-4">${result.totalPotentialSavings?.toLocaleString() || 0}<span className="text-xl font-normal text-blue-200">/mo</span></div>
        </div>

        {result.summary && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Executive Summary</h3>
             <p className="text-gray-800 leading-relaxed italic border-l-4 border-blue-500 pl-4">
               "{result.summary}"
             </p>
           </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">Per-Tool Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {result.recommendations?.map((rec: any, i: number) => (
              <div key={i} className="p-6">
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
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a href="/" className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-md shadow-sm border border-gray-200 hover:bg-gray-50">
            Run Your Own Audit
          </a>
        </div>
      </div>
    </main>
  );
}
