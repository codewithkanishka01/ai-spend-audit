import { UserContext, TOOLS_DATA, ToolName } from "./pricingData";

export interface AuditRecommendation {
  toolId: string;
  toolName: ToolName;
  currentSpend: number;
  recommendedAction: string;
  savings: number; // Monthly savings
  reason: string;
}

export interface AuditResult {
  totalCurrentSpend: number;
  totalPotentialSavings: number;
  recommendations: AuditRecommendation[];
  isHighSavings: boolean; // >$500/mo triggers Credex lead prominent
}

export function runAudit(context: UserContext): AuditResult {
  let totalCurrentSpend = 0;
  let totalPotentialSavings = 0;
  const recommendations: AuditRecommendation[] = [];

  context.tools.forEach(tool => {
    totalCurrentSpend += tool.monthlySpend;
    let savings = 0;
    let action = "Keep current plan";
    let reason = "You are currently optimized for this tool.";

    // Rule 1: Right plan for usage? Team plan overkill check.
    if (tool.seats <= 2 && (tool.plan === 'Team' || tool.plan === 'Business' || tool.plan === 'Enterprise')) {
      // Find a Pro/Individual plan
      const cheaperPlan = TOOLS_DATA[tool.toolName].find(p => p.name === 'Pro' || p.name === 'Individual' || p.name === 'Plus');
      if (cheaperPlan) {
        const potentialSpend = cheaperPlan.pricePerUser * tool.seats;
        if (potentialSpend < tool.monthlySpend) {
          savings = tool.monthlySpend - potentialSpend;
          action = `Downgrade to ${cheaperPlan.name} plan`;
          reason = `Team/Business plans are usually overkill for ${tool.seats} seats. Switching to ${cheaperPlan.name} saves money while retaining core features.`;
        }
      }
    }

    // Rule 2: API usage optimization (very rough estimate for MVP)
    if (tool.plan === 'API' && tool.monthlySpend > 100 && tool.useCase === 'coding') {
      // Suggest cursor or copilot if they are raw-dogging API for coding
      const cursorPro = TOOLS_DATA['Cursor'].find(p => p.name === 'Pro');
      if (cursorPro) {
        const potentialSpend = cursorPro.pricePerUser * tool.seats;
        if (potentialSpend < tool.monthlySpend) {
           savings = tool.monthlySpend - potentialSpend;
           action = `Switch API usage to Cursor Pro`;
           reason = `You are spending $${tool.monthlySpend}/mo on API access for coding. Cursor Pro provides unlimited fast requests for $20/user.`;
        }
      }
    }

    // Rule 3: Cheaper alternatives
    if (tool.toolName === 'GitHub Copilot' && tool.plan === 'Enterprise') {
        const cursorBusiness = TOOLS_DATA['Cursor'].find(p => p.name === 'Business');
        if (cursorBusiness && cursorBusiness.pricePerUser < (tool.monthlySpend / tool.seats)) {
            const potentialSpend = cursorBusiness.pricePerUser * tool.seats;
            savings = tool.monthlySpend - potentialSpend;
            action = `Switch to Cursor Business`;
            reason = `Cursor provides comparable or better AI assistance for a similar/lower enterprise tier cost, often with Claude 3.5 Sonnet included.`;
        }
    }

    // Rule 4: General API overspend / Retail vs Credits (Credex hook)
    if (tool.monthlySpend >= 500 && savings === 0) {
      // If no other savings found but spend is high, hook for Credex
      savings = tool.monthlySpend * 0.20; // Assume 20% savings via credits
      action = `Procure via Credex discounted credits`;
      reason = `You are paying retail pricing for high volume usage. Credex can source discounted credits for ${tool.toolName} saving you ~20%.`;
    }

    if (savings > 0) {
      totalPotentialSavings += savings;
      recommendations.push({
        toolId: tool.id,
        toolName: tool.toolName,
        currentSpend: tool.monthlySpend,
        recommendedAction: action,
        savings,
        reason
      });
    } else {
       // Push an optimized state
       recommendations.push({
        toolId: tool.id,
        toolName: tool.toolName,
        currentSpend: tool.monthlySpend,
        recommendedAction: action,
        savings: 0,
        reason
      });
    }
  });

  return {
    totalCurrentSpend,
    totalPotentialSavings,
    recommendations,
    isHighSavings: totalPotentialSavings >= 500
  };
}
