---
name: roadmap-builder
description: Product prioritization framework using Impact vs Effort matrix and stage-based rules. Use when the user needs to decide what to build next, evaluate feature requests, challenge ideas, or prioritize the roadmap. Focuses on retention over growth, validates demand before building, and prevents feature creep.
---

# Roadmap Builder

Decide what to build next using a clear prioritization framework. Prevent feature creep, focus on what matters.

## Prioritization Framework

### Impact vs Effort Matrix

Plot every feature on this matrix, then prioritize accordingly:

```
High Impact │ DO SECOND    │ DO FIRST
            │ (Plan these) │ (Build now)
            │──────────────┼──────────────
Low Impact  │ DO LAST      │ DO NEVER
            │ (Maybe)      │ (Delete)
            └──────────────┴──────────────
              High Effort    Low Effort
```

**DO FIRST (High Impact, Low Effort):**
- Ship immediately
- These are your quick wins
- Example: Fix major bug preventing signups

**DO SECOND (High Impact, High Effort):**
- Plan carefully
- Break into smaller pieces if possible
- Example: Add real-time collaboration

**DO LAST (Low Impact, Low Effort):**
- Only if you have spare time
- Often not worth the maintenance cost
- Example: Dark mode toggle

**DO NEVER (Low Impact, High Effort):**
- Delete these from the roadmap
- They will drain resources for minimal return
- Example: Custom theming engine

### Impact Assessment

A feature has HIGH IMPACT if it:
- Directly serves the core use case
- Reduces churn (keeps users coming back)
- Removes a major friction point
- Is explicitly requested by multiple paying users
- Enables word-of-mouth sharing

A feature has LOW IMPACT if it:
- Is a "nice to have"
- Only a few users mentioned it
- Doesn't affect core retention metrics
- Is based on what you think users want (not what they say)

### Effort Assessment

LOW EFFORT = can ship in under 1 week
HIGH EFFORT = takes more than 1 week

**If effort is unclear:**
- Assume high effort
- Prototype or spike first to derisk
- Consider if you can fake it to validate demand

## Priority Categories

When multiple features compete, use this hierarchy:

**1. Retention (Highest Priority)**
Features that keep existing users active:
- Fix bugs that cause users to churn
- Remove friction from core workflow
- Improve reliability/performance
- Features users request after using the product

**2. Core Features**
Features that complete the core use case:
- Essential to product value
- Part of the minimum viable experience
- Users can't achieve their goal without it

**3. Monetization**
Features that enable payment:
- Only after users see value
- Simple payment flow first
- Advanced billing later

**4. Growth (Lowest Priority)**
Features that bring new users:
- Referral programs
- Social sharing
- SEO optimizations
- Only after retention is strong

**Rule:** Never prioritize growth over retention. A leaky bucket stays leaky no matter how much water you pour in.

## Stage-Based Rules

Your product stage determines what you should build.

### Pre-Launch (No Users Yet)

**ONLY BUILD:**
- Core loop features
- Minimum features to demonstrate value
- Features required for launch

**DO NOT BUILD:**
- User profiles
- Analytics dashboards
- Social features
- Payment systems
- Admin panels
- Anything that doesn't directly serve the core use case

**Test:** Can a user get value in under 5 minutes? If no, you're not ready to launch.

### Post-Launch (0-100 Users)

**ONLY BUILD:**
- Features users explicitly request (not implied)
- Bug fixes that block usage
- Critical missing pieces users discover

**DO NOT BUILD:**
- Features you think users want
- Optimizations for scale
- Advanced features "for later"
- Anything not directly requested

**Rule:** Every feature must come from a real user saying "I need [specific thing] to do [specific job]"

**How to validate demand:**
- User says: "I wish I could..." → Valid request
- User implies: "It would be nice if..." → Not yet, wait for more signals
- You think: "Users probably want..." → Do not build

### Growth Phase (100+ Users)

**ONLY BUILD:**
- Features that reduce churn (measure before/after)
- Features that increase sharing/referrals
- Features that remove friction from core loop
- Features requested by paying users

**DO NOT BUILD:**
- Features that don't move metrics
- Advanced features for power users (yet)
- Enterprise features (unless enterprise customers)

**Rule:** Every feature must have a hypothesis: "We believe [feature] will increase [metric] because [reason]"

## Feature Evaluation Questions

Before adding any feature to the roadmap, answer these questions:

### 1. Does this serve the core use case?

**Yes:** Feature directly enables or improves the primary user workflow
**No:** Feature is adjacent, nice-to-have, or for a secondary use case

If NO → Defer or delete.

### 2. Will users actually use this or just say they want it?

**Actually use:** Users have a specific job to do and this feature enables it
**Just say they want it:** Users think it sounds cool but won't change behavior

**How to tell:**
- Ask: "If we don't build this, what will you do instead?"
- If they have a workaround and it's working → Low priority
- If they say "I guess I'll keep doing X" → They don't really need it
- If they say "I can't accomplish Y without it" → High priority

### 3. Can we build this in under a week?

**Yes:** Ship it
**No:** Can you break it into smaller pieces?

If can't break down → Defer until you have more resources or validation

### 4. Can we fake it first to validate demand?

Before building, consider:
- Manual process behind the scenes
- Wizard of Oz prototype
- Waitlist or pre-order
- Concierge MVP

**Example:** Before building automated reports, manually send reports to 10 users and see if they value it.

## Red Flags

Watch for these warning signs when evaluating features:

### 1. Feature Creep

**Symptoms:**
- "It would be cool if..."
- "While we're at it, we could also..."
- Feature list keeps growing
- Building things because they're interesting, not necessary

**Solution:**
- Return to core use case
- Ask: "Does this directly serve the primary user need?"
- Remove anything that doesn't

### 2. Premature Optimization

**Symptoms:**
- "What if we have 1 million users?"
- "We should architect this to scale"
- Building for problems you don't have yet
- Optimizing before measuring

**Solution:**
- Build for your current scale
- Ship first, optimize when it actually breaks
- Focus on shipping, not perfect architecture

### 3. Building for Imaginary Users

**Symptoms:**
- "Users probably want..."
- "I think users need..."
- "Everyone wants [feature]"
- No specific user requested it

**Solution:**
- Talk to actual users
- Only build what real users explicitly request
- If no one asked, don't build it

### 4. Following Competitors

**Symptoms:**
- "Competitor X has this feature"
- "We need feature parity"
- Copying without understanding user need

**Solution:**
- Your users ≠ their users
- Only build if YOUR users request it
- Differentiate by focusing on your core value prop

### 5. Confusing "Would be nice" with "Must have"

**Symptoms:**
- User says "It would be cool if..."
- User says "You should add..."
- Feature requested once or twice

**Solution:**
- Wait for multiple explicit requests
- Only "I need this to accomplish X" counts as real demand
- "Would be nice" = ignore for now

## Decision-Making Process

When a feature idea comes up:

### Step 1: Categorize

Which category does it fall into?
- Retention
- Core features
- Monetization
- Growth

### Step 2: Assess Stage Appropriateness

Is this appropriate for your current stage?
- Pre-launch: Only core loop features
- Post-launch: Only explicitly requested features
- Growth: Only features that move metrics

### Step 3: Plot on Impact vs Effort Matrix

- What's the impact? (High/Low)
- What's the effort? (<1 week or >1 week)
- Where does it fall on the matrix?

### Step 4: Run Through Questions

- Does it serve core use case? (Yes/No)
- Will users actually use it? (Yes/No)
- Can we build in <1 week? (Yes/No)
- Can we fake it first? (Yes/No)

### Step 5: Check for Red Flags

- Feature creep?
- Premature optimization?
- Imaginary users?
- Following competitors?
- "Would be nice" vs "Must have"?

### Step 6: Decide

**Ship it if:**
- High impact, low effort
- Serves core use case
- Explicitly requested by real users
- Appropriate for stage
- No red flags

**Plan it if:**
- High impact, high effort
- Can break into smaller pieces
- Have validation it's needed

**Defer it if:**
- Low impact
- Not appropriate for stage
- Red flags present
- Can't validate demand

**Delete it if:**
- Low impact, high effort
- Doesn't serve core use case
- No user validation
- Feature creep

## When Advising on Roadmap

### Challenge Feature Ideas

For every feature proposed:
1. "Does this serve the core use case or is it adjacent?"
2. "Who specifically requested this and what problem does it solve for them?"
3. "Can we ship this in under a week? If not, can we break it down?"
4. "What metric will this move and how will we measure it?"

### Push Back on Red Flags

If you detect:
- **Feature creep:** "This sounds like scope expansion. Let's focus on the core use case first."
- **Premature optimization:** "Let's ship the simple version and optimize when it actually breaks."
- **Imaginary users:** "Has a real user explicitly asked for this? Let's validate demand first."

### Recommend Priorities

Based on stage and category:

**Pre-launch:**
"Focus on core loop features only. Everything else can wait until after launch."

**Post-launch:**
"What are users asking for most? Let's ship that before anything else."

**Growth phase:**
"What's causing churn? Let's fix retention before adding new features."

## Roadmap Structure

When organizing the roadmap:

**Now (This Week):**
- High impact, low effort features
- Critical bug fixes
- Explicitly requested features from paying users

**Next (Next 2-4 Weeks):**
- High impact, high effort features (broken into weekly chunks)
- Features requested by multiple users
- Retention improvements

**Later (No Timeline):**
- Low priority features
- Ideas waiting for validation
- Features not appropriate for current stage

**Never:**
- Low impact, high effort features
- Features no one requested
- Feature creep

## Examples: Good vs Bad Prioritization

**Scenario: Habit tracker app, 50 users**

**Good prioritization:**
```
User request: "I can't edit a habit after I create it"
Decision: DO FIRST
Reason: Blocks core use case, explicitly requested, <1 week to build
```

**Bad prioritization:**
```
Your idea: "Add social sharing so users can share their streaks"
Decision: DO NEVER (for now)
Reason: No users requested it, doesn't serve core use case, wrong stage (focus on retention first)
```

**Good prioritization:**
```
Multiple users: "I want to see patterns over time, like which days I'm most consistent"
Decision: DO SECOND
Reason: Explicitly requested by multiple users, serves retention, might take >1 week
Action: Break into smaller pieces: Start with simple weekly view
```

**Bad prioritization:**
```
Your thought: "We should build an admin panel to manage users"
Decision: DELETE
Reason: No users asked for it, doesn't serve core use case, premature (50 users don't need admin panel)
```

## Quick Decision Framework

```
User explicitly requested? → NO → Delete or defer
                          ↓
                         YES
                          ↓
Serves core use case? → NO → Defer
                      ↓
                     YES
                      ↓
Can ship in <1 week? → NO → Can you break it down? → NO → Defer
                     ↓                               ↓
                    YES                             YES
                     ↓                               ↓
                BUILD IT                        PLAN IT
```

## Maintaining Focus

Throughout the conversation:
- Constantly redirect to core use case
- Challenge features without clear user demand
- Remind about stage-appropriate building
- Flag feature creep immediately
- Push for simple, shippable versions
- Advocate for validation before building

Keep responses focused on prioritization decisions, not implementation details.
