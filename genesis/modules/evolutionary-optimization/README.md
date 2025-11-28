# Evolutionary Prompt Optimization Module

**Status:** ✅ Production-validated  
**Source:** https://github.com/bordenet/product-requirements-assistant  
**Proven Results:** +20-30% quality improvements in 15-20 rounds  
**Version:** 1.0.0 (2025-11-21)

---

## Overview

This Genesis module provides out-of-the-box evolutionary prompt optimization for all spawned projects. It uses objective scoring with keep/discard logic to iteratively improve LLM prompts through automated testing and mutation.

**Key Benefits:**
- ✅ **Objective Quality Measurement:** No subjective judgment, only data
- ✅ **Proven Results:** +31.1% improvement in production testing
- ✅ **Project-Type-Specific:** Scorers for PRD, One-Pager, and COE projects
- ✅ **Automated Workflow:** Run simulations, review results, apply learnings
- ✅ **Cross-Project Insights:** Compare quality across all Genesis projects

---

## What Gets Installed

When you spawn a new Genesis project, it automatically includes:

### 1. Core Optimization Engine
- **File:** `tools/evolutionary-optimizer.js` (525 lines)
- **Features:**
  - Objective scoring with keep/discard logic
  - Multi-test-case validation
  - Diminishing returns analysis
  - Comprehensive reporting

### 2. Project-Type-Specific Scorer
- **PRD Scorer:** `tools/prd-scorer.js` (for PRD assistant projects)
- **One-Pager Scorer:** `tools/one-pager-scorer.js` (for one-pager projects)
- **COE Scorer:** `tools/coe-scorer.js` (for COE generator projects)

**Scoring Criteria:**
- **PRD:** Comprehensiveness, Clarity, Structure, Consistency, Engineering-Ready
- **One-Pager:** Clarity, Conciseness, Actionability, Stakeholder Alignment, Business Impact
- **COE:** Comprehensiveness, Clarity, Practicality, Measurability, Scalability

### 3. Simulation Tools
- **20-round simulation:** Optimal efficiency (30-60 minutes)
- **40-round simulation:** Maximum quality (60-120 minutes)
- **Batch execution:** Progress tracking and reporting

### 4. Templates and Examples
- **Test cases:** 8 diverse scenarios per project type
- **Configuration:** Production-validated settings
- **Mutation library:** Proven high-impact mutations

### 5. Complete Documentation
- **Getting started guide:** Step-by-step instructions
- **Mutation creation guide:** How to create effective mutations
- **Best practices:** Lessons learned from production use
- **Cross-project comparison:** Compare quality across projects

---

## Quick Start (For Spawned Projects)

```bash
# 1. Navigate to your project
cd my-new-project

# 2. Customize test cases (IMPORTANT!)
vim evolutionary-optimization/test-cases.json

# 3. Run optimization
./tools/quick-start.sh

# 4. Review results
cat evolutionary-optimization/results/optimization-report.md
```

---

## Expected Results

Based on production validation with product-requirements-assistant:

- **Quality Improvement:** +20-30% in 15-20 rounds
- **Execution Time:** 30-60 minutes (20 rounds), 60-120 minutes (40 rounds)
- **Success Rate:** 70-95% mutations kept
- **Optimal Stopping Point:** Round 15-20 (diminishing returns after Round 11)

**Proven Metrics:**
- Baseline: 3.12/5.0
- After 20 rounds: 4.09/5.0 (+31.1% improvement)
- After 40 rounds: 4.18/5.0 (+33.9% improvement)

---

## Proven Mutations

Top 5 mutations (deliver 71-73% of total improvement):

1. **Ban Vague Language** (+6.0%) - Eliminate "improve", "enhance", "better"
2. **Strengthen "No Implementation" Rule** (+5.4%) - Focus on "what", not "how"
3. **Enhance Adversarial Tension** (+2.9%) - Challenge assumptions, not just polish
4. **Stakeholder Impact Requirements** (+2.6%) - Quantify impact per stakeholder
5. **Quantified Success Metrics** (+2.5%) - Baseline + target + timeline + measurement

See `templates/mutations-library.md` for complete catalog.

---

## Directory Structure

```
modules/evolutionary-optimization/
├── README.md (this file)
├── core/
│   └── evolutionary-optimizer.js (core optimization engine)
├── scorers/
│   ├── prd-scorer.js (PRD quality scorer)
│   ├── one-pager-scorer.js (one-pager quality scorer)
│   └── coe-scorer.js (COE quality scorer)
├── templates/
│   ├── test-cases.example.json (test case template)
│   ├── config.example.json (configuration template)
│   ├── mutations-library.md (proven mutations catalog)
│   └── project-types/
│       ├── prd-assistant/ (PRD-specific templates)
│       ├── one-pager/ (one-pager-specific templates)
│       └── coe-generator/ (COE-specific templates)
├── scripts/
│   ├── run-simulation.js (single simulation runner)
│   ├── run-simulations.sh (batch simulation executor)
│   ├── quick-start.sh (simplified entry point)
│   └── compare-projects.sh (cross-project comparison)
└── docs/
    └── GETTING-STARTED.md (comprehensive guide)
```

---

## Cross-Project Comparison

Compare quality across all Genesis projects:

```bash
cd genesis/modules/evolutionary-optimization
./scripts/compare-projects.sh
```

**Example Output:**
```
Project                             Baseline        Optimized       Improvement     Rounds
----------------------------------- --------------- --------------- --------------- ------------
product-requirements-assistant      3.12/5.0        4.09/5.0        +31.1%          20
my-one-pager-project                2.85/5.0        3.75/5.0        +31.6%          20
my-coe-project                      3.05/5.0        3.92/5.0        +28.5%          20
```

---

## Maintenance

This module is maintained in sync with product-requirements-assistant.

**Update Process:**
1. Pull latest from product-requirements-assistant
2. Copy updated files to `modules/evolutionary-optimization/`
3. Test with sample project
4. Update version in this README

**Current Version:** 1.0.0 (2025-11-21)  
**Source Commit:** Initial integration from product-requirements-assistant

---

## Support

- **Reference Implementation:** https://github.com/bordenet/product-requirements-assistant
- **Documentation:** See `docs/` directory
- **Issues:** Report in Genesis repo
- **Questions:** Review `docs/GETTING-STARTED.md` first

---

## Version History

- **v1.0.0** (2025-11-21): Initial integration into Genesis
  - Copied core optimizer from product-requirements-assistant
  - Created project-type-specific scorers (one-pager, COE)
  - Added cross-project comparison tool
  - Documented proven mutations

