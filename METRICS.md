# Metrics & Telemetry

## North Star Metric
**Qualified Leads Captured per Week**
*Why:* This tool is fundamentally a B2B lead-generation asset for Credex. "Daily Active Users" (DAU) is a vanity metric here because a founder only needs to run this audit once or twice a year. The ultimate success of this tool is measured by how many high-intent, contactable leads (startups spending >$500/mo on AI) it feeds into Credex's sales pipeline.

## 3 Input Metrics that Drive the North Star
1. **Audit Completion Rate:** The percentage of visitors who start the tool input form and successfully click "Run Instant Audit". If this is low, the form is too complex or frictionless.
2. **High-Savings Surface Rate:** The percentage of completed audits that identify >$500/mo in savings. This indicates we are attracting the right target audience (funded startups with real spend) rather than hobbyists.
3. **Share URL Visit Coefficient:** The average number of unique visits generated per shareable audit URL. This measures the viral loop—if founders are sharing their results with their co-founders or investors, it drives organic acquisition.

## What I'd Instrument First
I would immediately instrument **funnel drop-off in the Spend Input Form**. Specifically:
- `form_viewed`
- `tool_added` (with the tool name as a property)
- `audit_calculated`
- `email_captured`

Knowing exactly where users abandon the flow (e.g., do they drop off when asked for "Est. Monthly Spend" because they don't know it offhand?) is critical for optimizing the conversion rate to the North Star metric.

## What Number Triggers a Pivot Decision
**A Lead Capture Rate of < 2% of Completed Audits.**
If founders are running the audit, seeing the savings, but refusing to enter their email to get the full report or book a consultation, the core value proposition is failing. It would indicate that either the savings aren't compelling enough, the audit doesn't feel trustworthy, or the friction of giving an email outweighs the perceived value. If we hit this number, we'd need to pivot the UX—perhaps giving away the full report instantly and only gating the "Claim Discounted Credits" action.
