<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI Testing and Environment Rules
- Always use Playwright for UI testing.
- Always run and verify tests on local environment.


# Required Agent Workflow
When working on features or bug fixes, you MUST follow this strict iteration loop:
1. **Coding**: Implement the feature or fix.
2. **Testing by Playwright**: Write and execute a Playwright test to verify the UI changes.
3. **Test on Local**: Verify the results in the local environment and capture screenshots if necessary.
4. **Iterate**: You must repeat this coding and testing cycle at least 3 times to refine and perfect the changes.
5. **Check Completeness**: Before considering the task done, verify all edge cases, styling details, and requirements are fully met.
