# Prompts

## The Full LLM Prompts Used

**Summary Generation Prompt (Anthropic Claude 3 Haiku):**
```text
You are a financial advisor for a startup. They currently use the following AI tools: ${toolDescriptions}. 
They are spending a total of $${totalCurrentSpend} per month, but our audit engine found they could save $${totalPotentialSavings} per month by optimizing.
Write a brief, personalized 100-word summary advising them on their stack. Be professional but encouraging. Do not invent specific prices or competitors not mentioned in this prompt.
```

## Why I wrote them this way
I designed the prompt to explicitly pass in the pre-calculated math (`totalCurrentSpend`, `totalPotentialSavings`) rather than asking the LLM to do the math. LLMs are notoriously unreliable at arithmetic, especially when pricing rules are complex. By doing the deterministic math in the TypeScript `auditEngine.ts`, I ensure accuracy. The LLM is used strictly for its strength: summarizing data and creating a personalized, encouraging narrative for the user. I also included a negative constraint ("Do not invent specific prices or competitors") to prevent hallucinations about unsupported tools.

## What I tried that didn't work
Initially, I tried passing the raw list of tools and asking Claude to figure out the savings directly:
```text
Here are the tools the startup uses: ${toolsJSON}. You know the market prices. Tell them how much they can save.
```
This failed miserably. The model hallucinated prices for Enterprise tiers (which are usually custom), failed to understand the nuance of "seats vs usage," and frequently got the math wrong. Moving the logic to code and only using the LLM for the prose fixed this completely.
