"use client";

import { useState, useEffect } from "react";
import { TOOLS_DATA, ToolName, PlanTier, UseCase, UserToolInput, UserContext } from "@/lib/pricingData";

interface Props {
  onAudit: (context: UserContext) => void;
}

export default function SpendInputForm({ onAudit }: Props) {
  const [teamSize, setTeamSize] = useState<number>(1);
  const [tools, setTools] = useState<UserToolInput[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai-spend-audit-form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize) {
          setTimeout(() => setTeamSize(parsed.teamSize), 0);
        }
        if (parsed.tools) {
          setTimeout(() => setTools(parsed.tools), 0);
        }
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("ai-spend-audit-form", JSON.stringify({ teamSize, tools }));
  }, [teamSize, tools]);

  const addTool = () => {
    setTools([
      ...tools,
      {
        id: crypto.randomUUID(),
        toolName: "ChatGPT",
        plan: "Plus",
        seats: 1,
        monthlySpend: 20,
        useCase: "mixed",
      },
    ]);
  };

  const removeTool = (id: string) => {
    setTools(tools.filter((t) => t.id !== id));
  };

  const updateTool = (id: string, updates: Partial<UserToolInput>) => {
    setTools(
      tools.map((t) => {
        if (t.id === id) {
          const updatedTool = { ...t, ...updates };
          // If tool name changed, auto-select the first available plan
          if (updates.toolName && updates.toolName !== t.toolName) {
             const availablePlans = TOOLS_DATA[updates.toolName as ToolName];
             updatedTool.plan = availablePlans[0].name;
             updatedTool.monthlySpend = availablePlans[0].pricePerUser * updatedTool.seats;
          }
          // If seats or plan changed, try to auto-calculate spend for non-API tools
          if ((updates.seats || updates.plan || updates.toolName) && updatedTool.plan !== 'API') {
             const planData = TOOLS_DATA[updatedTool.toolName].find(p => p.name === updatedTool.plan);
             if (planData) {
               updatedTool.monthlySpend = planData.pricePerUser * updatedTool.seats;
             }
          }
          return updatedTool;
        }
        return t;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAudit({ teamSize, tools });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Company Team Size</label>
        <input
          type="number"
          min="1"
          value={teamSize}
          onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Your AI Tools</h3>
          <button
            type="button"
            onClick={addTool}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
          >
            + Add Tool
          </button>
        </div>

        {tools.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No tools added yet. Click &quot;+ Add Tool&quot; to start.
          </div>
        )}

        {tools.map((tool) => (
          <div key={tool.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative gap-4 grid grid-cols-1 md:grid-cols-2">
            <button
              type="button"
              onClick={() => removeTool(tool.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</label>
              <select
                value={tool.toolName}
                onChange={(e) => updateTool(tool.id, { toolName: e.target.value as ToolName })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
              >
                {Object.keys(TOOLS_DATA).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</label>
              <select
                value={tool.plan}
                onChange={(e) => updateTool(tool.id, { plan: e.target.value as PlanTier })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
              >
                {TOOLS_DATA[tool.toolName].map((plan) => (
                  <option key={plan.name} value={plan.name}>
                    {plan.name} {plan.pricePerUser > 0 ? `($${plan.pricePerUser}/mo)` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</label>
              <input
                type="number"
                min="1"
                value={tool.seats}
                onChange={(e) => updateTool(tool.id, { seats: parseInt(e.target.value) || 1 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Monthly Spend ($)</label>
              <input
                type="number"
                min="0"
                value={tool.monthlySpend}
                onChange={(e) => updateTool(tool.id, { monthlySpend: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Use Case</label>
              <select
                value={tool.useCase}
                onChange={(e) => updateTool(tool.id, { useCase: e.target.value as UseCase })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing / Copy</option>
                <option value="data">Data Analysis</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed / General</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={tools.length === 0}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Run Instant Audit
      </button>
    </form>
  );
}
