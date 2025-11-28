/**
 * Workflow Module
 * Manages the {{PHASE_COUNT}}-phase workflow for {{PROJECT_TITLE}}
 */

export const WORKFLOW_CONFIG = {
    phaseCount: {{PHASE_COUNT}},
    phases: [
        {{#each PHASES}}
        {
            number: {{number}},
            name: '{{name}}',
            aiModel: '{{ai_model}}',
            promptFile: '{{prompt_file}}',
            description: '{{description}}'
        }{{#unless @last}},{{/unless}}
        {{/each}}
    ]
};

export class Workflow {
    constructor(project) {
        this.project = project;
        this.currentPhase = project.phase || 1;
    }

    /**
     * Get current phase configuration
     */
    getCurrentPhase() {
        return WORKFLOW_CONFIG.phases.find(p => p.number === this.currentPhase);
    }

    /**
     * Get next phase configuration
     */
    getNextPhase() {
        if (this.currentPhase >= WORKFLOW_CONFIG.phaseCount) {
            return null;
        }
        return WORKFLOW_CONFIG.phases.find(p => p.number === this.currentPhase + 1);
    }

    /**
     * Check if workflow is complete
     */
    isComplete() {
        return this.currentPhase > WORKFLOW_CONFIG.phaseCount;
    }

    /**
     * Advance to next phase
     */
    advancePhase() {
        if (this.currentPhase < WORKFLOW_CONFIG.phaseCount) {
            this.currentPhase++;
            this.project.phase = this.currentPhase;
            return true;
        }
        return false;
    }

    /**
     * Go back to previous phase
     */
    previousPhase() {
        if (this.currentPhase > 1) {
            this.currentPhase--;
            this.project.phase = this.currentPhase;
            return true;
        }
        return false;
    }

    /**
     * Generate prompt for current phase
     */
    async generatePrompt() {
        const phase = this.getCurrentPhase();
        
        // Load prompt template
        const response = await fetch(`../${phase.promptFile}`);
        let template = await response.text();

        // Replace variables in template
        template = this.replaceVariables(template);

        return template;
    }

    /**
     * Replace variables in prompt template
     */
    replaceVariables(template) {
        let result = template;

        // Replace project-specific variables
        result = result.replace(/\{project_title\}/g, this.project.title || '');
        result = result.replace(/\{project_description\}/g, this.project.description || '');
        result = result.replace(/\{user_context\}/g, this.project.context || '');

        // Replace phase outputs
        for (let i = 1; i < this.currentPhase; i++) {
            const phaseKey = `phase${i}_output`;
            const phaseOutput = this.project[phaseKey] || '';
            result = result.replace(new RegExp(`\\{${phaseKey}\\}`, 'g'), phaseOutput);
        }

        return result;
    }

    /**
     * Save phase output
     */
    savePhaseOutput(output) {
        const phaseKey = `phase${this.currentPhase}_output`;
        this.project[phaseKey] = output;
        this.project.updatedAt = new Date().toISOString();
    }

    /**
     * Get phase output
     */
    getPhaseOutput(phaseNumber) {
        const phaseKey = `phase${phaseNumber}_output`;
        return this.project[phaseKey] || '';
    }

    /**
     * Export final output as Markdown
     */
    exportAsMarkdown() {
        let markdown = `# ${this.project.title}\n\n`;
        markdown += `**Created**: ${new Date(this.project.createdAt).toLocaleDateString()}\n`;
        markdown += `**Last Updated**: ${new Date(this.project.updatedAt).toLocaleDateString()}\n\n`;
        
        if (this.project.description) {
            markdown += `## Description\n\n${this.project.description}\n\n`;
        }

        // Add each phase output
        for (let i = 1; i <= WORKFLOW_CONFIG.phaseCount; i++) {
            const phase = WORKFLOW_CONFIG.phases.find(p => p.number === i);
            const output = this.getPhaseOutput(i);
            
            if (output) {
                markdown += `## Phase ${i}: ${phase.name}\n\n`;
                markdown += `${output}\n\n`;
                markdown += `---\n\n`;
            }
        }

        return markdown;
    }

    /**
     * Get workflow progress percentage
     */
    getProgress() {
        return Math.round((this.currentPhase / WORKFLOW_CONFIG.phaseCount) * 100);
    }
}

