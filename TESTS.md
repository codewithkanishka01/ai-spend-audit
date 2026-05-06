# Tests

### Automated Tests
We use **Vitest** for our unit tests. The core logic of the application resides in the `auditEngine.ts`, which we have thoroughly tested.

#### `src/lib/auditEngine.test.ts`
This file covers the `runAudit` function. It contains 5 specific tests:
1. **Downgrade Team plan**: Verifies that a small team using a 'Team' plan is correctly advised to downgrade to a 'Pro' plan.
2. **API optimization**: Verifies that heavy API usage for coding is redirected to Cursor Pro for flat-rate savings.
3. **Credex hook**: Verifies that a very high unoptimized spend (e.g. Enterprise ChatGPT) correctly triggers the Credex discounted credits recommendation.
4. **Optimized state**: Verifies that if a user is on the correct plan and no savings are possible, the engine correctly reports $0 savings and "Keep current plan".
5. **High savings flag**: Verifies that the `isHighSavings` boolean is correctly flipped to `true` when total savings exceed $500, which is used by the frontend to alter the Lead Capture UI.

**How to run tests locally:**
```bash
npx vitest run
```
