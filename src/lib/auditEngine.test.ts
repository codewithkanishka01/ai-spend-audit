import { describe, it, expect } from 'vitest';
import { runAudit } from './auditEngine';
import { UserContext, UserToolInput } from './pricingData';

describe('Audit Engine', () => {
  it('should recommend downgrading Team plan for small team', () => {
    const context: UserContext = {
      teamSize: 2,
      tools: [{
        id: '1',
        toolName: 'Claude',
        plan: 'Team',
        seats: 2,
        monthlySpend: 60,
        useCase: 'writing'
      }]
    };
    
    const result = runAudit(context);
    expect(result.totalPotentialSavings).toBe(20); // $60 (Team) - $40 (Pro x2) = 20
    expect(result.recommendations[0].recommendedAction).toContain('Downgrade');
  });

  it('should recommend Cursor Pro for heavy API coding', () => {
    const context: UserContext = {
      teamSize: 1,
      tools: [{
        id: '2',
        toolName: 'Anthropic API',
        plan: 'API',
        seats: 1,
        monthlySpend: 150,
        useCase: 'coding'
      }]
    };
    
    const result = runAudit(context);
    expect(result.totalPotentialSavings).toBe(130); // $150 - $20 (Cursor Pro) = 130
    expect(result.recommendations[0].recommendedAction).toContain('Switch API usage to Cursor Pro');
  });

  it('should hook Credex for high unoptimized spend', () => {
    const context: UserContext = {
      teamSize: 20,
      tools: [{
        id: '3',
        toolName: 'ChatGPT',
        plan: 'Enterprise',
        seats: 20,
        monthlySpend: 1000,
        useCase: 'mixed'
      }]
    };
    
    const result = runAudit(context);
    expect(result.totalPotentialSavings).toBe(200); // 20% of 1000
    expect(result.recommendations[0].recommendedAction).toContain('Credex discounted credits');
    expect(result.isHighSavings).toBe(false); // Only true if >500
  });

  it('should report optimized state if no savings found', () => {
    const context: UserContext = {
      teamSize: 1,
      tools: [{
        id: '4',
        toolName: 'ChatGPT',
        plan: 'Plus',
        seats: 1,
        monthlySpend: 20,
        useCase: 'mixed'
      }]
    };
    
    const result = runAudit(context);
    expect(result.totalPotentialSavings).toBe(0);
    expect(result.recommendations[0].recommendedAction).toBe('Keep current plan');
  });

  it('should set isHighSavings flag to true when savings > 500', () => {
    const context: UserContext = {
      teamSize: 50,
      tools: [{
        id: '5',
        toolName: 'ChatGPT',
        plan: 'Enterprise',
        seats: 50,
        monthlySpend: 3000, // 20% savings = 600
        useCase: 'mixed'
      }]
    };
    
    const result = runAudit(context);
    expect(result.totalPotentialSavings).toBe(600);
    expect(result.isHighSavings).toBe(true);
  });
});
