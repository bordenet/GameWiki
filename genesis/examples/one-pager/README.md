# One-Pager Assistant - Example Implementation

This is a complete example of using the Genesis template system to create a One-Pager document generator with AI-assisted scoring and feedback.

---

## Overview

**Purpose**: Create concise one-page business documents with AI assistance and automated scoring.

**Workflow**:
1. **Phase 1 - Initial Draft**: User provides context → AI generates one-pager
2. **Phase 2 - Review & Score**: AI reviews draft → Provides score (1-10) → Suggests improvements

**Key Differences from PRD Assistant**:
- 2 phases instead of 3
- Shorter output (1 page vs. 10+ pages)
- Scoring/feedback mechanism (1-10 scale)
- Simpler UI focused on brevity

---

## Configuration

**`config.json`** (filled-in example):
```json
{
  "project": {
    "name": "one-pager-assistant",
    "title": "One-Pager Assistant",
    "description": "AI-assisted one-pager creation with scoring and feedback for Libre Chat",
    "version": "0.1.0",
    "license": "MIT"
  },
  "github": {
    "user": "your-username",
    "repo": "one-pager-assistant",
    "pages_url": "https://your-username.github.io/one-pager-assistant"
  },
  "workflow": {
    "type": "multi-phase",
    "phases": [
      {
        "number": 1,
        "name": "Initial Draft",
        "ai_model": "Claude Sonnet 4.5",
        "prompt_file": "prompts/phase1.txt",
        "output_format": "markdown",
        "purpose": "Generate concise one-pager from user context"
      },
      {
        "number": 2,
        "name": "Review & Score",
        "ai_model": "Claude Sonnet 4.5",
        "prompt_file": "prompts/phase2.txt",
        "output_format": "markdown_with_score",
        "purpose": "Review draft and provide scored feedback"
      }
    ]
  },
  "architecture": {
    "enable_backend": false,
    "enable_desktop_clients": false,
    "enable_codecov": false,
    "enable_pre_commit_hooks": true,
    "storage_type": "indexeddb",
    "deploy_target": "github-pages"
  },
  "deployment": {
    "branch": "main",
    "folder": "docs",
    "auto_deploy": true
  }
}
```

---

## Prompt Templates

### Phase 1: Initial Draft

**File**: `prompts/phase1.txt`

```
You are an expert business analyst helping to create a concise one-pager document.

CONTEXT:
{user_context}

REQUIREMENTS:
- Maximum 1 page (500-700 words)
- Clear problem statement
- Proposed solution
- Key benefits (3-5 bullets)
- Success metrics (2-3 metrics)
- Next steps (3-5 action items)

OUTPUT FORMAT:
# [Project Name]

## Problem Statement
[2-3 sentences describing the problem]

## Proposed Solution
[3-4 sentences describing the solution]

## Key Benefits
- Benefit 1: [Brief description]
- Benefit 2: [Brief description]
- Benefit 3: [Brief description]

## Success Metrics
- Metric 1: [Specific, measurable metric]
- Metric 2: [Specific, measurable metric]

## Next Steps
1. [Action item with owner and timeline]
2. [Action item with owner and timeline]
3. [Action item with owner and timeline]

---

IMPORTANT:
- Keep it to ONE PAGE maximum
- Use clear, concise language
- Focus on business value
- Make it actionable
```

### Phase 2: Review & Score

**File**: `prompts/phase2.txt`

```
You are a senior executive reviewing a one-pager proposal. Provide constructive feedback and a numerical score.

ORIGINAL ONE-PAGER:
{phase1_output}

REVIEW CRITERIA (each scored 1-10):
1. **Clarity**: Is the problem and solution crystal clear?
2. **Conciseness**: Is it truly one page? No fluff?
3. **Impact**: Are benefits compelling and quantified?
4. **Feasibility**: Are next steps realistic and actionable?
5. **Completeness**: Does it answer all key questions?

OUTPUT FORMAT:
# Review & Feedback

## Overall Score: [X/10]

## Detailed Scores
- **Clarity**: [X/10] - [1-2 sentence comment]
- **Conciseness**: [X/10] - [1-2 sentence comment]
- **Impact**: [X/10] - [1-2 sentence comment]
- **Feasibility**: [X/10] - [1-2 sentence comment]
- **Completeness**: [X/10] - [1-2 sentence comment]

## Strengths
- [Specific strength 1]
- [Specific strength 2]
- [Specific strength 3]

## Areas for Improvement
- [Specific improvement 1 with actionable suggestion]
- [Specific improvement 2 with actionable suggestion]

## Recommended Changes
1. [Specific change with rationale]
2. [Specific change with rationale]
3. [Specific change with rationale]

---

IMPORTANT:
- Be constructive, not critical
- Provide specific, actionable feedback
- Justify all scores with evidence
- Focus on business value
```

---

## How to Use This Example

### Step 1: Copy Genesis to New Repo

```bash
mkdir one-pager-assistant
cp -r genesis/* one-pager-assistant/
cd one-pager-assistant
```

### Step 2: Use This Configuration

```bash
# Copy this example's config
cp examples/one-pager/config.json ./config.json

# Update with your GitHub username
sed -i 's/your-username/YOUR_ACTUAL_USERNAME/g' config.json
```

### Step 3: Let AI Generate Project

Open with AI assistant (Claude, Cursor, etc.):
```
"I want to create a One-Pager assistant from the Genesis template.
Please read 01-AI-INSTRUCTIONS.md and use the configuration from
examples/one-pager/config.json to set up the project."
```

### Step 4: Verify Deployment

After AI completes setup:
```bash
# Check GitHub Pages
open https://YOUR_USERNAME.github.io/one-pager-assistant/

# Test locally
cd docs
python3 -m http.server 8000
open http://localhost:8000
```

---

## Expected Timeline

- **AI Setup**: 30-45 minutes
- **Customization**: 15-30 minutes
- **Testing**: 15 minutes
- **Total**: ~1 hour

---

## Success Criteria

✅ Project created from templates  
✅ All variables replaced  
✅ GitHub repository created  
✅ GitHub Pages deployed  
✅ Web app loads successfully  
✅ Can create new one-pager  
✅ Phase 1 generates draft  
✅ Phase 2 provides scored feedback  
✅ Export to Markdown works  

---

## Customization Ideas

- Add PDF export
- Add email sharing
- Add template library
- Add collaboration features
- Add version history
- Integrate with Libre Chat API

---

**Ready to create your One-Pager assistant?** Follow the steps above!

