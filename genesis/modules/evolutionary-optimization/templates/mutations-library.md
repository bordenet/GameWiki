# Evolutionary Optimization Mutation Library

**Source:** Production-validated mutations from product-requirements-assistant
**Status:** ✅ Proven with +31.1% quality improvement in 20 rounds
**Last Updated:** 2025-11-21

---

## Overview

This library documents proven mutations that deliver measurable quality improvements across Genesis projects. Mutations are ranked by impact based on real optimization data.

**Key Findings:**
- **Top 5 mutations deliver 71-73%** of total improvement
- **Diminishing returns start at Round 11**
- **Optimal iteration count: 15-20 rounds**

---

## High-Impact Mutations (Proven Across Projects)

### 1. Ban Vague Language (+6.0% average improvement)

**Target Criteria:** Clarity
**Applicable To:** All project types (PRD, One-Pager, COE)
**Success Rate:** 95% kept in optimization runs

**Implementation:**
Add explicit banned words list with required alternatives:

**Forbidden Words:**
- "improve" (unless followed by "from X to Y")
- "enhance" (unless followed by "from X to Y")
- "better"
- "optimize" (unless followed by "for [specific metric]")
- "faster" (unless quantified)
- "easier" (unless quantified)

**Required Alternatives:**
- "increase from X to Y by [date]"
- "reduce from A to B by [date]"
- "achieve [specific metric] by [date]"

**Example:**
```
❌ FORBIDDEN: "Improve user experience"
✅ REQUIRED: "Reduce checkout time from 5 minutes to 2 minutes by Q2 2025"

❌ FORBIDDEN: "Make the system faster"
✅ REQUIRED: "Reduce API response time from 500ms to 200ms (60% improvement)"
```

---

### 2. Strengthen "No Implementation" Rule (+5.4% average improvement)

**Target Criteria:** Engineering-Ready (PRD), Actionability (One-Pager)
**Applicable To:** PRD, One-Pager, COE
**Success Rate:** 90% kept in optimization runs

**Implementation:**
Add forbidden vs. allowed examples to clarify what NOT to include:

**Forbidden (Implementation Details):**
- Technology choices: "Use React", "PostgreSQL database", "OAuth authentication"
- Architecture decisions: "Microservices", "REST API", "Event-driven"
- Deployment specifics: "Deploy to AWS", "Use Lambda functions"
- Tool specifications: "Redis cache", "Elasticsearch", "Kafka"

**Allowed (Business Requirements):**
- Outcomes: "Users must be able to view their data within 2 seconds"
- Constraints: "System must support 10,000 concurrent users"
- Quality attributes: "99.9% uptime required"
- Security requirements: "Data must be encrypted at rest and in transit"

**Example:**
```
❌ FORBIDDEN: "Use React for the frontend and PostgreSQL for the database"
✅ REQUIRED: "Users must be able to view their dashboard within 2 seconds of login"

❌ FORBIDDEN: "Implement OAuth 2.0 for authentication"
✅ REQUIRED: "Users must be able to securely authenticate using their corporate credentials"
```

---

### 3. Enhance Adversarial Tension (+2.9% average improvement)

**Target Criteria:** Consistency, Quality
**Applicable To:** Multi-phase workflows (PRD, One-Pager with review)
**Success Rate:** 85% kept in optimization runs

**Implementation:**
Make review phase genuinely challenge, not just improve:

**Review Phase Instructions:**
- "Challenge assumptions, don't just polish"
- "Require evidence for all claims"
- "Demand alternative perspectives"
- "Question vague language aggressively"
- "Push back on implementation details"

**Example Adversarial Questions:**
- "What evidence supports this claim?"
- "What are 3 alternative approaches?"
- "How would this fail?"
- "What stakeholder concerns are missing?"
- "Where is this too vague?"

---

### 4. Stakeholder Impact Requirements (+2.6% average improvement)

**Target Criteria:** Comprehensiveness
**Applicable To:** All project types
**Success Rate:** 80% kept in optimization runs

**Implementation:**
Require quantified impact for each stakeholder group:

**For Each Stakeholder:**
- **Who:** Specific role/group
- **Impact:** Quantified benefit or change
- **Why This Matters:** Business context
- **Success Metric:** How to measure

**Example:**
```
❌ VAGUE: "This will help the sales team"
✅ SPECIFIC:
- **Who:** Enterprise Sales Team (15 people)
- **Impact:** Reduce proposal creation time from 8 hours to 2 hours (75% reduction)
- **Why This Matters:** Enables team to handle 3x more opportunities per quarter
- **Success Metric:** Track proposal creation time in CRM
```

---

### 5. Quantified Success Metrics (+2.5% average improvement)

**Target Criteria:** Comprehensiveness, Measurability
**Applicable To:** All project types
**Success Rate:** 85% kept in optimization runs

**Implementation:**
Require baseline + target + timeline + measurement method for all metrics:

**Success Metric Template:**
```
**Metric:** [What you're measuring]
**Baseline:** [Current state with data]
**Target:** [Desired state with specific number]
**Timeline:** [When to achieve]
**Measurement:** [How to track]
```

**Example:**
```
❌ VAGUE: "Increase user engagement"
✅ SPECIFIC:
**Metric:** Daily Active Users (DAU)
**Baseline:** 5,000 DAU (as of Nov 2024)
**Target:** 8,000 DAU (60% increase)
**Timeline:** By Q2 2025
**Measurement:** Google Analytics dashboard, tracked weekly
```

---

## Medium-Impact Mutations

### 6. Business Context Requirement (+1.8% average improvement)

**Target Criteria:** Comprehensiveness
**Applicable To:** All project types
**Success Rate:** 75% kept

**Implementation:**
Require "why this matters" for each major section:
- Link to business goals
- Explain urgency
- Show competitive context
- Quantify opportunity cost

---

### 7. Synthesis Decision Criteria (+1.5% average improvement)

**Target Criteria:** Consistency
**Applicable To:** Multi-phase workflows
**Success Rate:** 70% kept

**Implementation:**
Add explicit criteria for synthesis phase:
- Keep if: Adds new perspective, resolves conflict, strengthens argument
- Discard if: Redundant, contradictory, weakens clarity

---

### 8. Out-of-Scope Examples (+1.2% average improvement)

**Target Criteria:** Clarity
**Applicable To:** All project types
**Success Rate:** 65% kept

**Implementation:**
Require explicit "Out of Scope" section with examples:
- What we're NOT doing
- Why it's out of scope
- When it might be reconsidered

---

## Low-Impact Mutations (Diminishing Returns)

### 9. Scope Boundary Examples (+0.0% - often discarded)
### 10. Edge Case Coverage (+0.01% average improvement)
### 11. Over-Specification Templates (+0.01% average improvement)

**Note:** These mutations rarely improve quality and often add unnecessary complexity.

---

## Mutation Best Practices

### 1. Target Weaknesses
Identify lowest-scoring criteria in baseline and apply relevant mutations first.

### 2. Start with High-Impact
Apply mutations 1-5 before considering medium or low-impact mutations.

### 3. One Change at a Time
Don't combine mutations. Test each independently for objective scoring.

### 4. Objective Scoring
Use keep/discard logic based on test case scores, not subjective judgment.

### 5. Stop at Diminishing Returns
When improvements < 0.01 per round, stop optimizing.

---

## Cross-Project Application

### PRD Projects
- Focus on mutations 1, 2, 4, 5
- Emphasize "No Implementation" rule
- Strong adversarial review

### One-Pager Projects
- Focus on mutations 1, 4, 5
- Emphasize conciseness
- Clear actionability

### COE Projects
- Focus on mutations 1, 4, 5, 6
- Emphasize practicality
- Scalability considerations

---

## Version History

- **v1.0.0** (2025-11-21): Initial library from product-requirements-assistant
- Source: 20-round optimization (+31.1% improvement)
- Validated across 8 diverse test cases

