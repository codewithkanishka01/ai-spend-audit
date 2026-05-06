# AI Spend Audit

A free web tool that helps startups identify where they are overspending on AI subscriptions (like ChatGPT, Claude, GitHub Copilot, Cursor) and recommends cheaper plans, alternatives, or consolidated credits to save money.

## Quick Start
```bash
npm install
npm run dev
```

## Decisions
1. **Next.js App Router**: Chosen for its robust full-stack capabilities, allowing us to build the form, handle API routes for the LLM summary, and easily generate dynamic shareable public URLs.
2. **Tailwind CSS**: Used for rapid UI development and ensuring a premium, responsive design without writing custom CSS files.
3. **Local Storage Persistence**: State is persisted using `localStorage` to ensure users don't lose their input if they accidentally refresh the page, improving UX.
4. **API Route for LLM**: The Anthropic API call is placed in a server-side route (`/api/generate-summary`) to keep the API key secure and prevent it from being exposed to the client.
5. **Mocked Backend (Temporary)**: Database and email services are mocked initially to allow for rapid MVP testing before locking in a specific provider like Supabase or Resend.
