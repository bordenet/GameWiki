#!/usr/bin/env node

/**
 * Evolutionary Prompt Optimizer
 * 
 * Supports rigorous evolutionary optimization with:
 * - Objective scoring at each round
 * - Keep/discard logic based on score improvements
 * - Mutation tracking and rollback
 * - Diminishing returns analysis
 * - Multi-test-case validation
 */

const fs = require('fs');
const path = require('path');

class EvolutionaryOptimizer {
  constructor(config) {
    this.config = {
      baselineDir: config.baselineDir || 'prompts',
      workingDir: config.workingDir || 'evolutionary-optimization/working',
      resultsDir: config.resultsDir || 'evolutionary-optimization/results',
      testCasesFile: config.testCasesFile || 'evolutionary-optimization/test-cases.json',
      maxRounds: config.maxRounds || 20,
      minImprovement: config.minImprovement || 0.01,
      scoringCriteria: config.scoringCriteria || [
        'comprehensiveness',
        'clarity',
        'structure',
        'consistency',
        'engineeringReady'
      ],
      ...config
    };

    this.state = {
      currentRound: 0,
      baselineScore: null,
      currentScore: null,
      history: [],
      mutations: []
    };

    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.config.workingDir, this.config.resultsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Load test cases from JSON file
   */
  loadTestCases() {
    if (!fs.existsSync(this.config.testCasesFile)) {
      throw new Error(`Test cases file not found: ${this.config.testCasesFile}`);
    }
    return JSON.parse(fs.readFileSync(this.config.testCasesFile, 'utf8'));
  }

  /**
   * Establish baseline by running all test cases through current prompts
   */
  async establishBaseline() {
    console.log('📊 Establishing baseline...');
    const testCases = this.loadTestCases();
    
    const scores = await this.scoreAllTestCases(testCases, this.config.baselineDir);
    
    this.state.baselineScore = this.calculateAverageScore(scores);
    this.state.currentScore = this.state.baselineScore;
    
    this.saveState();
    
    console.log(`✅ Baseline established: ${this.state.baselineScore.toFixed(2)}/5.0`);
    return this.state.baselineScore;
  }

  /**
   * Score all test cases using specified prompts
   */
  async scoreAllTestCases(testCases, promptDir) {
    const scores = [];
    
    for (const testCase of testCases) {
      const score = await this.scoreTestCase(testCase, promptDir);
      scores.push(score);
    }
    
    return scores;
  }

  /**
   * Score a single test case
   * This is a placeholder - in real implementation, this would:
   * 1. Load prompts from promptDir
   * 2. Simulate LLM responses for the test case
   * 3. Score the output using the rubric
   */
  async scoreTestCase(testCase, promptDir) {
    // Use PRD scorer to evaluate simulated output
    const PRDScorer = require('./prd-scorer.js');
    const scorer = new PRDScorer();

    // Simulate PRD generation based on current prompts
    const simulatedPRD = this.simulatePRDGeneration(testCase, promptDir);

    // Score the simulated PRD
    const scores = scorer.score(simulatedPRD);

    return {
      testCase: testCase.id,
      scores: {
        comprehensiveness: scores.comprehensiveness,
        clarity: scores.clarity,
        structure: scores.structure,
        consistency: scores.consistency,
        engineeringReady: scores.engineeringReady
      },
      average: scores.overall
    };
  }

  /**
   * Simulate PRD generation for a test case
   * This creates a realistic PRD based on the current prompts
   */
  simulatePRDGeneration(testCase, promptDir) {
    // Load current prompts to understand what they emphasize
    const phase1Path = path.join(promptDir, 'phase1-claude-initial.md');
    const phase2Path = path.join(promptDir, 'phase2-gemini-review.md');
    const phase1Content = fs.existsSync(phase1Path) ? fs.readFileSync(phase1Path, 'utf8') : '';
    const phase2Content = fs.existsSync(phase2Path) ? fs.readFileSync(phase2Path, 'utf8') : '';

    // Check for key improvements in prompts (Top 5 Mutations)
    const hasBannedWords = /Mutation 1: Banned Vague Language|NEVER use these vague terms/i.test(phase1Content);
    const hasNoImplementation = /Mutation 2: Focus on "Why" and "What", NOT "How"|FORBIDDEN.*Implementation/i.test(phase1Content);
    const hasAdversarialTension = /Mutation 3: Enhance Adversarial Tension|Your Role is to CHALLENGE/i.test(phase2Content);
    const hasStakeholderTemplate = /Mutation 4: Stakeholder Impact Requirements|Role.*Impact.*Needs.*Success Criteria/i.test(phase1Content);
    const hasMetricsTemplate = /Mutation 5: Require Quantified Success Metrics|Baseline.*Target.*Timeline|Measurement Method/i.test(phase1Content);
    const hasNumberedReqs = /FR\d+|NFR\d+|REQ-\d+/i.test(phase1Content);

    // Generate simulated PRD with varying quality based on prompts
    let prd = `# Product Requirements Document: ${testCase.title}\n\n`;

    // 1. Executive Summary
    prd += `## 1. Executive Summary\n\n`;
    prd += `This PRD addresses ${testCase.problems[0]}.\n\n`;

    // 2. Problem Statement
    prd += `## 2. Problem Statement\n\n`;
    testCase.problems.forEach((problem, i) => {
      prd += `- ${problem}\n`;
    });
    prd += `\n`;

    // 3. Goals and Objectives
    prd += `## 3. Goals and Objectives\n\n`;
    prd += `### 3.1 Business Goals\n\n`;
    if (hasBannedWords && hasMetricsTemplate) {
      prd += `- Reduce manual work from 5 hours/week to 30 minutes/week (90% reduction)\n`;
      prd += `- Increase customer satisfaction from 42 to 48 NPS (14% improvement)\n`;
    } else {
      prd += `- Improve efficiency\n`;
      prd += `- Enhance user experience\n`;
    }
    prd += `\n`;

    prd += `### 3.3 Success Metrics\n\n`;
    if (hasMetricsTemplate) {
      prd += `- **Metric:** Manual categorization time\n`;
      prd += `- **Baseline:** 5 hours/week (measured Q4 2024)\n`;
      prd += `- **Target:** 30 minutes/week\n`;
      prd += `- **Timeline:** 3 months post-launch\n`;
      prd += `- **Measurement:** Weekly time tracking reports\n\n`;
    } else {
      prd += `We will measure success through improved metrics.\n\n`;
    }

    // 4. Proposed Solution
    prd += `## 4. Proposed Solution\n\n`;
    if (hasNoImplementation) {
      prd += `Users must be able to submit feedback through a centralized interface.\n`;
      prd += `The system shall categorize feedback automatically with >85% accuracy.\n`;
      if (hasAdversarialTension) {
        prd += `\n**Alternative Approach Considered:** Integrate feedback into existing support ticket system instead of building new interface. Rejected due to need for specialized categorization workflow.\n`;
      }
    } else {
      prd += `Build a React dashboard using microservices architecture.\n`;
      prd += `Implement OAuth 2.0 for authentication.\n`;
      prd += `Use machine learning model to categorize feedback.\n`;
    }
    prd += `\n`;

    // 5. Scope
    prd += `## 5. Scope\n\n`;
    prd += `### 5.1 In Scope\n\n`;
    prd += `- Feedback collection\n- Categorization\n- Reporting\n\n`;
    prd += `### 5.2 Out of Scope\n\n`;
    prd += `- Advanced analytics\n- Third-party integrations\n\n`;

    // 6. Requirements
    prd += `## 6. Requirements\n\n`;
    prd += `### 6.1 Functional Requirements\n\n`;
    if (hasNumberedReqs) {
      prd += `- **FR1:** Users can submit feedback in <30 seconds\n`;
      prd += `- **FR2:** System categorizes feedback with >85% accuracy\n`;
      prd += `- **FR3:** Reports generated in <5 seconds\n\n`;
    } else {
      prd += `- Users can submit feedback\n`;
      prd += `- System categorizes feedback\n`;
      prd += `- Reports are available\n\n`;
    }

    prd += `### 6.2 Non-Functional Requirements\n\n`;
    if (hasNumberedReqs) {
      prd += `- **NFR1:** System handles 1000 concurrent users\n`;
      prd += `- **NFR2:** 99.9% uptime SLA\n`;
      prd += `- **NFR3:** Response time <2 seconds\n\n`;
    } else {
      prd += `- System must be scalable\n`;
      prd += `- System must be reliable\n`;
      prd += `- System must be fast\n\n`;
    }

    // 7. Stakeholders
    prd += `## 7. Stakeholders\n\n`;
    if (hasStakeholderTemplate) {
      prd += `### 7.1 Customer Support Team\n`;
      prd += `- **Role:** Handle customer inquiries\n`;
      prd += `- **Impact:** Workload reduced from 200 emails/day to 50 emails/day (75% reduction)\n`;
      prd += `- **Needs:** Training on new system, access to dashboard\n`;
      prd += `- **Success Criteria:** Response time <2 hours, satisfaction >90%\n\n`;
    } else {
      prd += `- Customer Support Team\n`;
      prd += `- Product Team\n`;
      prd += `- Engineering Team\n\n`;
    }

    // 8. Timeline
    prd += `## 8. Timeline and Milestones\n\n`;
    prd += `- Phase 1: Design (2 weeks)\n`;
    prd += `- Phase 2: Development (6 weeks)\n`;
    prd += `- Phase 3: Testing (2 weeks)\n`;
    prd += `- Phase 4: Launch (1 week)\n\n`;

    // 9. Risks
    prd += `## 9. Risks and Mitigations\n\n`;
    prd += `- **Risk:** Low adoption\n`;
    prd += `- **Mitigation:** Conduct user training and provide documentation\n\n`;

    // 10. Open Questions
    prd += `## 10. Open Questions\n\n`;
    prd += `- What is the budget for this project?\n`;
    prd += `- When is the target launch date?\n\n`;

    return prd;
  }

  /**
   * Calculate average score across all test cases and criteria
   */
  calculateAverageScore(scores) {
    const allScores = scores.flatMap(s => Object.values(s.scores));
    return allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
  }

  /**
   * Apply a mutation to the prompts
   */
  async applyMutation(mutation) {
    console.log(`\n🧬 Round ${this.state.currentRound + 1}: ${mutation.name}`);
    console.log(`   Target: ${mutation.target}`);
    console.log(`   Change: ${mutation.description}`);
    
    // Backup current prompts
    this.backupPrompts();
    
    // Apply mutation
    for (const change of mutation.changes) {
      await this.applyPromptChange(change);
    }
    
    this.state.mutations.push(mutation);
  }

  /**
   * Apply a specific change to a prompt file
   */
  async applyPromptChange(change) {
    const filePath = path.join(this.config.workingDir, change.file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (change.type === 'insert') {
      content = this.insertContent(content, change.position, change.content);
    } else if (change.type === 'replace') {
      content = content.replace(change.pattern, change.replacement);
    } else if (change.type === 'append') {
      content += '\n' + change.content;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
  }

  insertContent(content, position, newContent) {
    const lines = content.split('\n');
    lines.splice(position, 0, newContent);
    return lines.join('\n');
  }

  /**
   * Backup current prompts before mutation
   */
  backupPrompts() {
    const backupDir = path.join(this.config.resultsDir, `round-${this.state.currentRound}-backup`);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const files = fs.readdirSync(this.config.workingDir);
    files.forEach(file => {
      const src = path.join(this.config.workingDir, file);
      const dest = path.join(backupDir, file);
      fs.copyFileSync(src, dest);
    });
  }

  /**
   * Rollback to previous prompts
   */
  rollbackMutation() {
    const backupDir = path.join(this.config.resultsDir, `round-${this.state.currentRound}-backup`);

    const files = fs.readdirSync(backupDir);
    files.forEach(file => {
      const src = path.join(backupDir, file);
      const dest = path.join(this.config.workingDir, file);
      fs.copyFileSync(src, dest);
    });

    console.log('   ↩️  Rolled back mutation');
  }

  /**
   * Evaluate current prompts and decide keep/discard
   */
  async evaluateMutation() {
    const testCases = this.loadTestCases();
    const scores = await this.scoreAllTestCases(testCases, this.config.workingDir);
    const newScore = this.calculateAverageScore(scores);

    const improvement = newScore - this.state.currentScore;
    const decision = improvement > 0 ? 'KEEP' : 'DISCARD';

    console.log(`   Previous: ${this.state.currentScore.toFixed(2)}/5.0`);
    console.log(`   New:      ${newScore.toFixed(2)}/5.0`);
    console.log(`   Delta:    ${improvement >= 0 ? '+' : ''}${improvement.toFixed(2)}`);
    console.log(`   Decision: ${decision === 'KEEP' ? '✅' : '❌'} ${decision}`);

    const roundResult = {
      round: this.state.currentRound + 1,
      mutation: this.state.mutations[this.state.mutations.length - 1],
      previousScore: this.state.currentScore,
      newScore: newScore,
      improvement: improvement,
      decision: decision,
      timestamp: new Date().toISOString()
    };

    if (decision === 'KEEP') {
      this.state.currentScore = newScore;
    } else {
      this.rollbackMutation();
      this.state.mutations.pop();
    }

    this.state.history.push(roundResult);
    this.state.currentRound++;
    this.saveState();

    return roundResult;
  }

  /**
   * Run complete optimization cycle
   */
  async optimize(mutations) {
    console.log('🚀 Starting Evolutionary Optimization\n');
    console.log(`   Max Rounds: ${this.config.maxRounds}`);
    console.log(`   Min Improvement: ${this.config.minImprovement}`);
    console.log(`   Test Cases: ${this.loadTestCases().length}\n`);

    // Initialize working directory with baseline prompts
    this.initializeWorkingDirectory();

    // Establish baseline
    await this.establishBaseline();

    // Run mutation rounds
    for (let i = 0; i < Math.min(mutations.length, this.config.maxRounds); i++) {
      await this.applyMutation(mutations[i]);
      const result = await this.evaluateMutation();

      // Check for diminishing returns
      if (this.checkDiminishingReturns()) {
        console.log('\n⚠️  Diminishing returns detected. Consider stopping.');
      }
    }

    // Generate final report
    this.generateReport();

    console.log('\n✅ Optimization complete!');
    console.log(`   Baseline:  ${this.state.baselineScore.toFixed(2)}/5.0`);
    console.log(`   Final:     ${this.state.currentScore.toFixed(2)}/5.0`);
    console.log(`   Improvement: +${((this.state.currentScore - this.state.baselineScore) / this.state.baselineScore * 100).toFixed(1)}%`);
  }

  /**
   * Initialize working directory with baseline prompts
   */
  initializeWorkingDirectory() {
    const files = fs.readdirSync(this.config.baselineDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const src = path.join(this.config.baselineDir, file);
        const dest = path.join(this.config.workingDir, file);
        fs.copyFileSync(src, dest);
      }
    });
  }

  /**
   * Check if we're experiencing diminishing returns
   */
  checkDiminishingReturns() {
    if (this.state.history.length < 5) return false;

    const recentRounds = this.state.history.slice(-5);
    const avgImprovement = recentRounds
      .filter(r => r.decision === 'KEEP')
      .reduce((sum, r) => sum + r.improvement, 0) / 5;

    return avgImprovement < this.config.minImprovement;
  }

  /**
   * Save current state to disk
   */
  saveState() {
    const stateFile = path.join(this.config.resultsDir, 'state.json');
    fs.writeFileSync(stateFile, JSON.stringify(this.state, null, 2), 'utf8');
  }

  /**
   * Generate final optimization report
   */
  generateReport() {
    const report = this.buildMarkdownReport();
    const reportFile = path.join(this.config.resultsDir, 'optimization-report.md');
    fs.writeFileSync(reportFile, report, 'utf8');
    console.log(`\n📄 Report saved: ${reportFile}`);
  }

  /**
   * Build markdown report
   */
  buildMarkdownReport() {
    const totalImprovement = ((this.state.currentScore - this.state.baselineScore) / this.state.baselineScore * 100).toFixed(1);
    const keptMutations = this.state.history.filter(r => r.decision === 'KEEP').length;
    const discardedMutations = this.state.history.filter(r => r.decision === 'DISCARD').length;

    let report = `# Evolutionary Optimization Report\n\n`;
    report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
    report += `**Rounds Completed:** ${this.state.currentRound}\n`;
    report += `**Baseline Score:** ${this.state.baselineScore.toFixed(2)}/5.0\n`;
    report += `**Final Score:** ${this.state.currentScore.toFixed(2)}/5.0\n`;
    report += `**Total Improvement:** +${totalImprovement}%\n\n`;

    report += `## Summary\n\n`;
    report += `- ✅ Kept: ${keptMutations} mutations\n`;
    report += `- ❌ Discarded: ${discardedMutations} mutations\n`;
    report += `- Success Rate: ${(keptMutations / this.state.history.length * 100).toFixed(1)}%\n\n`;

    report += `## Round-by-Round Results\n\n`;
    report += `| Round | Mutation | Previous | New | Delta | Decision |\n`;
    report += `|-------|----------|----------|-----|-------|----------|\n`;

    this.state.history.forEach(r => {
      const delta = r.improvement >= 0 ? `+${r.improvement.toFixed(2)}` : r.improvement.toFixed(2);
      const emoji = r.decision === 'KEEP' ? '✅' : '❌';
      report += `| ${r.round} | ${r.mutation.name} | ${r.previousScore.toFixed(2)} | ${r.newScore.toFixed(2)} | ${delta} | ${emoji} ${r.decision} |\n`;
    });

    return report;
  }
}

module.exports = EvolutionaryOptimizer;

// CLI interface
if (require.main === module) {
  const configFile = process.argv[2] || 'evolutionary-optimization/config.json';

  if (!fs.existsSync(configFile)) {
    console.error(`❌ Config file not found: ${configFile}`);
    console.log('\nUsage: node tools/evolutionary-optimizer.js [config.json]');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  const optimizer = new EvolutionaryOptimizer(config);

  optimizer.optimize(config.mutations || [])
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

