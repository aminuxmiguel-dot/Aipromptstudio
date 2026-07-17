# ADR-002: Smart Modular Prompt Templating Engine

**Date**: 2026-07-17  
**Status**: Accepted

## Context

The platform must generate high-quality AI prompts without any AI API dependency. The architecture must also allow adding AI APIs later without rewriting prompt generation logic.

## Decision

We implemented a **Smart Modular Prompt Templating Engine** with the following design:

### Structure

```
artifacts/api-server/src/lib/prompt-engine/
├── types.ts          — ToolConfig, PromptFragments, QualityScore interfaces
├── engine.ts         — Registry, fragment assembly, tool dispatch
├── quality-score.ts  — Weighted heuristics scoring system
└── tools/
    ├── logo-prompt.ts
    ├── product-photo-prompt.ts
    ├── portrait-prompt.ts
    ├── youtube-thumbnail-prompt.ts
    └── packaging-prompt.ts
```

### Fragment Architecture

Each prompt is deterministically assembled from 5 ordered fragments:
1. **Introduction** — Subject and context
2. **Style** — Visual aesthetic and technique vocabulary
3. **Composition** — Spatial arrangement and framing
4. **Lighting** — Light quality and shadow treatment
5. **Boosters** — Technical parameters and quality multipliers

Each tool implements `generateFragments(mode, options): PromptFragments`. The engine assembles the final prompt as a comma-separated string from non-null fragments, then appends the negative prompt separately.

### Prompt Modes

Four modes per tool, each producing progressively richer fragment content:
- **Minimal**: Essential elements only, maximum AI creative latitude
- **Premium**: Professional terminology, technical parameters
- **Creative**: Experimental combinations, distinctive aesthetic
- **Luxury**: Maximum specificity, elite design references

### Plugin System

New tools are added by:
1. Creating `tools/[tool-name].ts` implementing `ToolConfig`
2. Adding to `TOOLS` array in `engine.ts`

No route changes, no schema changes, no frontend changes required.

### Quality Score System

A weighted heuristics system evaluates prompts across 5 dimensions:
- Specificity (25%): Word count, fragment presence
- Style coherence (20%): Mode-appropriate vocabulary
- Technical accuracy (20%): Professional terminology usage
- Originality potential (20%): Mode-based baseline + booster richness
- Commercial viability (15%): Commercial vocabulary presence

Produces score 0-100, strengths, weaknesses, suggestions, and commercial readiness rating.

## AI API Integration Path

When AI APIs are added (Phase 5+):
1. Create `src/lib/ai/provider.ts` with a common `AIProvider` interface
2. Implement `src/lib/ai/providers/openai.ts`, `anthropic.ts`, etc.
3. Add an `enhance(prompt, provider)` function that takes a template-generated prompt and refines it via AI
4. The `/prompts/generate` route already has the right shape — just add an optional `aiProvider` field

No rewriting of tools, fragments, or quality scoring required.

## Consequences

- Prompt generation is instantaneous (no network calls, no API keys)
- 700-1200 word SEO content is embedded in each tool config
- All 5 tools share identical request/response schemas
- Quality Score gives users actionable feedback without AI
