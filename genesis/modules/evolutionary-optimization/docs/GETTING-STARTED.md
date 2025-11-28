# Evolutionary Prompt Optimization Tools

Rigorous, objective tooling for evolutionary prompt optimization with intermediate scoring and keep/discard logic.

## Overview

This tooling supports the **hybrid approach** combining:
1. **8-Phase Generalized Tuning** for rapid initial improvements
2. **Evolutionary Optimization** for rigorous, iterative refinement with objective scoring

## Tools

### 1. `evolutionary-optimizer.js`

Main optimization engine that:
- Establishes baseline scores across multiple test cases
- Applies mutations iteratively
- Scores each mutation objectively
- Keeps improvements, discards regressions
- Tracks diminishing returns
- Generates comprehensive reports

**Usage:**
```bash
node tools/evolutionary-optimizer.js evolutionary-optimization/config.json
```

### 2. `prd-scorer.js`

Objective PRD quality scorer that evaluates:
- **Comprehensiveness** (1-5): Covers all necessary PRD aspects
- **Clarity** (1-5): Requirements unambiguous and specific
- **Structure** (1-5): Proper section numbering
- **Consistency** (1-5): Aligned across all phases
- **Engineering-Ready** (1-5): Focuses on "why" and "what", avoids "how"

**Usage:**
```bash
# Score a single PRD
node tools/prd-scorer.js path/to/prd.md

# Example output:
# Overall Score: 4.2/5.0
# - Comprehensiveness: 4.5/5.0 (88%)
# - Clarity: 4.0/5.0 (75%)
# - Structure: 5.0/5.0 (100%)
# - Consistency: 4.2/5.0 (80%)
# - Engineering-Ready: 3.5/5.0 (63%)
```

## Configuration

### `evolutionary-optimization/config.json`

Main configuration file (see `config.example.json` for template):

```json
{
  "baselineDir": "prompts",
  "workingDir": "evolutionary-optimization/working",
  "resultsDir": "evolutionary-optimization/results",
  "testCasesFile": "evolutionary-optimization/test-cases.json",
  "maxRounds": 20,
  "minImprovement": 0.01,
  "scoringCriteria": [
    "comprehensiveness",
    "clarity",
    "structure",
    "consistency",
    "engineeringReady"
  ],
  "mutations": [...]
}
```

### `evolutionary-optimization/test-cases.json`

Test cases for validation (8 diverse scenarios):
- B2B SaaS (Simple)
- Mobile App (Medium)
- API Platform (High Complexity)
- Internal Tool (Low Complexity)
- E-Commerce (Integration Focus)
- Healthcare (Compliance Heavy)
- FinTech (Security Critical)
- Enterprise Migration (Very High Complexity)

## Workflow

### Step 1: Establish Baseline

```bash
# Copy current prompts to working directory
cp prompts/*.md evolutionary-optimization/working/

# Run baseline scoring
node tools/evolutionary-optimizer.js evolutionary-optimization/config.json
```

The optimizer will:
1. Load all test cases
2. Simulate PRD generation for each test case
3. Score each output using objective criteria
4. Calculate baseline average score

### Step 2: Define Mutations

Edit `config.json` to add mutations:

```json
{
  "name": "Ban Vague Language",
  "target": "Clarity",
  "description": "Add explicit banned words list",
  "changes": [
    {
      "file": "phase1-claude-initial.md",
      "type": "insert",
      "position": 18,
      "content": "## Banned Vague Language\n\n..."
    }
  ]
}
```

**Mutation Types:**
- `insert`: Insert content at specific line
- `replace`: Replace pattern with new content
- `append`: Append content to end of file

### Step 3: Run Optimization

```bash
node tools/evolutionary-optimizer.js evolutionary-optimization/config.json
```

For each mutation:
1. ✅ Apply mutation to working prompts
2. 📊 Score all test cases with mutated prompts
3. 🧮 Calculate new average score
4. ⚖️ Decision: if new_score > previous_score: KEEP, else: DISCARD
5. 📝 Log result and continue

### Step 4: Review Results

Check `evolutionary-optimization/results/`:
- `optimization-report.md` - Complete results
- `state.json` - Current optimization state
- `round-N-backup/` - Backups of each round

### Step 5: Deploy Winners

```bash
# Copy optimized prompts to production
cp evolutionary-optimization/working/*.md prompts/

# Commit changes
git add prompts/
git commit -m "Deploy evolutionary-optimized prompts (+X% improvement)"
```

## Mutation Library

### High-Impact Mutations (Proven)

1. **Ban Vague Language** (+6.0%)
   - Target: Clarity
   - Adds explicit forbidden words with required alternatives

2. **Strengthen "No Implementation" Rule** (+5.4%)
   - Target: Engineering-Ready
   - Shows forbidden vs. allowed examples

3. **Enhance Adversarial Tension** (+2.9%)
   - Target: Consistency
   - Makes Phase 2 genuinely challenge Phase 1

4. **Stakeholder Impact Requirements** (+2.6%)
   - Target: Comprehensiveness
   - Requires quantified impact for each stakeholder

5. **Quantified Success Metrics** (+2.5%)
   - Target: Comprehensiveness
   - Requires baseline + target + timeline + measurement

### Low-Impact Mutations (Diminishing Returns)

- Scope boundary examples (+0.0%)
- Edge case coverage (+0.01%)
- Over-specification templates (+0.01%)

## Best Practices

### When to Use Evolutionary Optimization

✅ **Use when:**
- You need scientifically validated improvements
- You have diverse test cases (5-8 minimum)
- You want transferable insights for future projects
- You need to prove methodology effectiveness

❌ **Don't use when:**
- You need quick wins (use 8-phase instead)
- You have only 1-2 test cases
- Baseline is already very high (>4.5/5)

### Optimal Iteration Count

**Recommendation: 15-20 rounds**

**Evidence:**
- Rounds 1-10: +0.101 improvement per round
- Rounds 11-20: +0.013 improvement per round
- Rounds 21-40: +0.005 improvement per round

**Diminishing returns start around Round 11.**

### Hybrid Approach (Recommended)

1. **Quick Assessment** (8-Phase, 30 min)
   - Identify weakest phase
   - Get rapid improvements

2. **Targeted Optimization** (Evolutionary, 15-20 rounds)
   - Apply to weakest phase
   - Use objective scoring
   - Stop at diminishing returns

3. **Validation** (8-Phase)
   - Evaluate final results
   - Document and deploy

**Expected Outcome:** 90%+ of improvement in 40-60 minutes

## Troubleshooting

### "No improvement detected"

- Check if baseline is already very high (>4.5/5)
- Verify mutations are actually being applied
- Review test case diversity (need 5-8 cases)

### "All mutations discarded"

- Mutations may be too aggressive
- Try smaller, incremental changes
- Check if scoring criteria align with mutations

### "Diminishing returns too early"

- May have reached optimal quality for test cases
- Consider adding more diverse/complex test cases
- Review if mutations target actual weaknesses

## Contributing

To add new mutations:
1. Identify weakness in baseline scores
2. Design targeted mutation
3. Add to `config.json`
4. Test on diverse cases
5. Document results

## License

Same as parent project.

