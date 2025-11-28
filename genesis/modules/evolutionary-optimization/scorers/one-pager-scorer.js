#!/usr/bin/env node

/**
 * One-Pager Scorer
 *
 * Evaluates one-pager quality using objective criteria:
 * - Clarity: Problem statement is unambiguous and specific
 * - Conciseness: Fits on one page, no fluff
 * - Actionability: Clear next steps and success criteria
 * - Stakeholder Alignment: Addresses all stakeholder concerns
 * - Business Impact: Quantified value proposition
 */

class OnePagerScorer {
  constructor() {
    this.criteria = {
      clarity: {
        weight: 1.0,
        checks: [
          { name: 'Has clear problem statement', pattern: /##\s+Problem|##\s+Challenge|##\s+Opportunity/i },
          { name: 'Has proposed solution', pattern: /##\s+Solution|##\s+Proposal|##\s+Approach/i },
          { name: 'No vague "improve"', pattern: /\bimprove\b(?!\s+from)/i, inverse: true },
          { name: 'No vague "enhance"', pattern: /\benhance\b(?!\s+from)/i, inverse: true },
          { name: 'No vague "better"', pattern: /\bbetter\b/i, inverse: true },
          { name: 'No vague "optimize"', pattern: /\boptimize\b(?!\s+for)/i, inverse: true },
          { name: 'Has specific metrics', pattern: /baseline|target|from \d+ to \d+/i },
          { name: 'Has quantified goals', pattern: /\d+%|\d+x|<\d+|>\d+|\$\d+/i }
        ]
      },
      conciseness: {
        weight: 1.0,
        checks: [
          { name: 'Reasonable length', scorer: this.checkLength.bind(this) },
          { name: 'No metadata table', pattern: /\|\s*Author\s*\||\|\s*Version\s*\|/i, inverse: true },
          { name: 'No excessive detail', scorer: this.checkDetailLevel.bind(this) },
          { name: 'Focused scope', pattern: /out of scope|not included|future consideration/i },
          { name: 'Clear structure', pattern: /^##\s+/m }
        ]
      },
      actionability: {
        weight: 1.0,
        checks: [
          { name: 'Has next steps', pattern: /##\s+Next Steps|##\s+Action Items|##\s+Timeline/i },
          { name: 'Has success criteria', pattern: /success criteria|success metrics|how we measure/i },
          { name: 'Has timeline', pattern: /Q\d|week|month|by \d{4}|timeline/i },
          { name: 'Has ownership', pattern: /owner|responsible|lead|DRI/i },
          { name: 'Specific actions', pattern: /will|must|should|need to/i },
          { name: 'No vague "explore"', pattern: /\bexplore\b(?!\s+by)/i, inverse: true },
          { name: 'No vague "consider"', pattern: /\bconsider\b(?!\s+by)/i, inverse: true }
        ]
      },
      stakeholderAlignment: {
        weight: 1.0,
        checks: [
          { name: 'Identifies stakeholders', pattern: /stakeholder|audience|team|department/i },
          { name: 'Addresses concerns', scorer: this.checkStakeholderConcerns.bind(this) },
          { name: 'Shows impact per group', pattern: /impact on|benefit to|value for/i },
          { name: 'Has buy-in section', pattern: /alignment|approval|sign-off|consensus/i }
        ]
      },
      businessImpact: {
        weight: 1.0,
        checks: [
          { name: 'Quantifies value', pattern: /\$\d+|save \d+|reduce.*\d+%|increase.*\d+%/i },
          { name: 'Has ROI or cost-benefit', pattern: /ROI|cost|benefit|savings|revenue/i },
          { name: 'Links to business goals', pattern: /business goal|strategic|objective|OKR|KPI/i },
          { name: 'Shows urgency', pattern: /why now|timing|opportunity|risk of delay/i },
          { name: 'Competitive context', pattern: /competitor|market|industry|benchmark/i }
        ]
      }
    };
  }

  /**
   * Score a one-pager document
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
   * Check document length (should fit on one page)
   */
  checkLength(content) {
    const lines = content.split('\n').length;
    const words = content.split(/\s+/).length;

    // One page ~= 500-800 words or ~50-80 lines
    return words <= 1000 && lines <= 100;
  }

  /**
   * Check detail level (should be high-level, not overly detailed)
   */
  checkDetailLevel(content) {
    // Check for excessive technical detail
    const hasTooManySubsections = (content.match(/###/g) || []).length > 10;
    const hasTooManyBullets = (content.match(/^[\s]*[-*]/gm) || []).length > 30;

    return !hasTooManySubsections && !hasTooManyBullets;
  }

  /**
   * Check if stakeholder concerns are addressed
   */
  checkStakeholderConcerns(content) {
    const hasStakeholders = /stakeholder|audience|team/i.test(content);
    const addressesConcerns = /concern|risk|challenge|objection/i.test(content);
    const showsImpact = /impact|benefit|value/i.test(content);

    return hasStakeholders && (addressesConcerns || showsImpact);
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
    let report = '# One-Pager Quality Score Report\n\n';
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

module.exports = OnePagerScorer;

// CLI interface
if (require.main === module) {
  const fs = require('fs');
  const onePagerFile = process.argv[2];

  if (!onePagerFile || !fs.existsSync(onePagerFile)) {
    console.error('❌ Usage: node tools/one-pager-scorer.js <one-pager-file.md>');
    process.exit(1);
  }

  const content = fs.readFileSync(onePagerFile, 'utf8');
  const scorer = new OnePagerScorer();
  const scores = scorer.score(content);
  const report = scorer.generateReport(scores);

  console.log(report);
}

