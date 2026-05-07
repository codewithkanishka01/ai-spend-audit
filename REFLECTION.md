# Reflection

1. **The hardest bug you hit this week, and how you debugged it**
The hardest bug was related to managing state in the dynamic form, specifically when users changed the tool name (e.g., from ChatGPT to Cursor). The UI would update the tool name, but the previously selected "Plan" tier would persist. Since Cursor doesn't have a "Team" plan, the app would crash when trying to look up the price for `Cursor.Team`. I debugged this by placing console logs in the `onChange` handlers and tracing the state object. I hypothesized that `updateTool` wasn't resetting dependent fields. The fix was updating `updateTool` to check if `toolName` changed, and if so, auto-selecting the first available plan for that new tool.

2. **A decision you reversed mid-week, and what made you reverse it**
Mid-week, I reversed the decision to do the audit logic entirely on the server-side via an API route. Initially, I thought it would keep the logic more secure. However, since the pricing data is public anyway, routing every keystroke or form change to a server endpoint introduced unnecessary latency and complexity. I moved the core audit engine into a shared lib (`auditEngine.ts`) and ran it entirely on the client side for instant feedback, only calling the server for the final AI summary and lead capture.

3. **What you would build in week 2 if you had it**
In week 2, I would build the "Benchmark mode." Startups want to know not just how to save money, but how their spending compares to similar-sized companies. I would anonymize and aggregate the data captured in Week 1 to generate dynamic benchmarks like "Your AI spend per developer is $120 — companies your size average $85." I'd also implement the referral system to incentivize users to share the tool with their network.

4. **How you used AI tools**
I used Cursor extensively. I relied on Claude 3.5 Sonnet inside Cursor's Composer for scaffolding the Next.js API routes and generating the initial Tailwind layouts. I didn't trust it with the complex domain logic of the `auditEngine.ts` — I wrote those tests and edge cases manually to ensure the financial advice was defensible. One specific time the AI was wrong was when it suggested I use a `useEffect` to synchronize the `teamSize` state directly, which triggered a React hydration error due to an infinite render loop. I caught it by reviewing the ESLint warnings it generated and fixing the state flow manually.

5. **Self-rating on a 1-10 scale**
- **Discipline (9/10):** I committed code consistently every day and adhered strictly to the MVP constraints without scope creep.
- **Code Quality (8/10):** The Next.js architecture is clean and strongly typed with TypeScript, though some components could be further modularized.
- **Design Sense (8/10):** The UI looks premium and trustworthy, leveraging Tailwind gradients and subtle animations, avoiding the "bootstrap look."
- **Problem Solving (9/10):** Successfully decoupled the deterministic math from the probabilistic LLM generation, ensuring a robust product.
- **Entrepreneurial Thinking (10/10):** I focused heavily on the GTM strategy and the "viral loop" of the shareable URL, treating this as a real product launch rather than a coding exercise.
