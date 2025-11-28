#!/usr/bin/env node

/**
 * COE (Center of Excellence) Scorer
 *
 * Evaluates COE document quality using objective criteria:
 * - Comprehensiveness: Covers all COE aspects (governance, standards, training)
 * - Clarity: Roles and responsibilities unambiguous
 * - Practicality: Implementable processes, not theoretical
 * - Measurability: Clear KPIs and success metrics
 * - Scalability: Works for current and future team sizes
 */

class COEScorer {
  constructor() {
    this.criteria = {
      comprehensiveness: {
        weight: 1.0,
        checks: [
          { name: 'Has governance model', pattern: /governance|decision.*framework|authority/i },
          { name: 'Has standards/best practices', pattern: /standard|best practice|guideline|policy/i },
          { name: 'Has training/enablement', pattern: /training|enablement|onboarding|education/i },
          { name: 'Has roles and responsibilities', pattern: /role|responsibility|RACI|DRI/i },
          { name: 'Has communication plan', pattern: /communication|meeting|sync|cadence/i },
          { name: 'Has tooling/infrastructure', pattern: /tool|platform|infrastructure|system/i },
          { name: 'Has metrics/KPIs', pattern: /KPI|metric|measure|track/i },
          { name: 'Covers all COE pillars', scorer: this.checkCOEPillars.bind(this) }
        ]
      },
      clarity: {
        weight: 1.0,
        checks: [
          { name: 'Clear role definitions', pattern: /role.*:|responsibility.*:|accountable for/i },
          { name: 'Unambiguous ownership', pattern: /owner|DRI|responsible party|lead/i },
          { name: 'No vague "improve"', pattern: /\bimprove\b(?!\s+from)/i, inverse: true },
          { name: 'No vague "enhance"', pattern: /\benhance\b(?!\s+from)/i, inverse: true },
          { name: 'No vague "better"', pattern: /\bbetter\b/i, inverse: true },
          { name: 'Specific processes', pattern: /process:|workflow:|procedure:|step \d+/i },
          { name: 'Clear decision criteria', pattern: /decision.*criteria|approval.*process|escalation/i },
          { name: 'Defined scope', pattern: /in scope|out of scope|covers|includes/i }
        ]
      },
      practicality: {
        weight: 1.0,
        checks: [
          { name: 'Actionable processes', pattern: /step|action|task|deliverable/i },
          { name: 'Realistic timelines', pattern: /week|month|quarter|phase|milestone/i },
          { name: 'Resource requirements', pattern: /resource|headcount|budget|cost/i },
          { name: 'No theoretical fluff', scorer: this.checkPracticalFocus.bind(this) },
          { name: 'Has templates/examples', pattern: /template|example|sample|checklist/i },
          { name: 'Integration with existing', pattern: /integrate|existing|current|leverage/i }
        ]
      },
      measurability: {
        weight: 1.0,
        checks: [
          { name: 'Has quantified KPIs', pattern: /\d+%|\d+x|<\d+|>\d+/i },
          { name: 'Baseline metrics', pattern: /baseline|current state|as-is/i },
          { name: 'Target metrics', pattern: /target|goal|objective|aim for/i },
          { name: 'Measurement method', pattern: /measure|track|monitor|report/i },
          { name: 'Success criteria', pattern: /success.*criteria|success.*metric|definition of done/i },
          { name: 'Review cadence', pattern: /review|retrospective|assessment|audit/i }
        ]
      },
      scalability: {
        weight: 1.0,
        checks: [
          { name: 'Addresses team growth', pattern: /scale|grow|expand|increase.*team/i },
          { name: 'Flexible processes', pattern: /adapt|flexible|adjust|customize/i },
          { name: 'Automation mentioned', pattern: /automate|self-service|tooling/i },
          { name: 'Onboarding process', pattern: /onboard|ramp.*up|new.*hire|new.*member/i },
          { name: 'Knowledge management', pattern: /document|wiki|knowledge.*base|runbook/i },
          { name: 'Future considerations', pattern: /future|roadmap|evolution|next.*phase/i }
        ]
      }
    };
  }

  /**
   * Score a COE document
   */
  score(content) {
    const scores = {};
    let totalScore = 0;
    let totalWeight = 0;

    for (const [criterion, config] of Object.entries(this.criteria)) {
      const criterionScore = this.scoreCriterion(content, config);
      scores[criterion] = criterionScore;
      totalScore += criterionScore * config.weight;
      totalWeight += config.weight;
    }

    scores.overall = totalScore / totalWeight;
    scores.details = this.getDetailedScores(content);

    return scores;
  }

  /**
   * Score a single criterion
   */
  scoreCriterion(content, config) {
    let passed = 0;
    const total = config.checks.length;

    for (const check of config.checks) {
      if (check.scorer) {
        // Custom scorer function
        if (check.scorer(content)) passed++;
      } else if (check.pattern) {
        // Pattern-based check
        const matches = check.pattern.test(content);
        const shouldMatch = !check.inverse;
        if (matches === shouldMatch) passed++;
      }
    }

    // Convert to 1-5 scale
    return 1 + (passed / total) * 4;
  }

  /**
   * Check if all COE pillars are covered
   */
  checkCOEPillars(content) {
    const hasGovernance = /governance|decision|authority/i.test(content);
    const hasStandards = /standard|best practice|guideline/i.test(content);
    const hasTraining = /training|enablement|education/i.test(content);
    const hasTools = /tool|platform|infrastructure/i.test(content);

    // At least 3 of 4 pillars should be present
    const pillarsPresent = [hasGovernance, hasStandards, hasTraining, hasTools].filter(Boolean).length;
    return pillarsPresent >= 3;
  }

  /**
   * Check if document focuses on practical implementation
   */
  checkPracticalFocus(content) {
    // Check for theoretical/academic language
    const hasTheoreticalFluff = /in theory|ideally|conceptually|philosophically/i.test(content);
    const hasActionableContent = /step|action|implement|execute|deliver/i.test(content);

    return !hasTheoreticalFluff && hasActionableContent;
  }

  /**
   * Get detailed scores for each check
   */
  getDetailedScores(content) {
    const details = {};

    for (const [criterion, config] of Object.entries(this.criteria)) {
      details[criterion] = [];

      for (const check of config.checks) {
        let passed = false;

        if (check.scorer) {
          passed = check.scorer(content);
        } else if (check.pattern) {
          const matches = check.pattern.test(content);
          passed = check.inverse ? !matches : matches;
        }

        details[criterion].push({
          name: check.name,
          passed: passed
        });
      }
    }

    return details;
  }

  /**
   * Generate a human-readable report
   */
  generateReport(scores) {
    let report = '# COE Quality Score Report\n\n';
    report += `**Overall Score:** ${scores.overall.toFixed(2)}/5.0\n\n`;

    report += '## Scores by Criterion\n\n';
    for (const [criterion, score] of Object.entries(scores)) {
      if (criterion !== 'overall' && criterion !== 'details') {
        const percentage = ((score - 1) / 4 * 100).toFixed(0);
        report += `- **${this.formatCriterionName(criterion)}:** ${score.toFixed(2)}/5.0 (${percentage}%)\n`;
      }
    }

    report += '\n## Detailed Checks\n\n';
    for (const [criterion, checks] of Object.entries(scores.details)) {
      report += `### ${this.formatCriterionName(criterion)}\n\n`;
      for (const check of checks) {
        const emoji = check.passed ? '✅' : '❌';
        report += `${emoji} ${check.name}\n`;
      }
      report += '\n';
    }

    return report;
  }

  formatCriterionName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

module.exports = COEScorer;

// CLI interface
if (require.main === module) {
  const fs = require('fs');
  const coeFile = process.argv[2];

  if (!coeFile || !fs.existsSync(coeFile)) {
    console.error('❌ Usage: node tools/coe-scorer.js <coe-file.md>');
    process.exit(1);
  }

  const content = fs.readFileSync(coeFile, 'utf8');
  const scorer = new COEScorer();
  const scores = scorer.score(content);
  const report = scorer.generateReport(scores);

  console.log(report);
}

