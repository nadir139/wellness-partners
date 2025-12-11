---
name: launch-planner
description: Transform app ideas into shippable MVPs using a ship-fast, validate-first product philosophy. Use when the user wants to scope an MVP, generate a PRD, create Claude Code starter prompts, make product decisions, or needs guidance on building and shipping. Focused on Next.js/Supabase/Vercel stack with strict anti-feature-creep discipline.
---

# Launch Planner

Turn app ideas into shippable MVPs. Ship fast, validate with real users, avoid feature creep.

## Product Philosophy

**Core principles:**
- Ship fast: MVPs in 1 week maximum
- Validate with real users: no features without user validation
- No feature creep: only what serves the core user loop
- Defer complexity: avoid over-engineering, add features only after validation

## Pre-Build Validation

Before generating any PRD or writing code, answer these three questions:

1. **Who is this for?** Define the specific user. "Everyone" is not an answer.
2. **What's the one problem it solves?** If you can't state it in one sentence, the scope is too broad.
3. **How will I know if it works?** Define the success metric before building.

If any answer is unclear, do not proceed. Refine the idea first.

## MVP Scoping Workflow

### Step 1: Identify the Core User Loop

The core user loop is the minimum path from user arrival to value delivery. Everything else is secondary.

**Example:** For a habit tracker
- Core loop: User adds habit → marks it complete → sees streak
- Not core: Social sharing, analytics dashboard, habit categories, reminders

### Step 2: Apply the 1-Week Rule

Each feature must be shippable in less than 1 week. If a feature requires more than 1 week:
- Break it into smaller pieces
- Defer the complex parts
- Ship the simplest version that delivers value

### Step 3: Defer Non-Essential Features

Automatically defer these until after user validation:
- Authentication (use magic links or email-only if needed)
- User profiles
- Social features
- Analytics dashboards
- Payment systems (unless monetization is the core validation)
- Admin panels
- Email notifications
- Mobile apps

### Step 4: Define Success Metrics

Pick ONE metric that proves the idea works:
- Number of users who complete the core loop
- Number of times users return within 7 days
- Percentage of users who reach value moment

Do not track vanity metrics (signups, page views).

## PRD Generation

When generating a PRD, structure it as:

### [Product Name]

**Target User:** [Specific user persona]

**Problem:** [One sentence problem statement]

**Solution:** [One sentence solution]

**Core User Loop:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Success Metric:** [Single measurable metric]

**MVP Features:**
- [Feature 1]: [Why it's essential to core loop]
- [Feature 2]: [Why it's essential to core loop]
- [Feature 3]: [Why it's essential to core loop]

**Explicitly Out of Scope (for v1):**
- [Feature that seems important but isn't]
- [Feature that would take too long]
- [Feature that requires user validation first]

**Tech Stack:**
- Frontend: Next.js (App Router)
- Backend: Supabase (Database + Auth)
- Deployment: Vercel
- Styling: Tailwind CSS

**Estimated Build Time:** [X days, must be ≤7]

**Deployment Plan:**
- Deploy to Vercel
- Set up Supabase project
- Configure environment variables
- Share public URL for testing

## Claude Code Starter Prompts

Generate prompts in this format:

```
Build [Product Name] - [One-line description]

Tech stack:
- Next.js 14+ (App Router)
- Supabase for database and auth
- Tailwind CSS for styling
- Vercel deployment

Core features:
1. [Feature 1 with acceptance criteria]
2. [Feature 2 with acceptance criteria]
3. [Feature 3 with acceptance criteria]

Requirements:
- Set up Next.js project with App Router
- Configure Supabase client
- Create database schema for [entities]
- Implement [core user loop]
- Deploy to Vercel

Out of scope:
- [Deferred feature 1]
- [Deferred feature 2]

Create a clean, minimal UI focused on the core user loop. Prioritize shipping over perfection.
```

## Common Mistakes to Avoid

**1. Building features nobody asked for**
- Symptom: "It would be cool if..." or "Users might want..."
- Solution: Ship the MVP first. Let users tell you what they need.

**2. Over-engineering**
- Symptom: Setting up microservices, complex architectures, or abstractions
- Solution: Use Supabase directly. Add complexity only when you hit actual limits.

**3. Adding auth before validating the idea**
- Symptom: "I need users to sign up before they can try it"
- Solution: Let users try the core value without signup. Add auth only after validation.

**4. Perfect UI before testing**
- Symptom: Spending days on animations, color schemes, or pixel-perfect layouts
- Solution: Ship with Tailwind defaults. Improve UI after users care.

**5. Building for scale before product-market fit**
- Symptom: "What if 1 million users sign up?"
- Solution: That's a good problem to have later. Ship for 10 users first.

## Decision-Making Framework

During the build, when faced with a decision:

**Question:** "Should I add [feature]?"
**Answer:** Does it directly serve the core user loop? If no → defer it.

**Question:** "Should I optimize [performance/code quality]?"
**Answer:** Does it block shipping or hurt user experience? If no → ship first, optimize later.

**Question:** "Should I add auth now?"
**Answer:** Can users get value without signing up? If yes → defer auth.

**Question:** "Should I support [edge case]?"
**Answer:** Will more than 10% of users hit this? If no → defer it.

## Throughout the Build

When advising on product decisions:
- Remind about the 1-week deadline
- Flag feature creep immediately
- Suggest the simplest implementation
- Push toward shipping over perfection
- Redirect focus to the core user loop

Keep responses focused on actionable next steps, not theoretical improvements.
