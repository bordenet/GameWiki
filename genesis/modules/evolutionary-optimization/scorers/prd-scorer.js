#!/usr/bin/env node

/**
 * PRD Scorer
 * 
 * Evaluates PRD quality using objective criteria:
 * - Comprehensiveness: Covers all necessary PRD aspects
 * - Clarity: Requirements unambiguous and specific
 * - Structure: Proper section numbering
 * - Consistency: Aligned across all phases
 * - Engineering-Ready: Focuses on "why" and "what", avoids "how"
 */

class PRDScorer {
  constructor() {
    this.criteria = {
      comprehensiveness: {
        weight: 1.0,
        checks: [
          { name: 'Has Executive Summary', pattern: /##\s+1\.\s+Executive Summary/i },
          { name: 'Has Problem Statement', pattern: /##\s+2\.\s+Problem Statement/i },
          { name: 'Has Goals and Objectives', pattern: /##\s+3\.\s+Goals/i },
          { name: 'Has Success Metrics', pattern: /Success Metrics/i },
          { name: 'Has Requirements', pattern: /##\s+6\.\s+Requirements/i },
          { name: 'Has Stakeholders', pattern: /##\s+7\.\s+Stakeholders/i },
          { name: 'Has Risks', pattern: /##\s+9\.\s+Risks/i },
          { name: 'Quantifies Impact', pattern: /\d+%|\$\d+|from \d+ to \d+/i }
        ]
      },
      clarity: {
        weight: 1.0,
        checks: [
          { name: 'No vague "improve"', pattern: /\bimprove\b(?!\s+from)/i, inverse: true },
          { name: 'No vague "enhance"', pattern: /\benhance\b(?!\s+from)/i, inverse: true },
          { name: 'No vague "user-friendly"', pattern: /user-friendly/i, inverse: true },
          { name: 'No vague "better"', pattern: /\bbetter\b/i, inverse: true },
          { name: 'No vague "optimize"', pattern: /\boptimize\b(?!\s+for)/i, inverse: true },
          { name: 'No vague "faster"', pattern: /\bfaster\b(?!\s+\()/i, inverse: true },
          { name: 'No vague "easier"', pattern: /\beasier\b(?!\s+\()/i, inverse: true },
          { name: 'Has specific metrics', pattern: /baseline|target|from \d+ to \d+/i },
          { name: 'Has quantified goals', pattern: /\d+%|\d+x|<\d+|>\d+/i },
          { name: 'Requirements are numbered', pattern: /FR\d+|NFR\d+|REQ-\d+/i }
        ]
      },
      structure: {
        weight: 1.0,
        checks: [
          { name: 'Uses section numbering', pattern: /##\s+\d+\./i },
          { name: 'Uses subsection numbering', pattern: /###\s+\d+\.\d+/i },
          { name: 'No metadata table', pattern: /\|\s*Author\s*\||\|\s*Version\s*\|/i, inverse: true },
          { name: 'Has markdown headers', pattern: /^##\s+/m },
          { name: 'Proper hierarchy', pattern: /##\s+\d+\..*\n[\s\S]*?###\s+\d+\.\d+/i }
        ]
      },
      consistency: {
        weight: 1.0,
        checks: [
          { name: 'Metrics align with goals', scorer: this.checkMetricsAlignment.bind(this) },
          { name: 'Requirements support solution', scorer: this.checkRequirementsSolution.bind(this) },
          { name: 'Stakeholders in requirements', scorer: this.checkStakeholderRequirements.bind(this) },
          { name: 'Risks have mitigations', pattern: /mitigation|mitigate|address/i }
        ]
      },
      engineeringReady: {
        weight: 1.0,
        checks: [
          { name: 'No "use microservices"', pattern: /use microservices|microservices architecture/i, inverse: true },
          { name: 'No "implement OAuth"', pattern: /implement OAuth|use OAuth/i, inverse: true },
          { name: 'No "store in PostgreSQL"', pattern: /store in PostgreSQL|use PostgreSQL|use MySQL|use MongoDB/i, inverse: true },
          { name: 'No "build React dashboard"', pattern: /build.*React|use React|use Angular|use Vue/i, inverse: true },
          { name: 'No "use ML model"', pattern: /use.*machine learning|ML model|train.*model/i, inverse: true },
          { name: 'No "deploy to AWS"', pattern: /deploy to AWS|use AWS Lambda|use Azure|use GCP/i, inverse: true },
          { name: 'No "implement REST API"', pattern: /implement REST|REST API|GraphQL API/i, inverse: true },
          { name: 'No "use Redis"', pattern: /use Redis|Redis cache|Memcached/i, inverse: true },
          { name: 'Focuses on outcomes', pattern: /must be able to|users can|system shall|system must/i }
        ]
      }
    };
  }

  /**
   * Score a PRD document
   */
  score(prdContent) {
    const scores = {};
    let totalScore = 0;
    let totalWeight = 0;

    for (const [criterion, config] of Object.entries(this.criteria)) {
      const criterionScore = this.scoreCriterion(prdContent, config);
      scores[criterion] = criterionScore;
      totalScore += criterionScore * config.weight;
      totalWeight += config.weight;
    }

    scores.overall = totalScore / totalWeight;
    scores.details = this.getDetailedScores(prdContent);

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
   * Check if metrics align with goals
   */
  checkMetricsAlignment(content) {
    const hasGoals = /##\s+3\.\s+Goals/i.test(content);
    const hasMetrics = /Success Metrics/i.test(content);
    const metricsHaveBaseline = /baseline|current state|from \d+/i.test(content);
    
    return hasGoals && hasMetrics && metricsHaveBaseline;
  }

  /**
   * Check if requirements support the solution
   */
  checkRequirementsSolution(content) {
    const hasSolution = /##\s+4\.\s+.*Solution/i.test(content);
    const hasRequirements = /##\s+6\.\s+Requirements/i.test(content);
    const requirementsAreNumbered = /FR\d+|NFR\d+|REQ-\d+/i.test(content);
    
    return hasSolution && hasRequirements && requirementsAreNumbered;
  }

  /**
   * Check if stakeholders are referenced in requirements
   */
  checkStakeholderRequirements(content) {
    const hasStakeholders = /##\s+7\.\s+Stakeholders/i.test(content);
    const stakeholdersHaveRoles = /Role:|Impact:|Needs:/i.test(content);
    
    return hasStakeholders && stakeholdersHaveRoles;
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
    let report = '# PRD Quality Score Report\n\n';
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

module.exports = PRDScorer;

// CLI interface
if (require.main === module) {
  const fs = require('fs');
  const prdFile = process.argv[2];

  if (!prdFile || !fs.existsSync(prdFile)) {
    console.error('❌ Usage: node tools/prd-scorer.js <prd-file.md>');
    process.exit(1);
  }

  const content = fs.readFileSync(prdFile, 'utf8');
  const scorer = new PRDScorer();
  const scores = scorer.score(content);
  const report = scorer.generateReport(scores);

  console.log(report);
}

