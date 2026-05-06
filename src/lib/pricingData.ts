export type PlanTier = 'Free' | 'Hobby' | 'Pro' | 'Plus' | 'Max' | 'Individual' | 'Team' | 'Business' | 'Enterprise' | 'API' | 'Advanced';

export type ToolName = 'Cursor' | 'GitHub Copilot' | 'Claude' | 'ChatGPT' | 'Anthropic API' | 'OpenAI API' | 'Gemini' | 'Windsurf';

export interface ToolPlan {
  name: PlanTier;
  pricePerUser: number; // monthly
  description?: string;
}

export const TOOLS_DATA: Record<ToolName, ToolPlan[]> = {
  'Cursor': [
    { name: 'Hobby', pricePerUser: 0 },
    { name: 'Pro', pricePerUser: 20 },
    { name: 'Business', pricePerUser: 40 },
  ],
  'GitHub Copilot': [
    { name: 'Individual', pricePerUser: 10 },
    { name: 'Business', pricePerUser: 19 },
    { name: 'Enterprise', pricePerUser: 39 },
  ],
  'Claude': [
    { name: 'Free', pricePerUser: 0 },
    { name: 'Pro', pricePerUser: 20 },
    { name: 'Team', pricePerUser: 30 },
  ],
  'ChatGPT': [
    { name: 'Free', pricePerUser: 0 },
    { name: 'Plus', pricePerUser: 20 },
    { name: 'Team', pricePerUser: 30 },
  ],
  'Anthropic API': [
    { name: 'API', pricePerUser: 0 }, // Variable cost, we'll ask user for their spend
  ],
  'OpenAI API': [
    { name: 'API', pricePerUser: 0 }, // Variable cost
  ],
  'Gemini': [
    { name: 'Advanced', pricePerUser: 20 },
    { name: 'API', pricePerUser: 0 },
  ],
  'Windsurf': [
    { name: 'Free', pricePerUser: 0 },
    { name: 'Pro', pricePerUser: 15 },
  ]
};

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface UserToolInput {
  id: string; // unique ID for the entry
  toolName: ToolName;
  plan: PlanTier;
  seats: number;
  monthlySpend: number; // Might differ from plan price if API or discount
  useCase: UseCase;
}

export interface UserContext {
  teamSize: number;
  tools: UserToolInput[];
}
