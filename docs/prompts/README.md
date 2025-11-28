# Dim Lantern Prompts

This directory contains reference prompts for the 3-phase workflow.

## Workflow Overview

### Phase 1: Extract (Claude Sonnet 4)
**Purpose**: Extract all locations and plot threads from the session transcript.

**Input**: Raw session transcript
**Output**: Structured list of locations and plot threads with metadata

### Phase 2: Summarize (Claude Sonnet 4)
**Purpose**: Generate wiki-style documentation for each extracted element.

**Input**: Phase 1 extraction results
**Output**: Obsidian-compatible wiki pages for locations and plot threads

### Phase 3: Refine (Gemini 2.5 Pro)
**Purpose**: Validate accuracy and improve clarity of generated content.

**Input**: Phase 2 wiki content
**Output**: Final, validated wiki content ready for Obsidian

## Usage

1. Create a new session with your transcript
2. Copy the generated prompt for each phase
3. Paste into the appropriate AI model
4. Copy the AI response back into Dim Lantern
5. Proceed to the next phase

## Obsidian Integration

The final output uses Obsidian-compatible formatting:
- `[[Wiki Links]]` for cross-references
- Standard Markdown headings and lists
- YAML frontmatter (if enabled)

Copy the final Phase 3 output directly into your Obsidian vault.

