---
name: marketing-writer
description: Write marketing content for product features and launches by analyzing the codebase first. Use when the user needs landing page copy, tweet threads, Product Hunt descriptions, or launch emails. Automatically reads code to understand the product, then generates content using casual, direct brand voice with no buzzwords.
---

# Marketing Writer

Write marketing content that sounds human by understanding the product from code, then applying a casual, direct voice.

## Workflow

### Step 1: Understand the Product

Before writing anything, read the codebase to understand:
- What the app does
- What features exist
- What problems it solves
- The core value proposition

**Files to read (in order of priority):**
1. `README.md` - Product overview
2. `package.json` or requirements - Tech stack and dependencies
3. Main app files (`app/`, `src/`, `pages/`) - Core functionality
4. Component files - Feature implementation
5. API routes - Backend capabilities
6. Database schema - Data model and relationships

**Extract from code:**
- Feature names and what they do
- User workflows and interactions
- Technical capabilities (real-time, AI-powered, etc.)
- Integrations and connections
- Performance characteristics (if evident)

### Step 2: Identify the Value Proposition

After reading code, answer:
- What problem does this solve?
- Who has this problem?
- What's the user's alternative (current solution)?
- What makes this better?

### Step 3: Write with Brand Voice

Apply these principles to all content.

## Brand Voice Guidelines

**Write like you're talking to a friend:**
- Use contractions (it's, you're, don't)
- Keep sentences short
- Use everyday words
- Be direct and honest

**Avoid:**
- Corporate speak: "leverage," "synergy," "robust," "enterprise-grade"
- Hype words: "revolutionary," "game-changing," "cutting-edge"
- Vague claims: "industry-leading," "best-in-class," "next-generation"
- Passive voice: "It can be used by..." → "You can use it to..."
- Feature lists without context

**Focus on:**
- Real benefits, not features
- Specific use cases
- Actual user problems
- Honest limitations when relevant

**Examples:**

```
Bad: "Leverage our enterprise-grade solution to synergize your workflow"
Good: "Track your habits without the bullshit"

Bad: "Revolutionary AI-powered analytics platform"
Good: "See which habits actually stick"

Bad: "Seamlessly integrate with your existing tools"
Good: "Works with the apps you already use"
```

## Content Templates

### Landing Page Feature Sections

Use Problem → Solution → Benefit format for each feature.

**Structure:**
```markdown
[Feature Name]

[1-2 sentence problem statement]

[1-2 sentence solution]

[1 sentence concrete benefit]
```

**Example:**
```markdown
Quick Add

Remembering to log every habit is a pain. You forget, then feel guilty, then stop tracking.

Add habits in under 2 seconds. No forms, no categories, no setup.

Track consistently without the friction that kills other habit trackers.
```

**Rules:**
- Start with the pain point (relatable problem)
- Show how the feature solves it (specific mechanism)
- End with the outcome (what users get)
- Keep it under 50 words total
- No marketing fluff

### Tweet Threads

Structure: Hook → Credibility → Value → CTA

**Template:**
```
Tweet 1 (Hook): Bold statement or relatable problem
Tweet 2 (Context): Why this matters / who this is for
Tweet 3-5 (Value): Show the feature/product with specifics
Tweet 6 (Proof): Social proof, metric, or validation
Tweet 7 (CTA): Clear next step + link
```

**Example thread:**
```
1/ I built a habit tracker that doesn't make me feel like shit when I miss a day.

2/ Every tracker I tried was either too complex (Notion) or too gamified (streaks everywhere). I just wanted something simple that worked.

3/ So I built it. Three features only:
- Add a habit in 2 seconds
- Mark it done (or not)
- See patterns over time

4/ No streaks. No guilt. No "you broke your 47-day chain" notifications.

5/ Been using it for 3 months. I've actually stuck with habits longer than any other tracker.

6/ Try it → [link]
```

**Rules:**
- Hook must stop the scroll (bold claim, relatable pain, or unexpected insight)
- Show, don't tell (specific details, not vague benefits)
- End with one clear action
- Keep it conversational (like you're explaining to a friend)
- No emoji spam

### Product Hunt Descriptions

Structure: One-liner → Why Now → What Makes It Different

**Template:**
```
Tagline: [Action-oriented, 6-8 words max]

Description:
[One sentence: what it is and who it's for]

[One sentence: the problem it solves]

[2-3 sentences: what makes it different from alternatives]

[One sentence: what users can do today]
```

**Example:**
```
Tagline: Track habits without the guilt

Description:
A habit tracker for people who've tried and quit other habit trackers.

Most trackers make you feel bad when you miss a day. They break your streak, send shame notifications, and make tracking feel like another chore.

This one doesn't. No streaks to break. No guilt trips. Just a simple log of what you did, when you did it. The only metric that matters is: did you do it more this month than last month?

Add a habit, mark it done, see patterns. That's it.
```

**Rules:**
- Tagline must be clear and action-oriented (not clever or vague)
- First sentence answers "what is this?"
- Focus on differentiation (what you DON'T do is often as important)
- No buzzwords or hype
- End with what they can do right now

### Launch Emails

Structure: Personal Hook → Specific Value → Easy CTA

**Template:**
```
Subject: [Direct, personal, specific]

Hey,

[Personal opening - why you built this / your experience with the problem]

[The problem you had]

[What you built to solve it]

[2-3 specific features/benefits]

[What they can do today]

[Easy next step]

[Your name]
```

**Example:**
```
Subject: I made a habit tracker that doesn't suck

Hey,

I've tried every habit tracker out there. Notion, Streaks, Done, Loop. All of them made me feel worse about my habits, not better.

The problem? They're built around streaks. Miss one day and you're back to zero. It makes tracking feel like a punishment instead of a tool.

So I built something simpler:
- Log habits in 2 seconds
- No streaks, no guilt
- Just see: am I doing this more often?

It's live now. You can try it for free.

[link]

Let me know what you think.

[Name]
```

**Rules:**
- Subject line: direct, not clever
- Start with your personal connection to the problem
- Be specific about what it does
- Keep it short (under 150 words)
- One clear CTA (link)
- Write like you're emailing a friend
- No "we're excited to announce" or corporate speak

## Content Types by Use Case

**Shipping a new feature:**
1. Read the feature code
2. Write landing page feature section
3. Write tweet thread
4. Write launch email

**Launching the product:**
1. Read entire codebase
2. Write Product Hunt description
3. Write tweet thread
4. Write landing page hero + features

**Need quick copy:**
1. Ask user what content type
2. Read relevant code
3. Generate single template

## Quality Checklist

Before delivering any content, verify:
- [ ] Read relevant code to understand the feature/product
- [ ] No corporate buzzwords or hype words
- [ ] Focuses on real benefits, not feature lists
- [ ] Uses contractions and casual language
- [ ] Starts with the problem (relatable)
- [ ] Shows specific solutions (concrete)
- [ ] Ends with clear next step
- [ ] Under word limit for format
- [ ] Sounds like talking to a friend

## Common Mistakes to Avoid

**1. Writing without reading code**
- Always understand the product first
- Don't make assumptions about features
- Extract actual capabilities from implementation

**2. Using marketing speak**
```
Bad: "Seamlessly integrate"
Good: "Works with"

Bad: "Leverage our platform"
Good: "Use our tool"

Bad: "Next-generation solution"
Good: "Simple tracker"
```

**3. Leading with features**
```
Bad: "Our app has real-time sync, cloud storage, and AI-powered insights"
Good: "Your habits sync across devices. See them anywhere."
```

**4. Being vague**
```
Bad: "Makes habit tracking easier"
Good: "Add habits in under 2 seconds"

Bad: "Powerful analytics"
Good: "See which days you're most consistent"
```

**5. Over-promising**
```
Bad: "Transform your life with habits"
Good: "Track habits without feeling guilty"

Bad: "The last habit tracker you'll ever need"
Good: "A simpler way to track habits"
```

## Examples: Good vs Bad

**Landing page feature:**
```
Bad:
"Advanced Analytics Dashboard
Leverage powerful insights to optimize your habit formation journey with our enterprise-grade analytics platform."

Good:
"See What's Working
Most habit trackers just show streaks. This shows patterns. Did you do better on weekdays? Worse when traveling? Now you know."
```

**Tweet:**
```
Bad:
"Excited to announce our revolutionary new habit tracking platform! 🚀 Featuring AI-powered insights and seamless cloud sync! #productivity #habits"

Good:
"I tried 12 habit trackers. They all made me feel bad when I missed a day. So I built one that doesn't. [link]"
```

**Email:**
```
Bad:
"We're thrilled to announce the launch of our innovative habit tracking solution, designed to revolutionize the way you approach personal development."

Good:
"I built a habit tracker that doesn't guilt-trip you when you miss a day. Trying it out: [link]"
```

## Tone Calibration

**Casual, but not unprofessional:**
- Use "you" and "your" (direct)
- OK: "It's simple" / Not OK: "It's literally the best thing ever"
- OK: "No BS" / Not OK: "No fucking around"

**Direct, but not cold:**
- OK: "Track habits without the guilt"
- Not OK: "Track habits. Period."
- OK: "Try it for free"
- Not OK: "Click here to revolutionize your life"

**Honest, but not negative:**
- OK: "It won't change your life, but it might help you stick to habits"
- Not OK: "Other trackers are garbage, use ours"
- OK: "No fancy features. Just what you need."
- Not OK: "We don't have X because we're lazy"
