import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

export async function POST(req: Request) {
  try {
    const { tools, totalCurrentSpend, totalPotentialSavings } = await req.json();

    if (!tools || tools.length === 0) {
      return NextResponse.json({ error: 'No tools provided' }, { status: 400 });
    }

    if (!anthropic) {
       // Fallback gracefully if API key is not configured
       return NextResponse.json({ 
         summary: `Based on your stack of ${tools.length} tools, you are spending $${totalCurrentSpend}/mo. By optimizing plans and switching tools, you could save $${totalPotentialSavings}/mo. Review the breakdown below for specific recommendations.` 
       });
    }

    const toolDescriptions = tools.map((t: { toolName: string; plan: string; seats: number; useCase: string }) => `${t.toolName} (${t.plan} plan, ${t.seats} seats) for ${t.useCase}`).join(', ');

    const prompt = `You are a financial advisor for a startup. They currently use the following AI tools: ${toolDescriptions}. 
    They are spending a total of $${totalCurrentSpend} per month, but our audit engine found they could save $${totalPotentialSavings} per month by optimizing.
    Write a brief, personalized 100-word summary advising them on their stack. Be professional but encouraging. Do not invent specific prices or competitors not mentioned in this prompt.`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      system: "You are a concise, helpful AI spend auditor.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const summaryText = msg.content[0].type === 'text' ? msg.content[0].text : 'Summary generation failed.';

    return NextResponse.json({ summary: summaryText });
    
  } catch (error) {
    console.error('Anthropic API error:', error);
    // Graceful fallback on error
    return NextResponse.json({ 
       summary: `Your stack has been analyzed. Please check the breakdown for details on your potential savings.` 
    });
  }
}
