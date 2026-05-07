# Devlog

## Day 1 - 2026-05-01
**Hours worked:** 2
**What I did:** Initialized Next.js project, planned architecture, created project scaffolding and documentation templates.
**What I learned:** Clarified the exact requirements for the MVP features, specifically the constraints around API usage and database integration.
**Blockers / what I'm stuck on:** Need to lock down specific database and email providers. Using mock implementations for now.
**Plan for tomorrow:** Build the dynamic spend input form and implement `localStorage` persistence.

## Day 2 - 2026-05-02
**Hours worked:** 3
**What I did:** Built `SpendInputForm.tsx`. Implemented dynamic form fields for adding/removing tools, updating plans, and persisting state to `localStorage`.
**What I learned:** Handling dependent dropdowns in React (e.g., Tool -> Plan Tier) requires careful state management to avoid invalid states.
**Blockers / what I'm stuck on:** The form looks a bit basic, need to polish the Tailwind design to make it look premium.
**Plan for tomorrow:** Write the core `auditEngine.ts` logic and corresponding unit tests.

## Day 3 - 2026-05-03
**Hours worked:** 4
**What I did:** Implemented `auditEngine.ts` with hardcoded pricing rules. Wrote Vitest unit tests to ensure the math is defensible. Refined the Tailwind UI.
**What I learned:** Writing the tests first (TDD) for financial logic saved me a lot of time debugging edge cases.
**Blockers / what I'm stuck on:** None today.
**Plan for tomorrow:** Build the `AuditResults.tsx` component and hook it up to the form.

## Day 4 - 2026-05-04
**Hours worked:** 3
**What I did:** Completed the frontend integration. `AuditResults.tsx` now beautifully renders the savings breakdown and recommendations.
**What I learned:** Using Tailwind's `animate-in` utilities makes the results feel much more dynamic and premium.
**Blockers / what I'm stuck on:** Need to figure out the best prompt structure for the AI summary generation.
**Plan for tomorrow:** Implement the Anthropic API integration for the personalized summary.

## Day 5 - 2026-05-05
**Hours worked:** 2
**What I did:** Created `/api/generate-summary` route. Tested different prompts with Claude 3 Haiku to get the right tone and brevity.
**What I learned:** Passing pre-calculated math to the LLM is much safer than asking it to calculate savings itself.
**Blockers / what I'm stuck on:** Anthropic API key provisioning took a bit longer than expected.
**Plan for tomorrow:** Implement lead capture, Supabase storage, and Resend email integration.

## Day 6 - 2026-05-06
**Hours worked:** 4
**What I did:** Set up `/api/capture-lead`. Connected Supabase for storing audit results and Resend for transactional emails. Built the shareable URL page at `audit/[id]`.
**What I learned:** Generating a short UUID for shareable URLs makes them look much cleaner when shared on social media.
**Blockers / what I'm stuck on:** Vercel deployment environment variables need to be configured properly.
**Plan for tomorrow:** Final review against rubric, write PROMPTS and REFLECTION docs, fix any lingering lint errors, and finalize git history.

## Day 7 - 2026-05-07
**Hours worked:** 2
**What I did:** Addressed linting errors, ensured CI tests pass, wrote `PROMPTS.md` and `REFLECTION.md`. Finalized the application for submission.
**What I learned:** Attention to detail in the final 10% (linting, docs, CI) is what separates a good project from a great one.
**Blockers / what I'm stuck on:** None. Ready to ship.
**Plan for tomorrow:** Celebrate.
