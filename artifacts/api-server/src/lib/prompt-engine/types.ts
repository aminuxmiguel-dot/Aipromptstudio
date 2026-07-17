export type PromptMode = "minimal" | "premium" | "creative" | "luxury";

export interface PromptFragments {
  introduction: string | null;
  style: string | null;
  composition: string | null;
  lighting: string | null;
  boosters: string | null;
  negativePrompt: string | null;
}

export interface ToolConfig {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  modifiers: string[];
  modes: string[];
  seoContent: string;
  generateFragments(
    mode: PromptMode,
    options: Record<string, string>
  ): PromptFragments;
}

export interface QualityScore {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  commercialReadiness: "low" | "medium" | "high";
}

export interface GeneratedPromptResult {
  prompt: string;
  negativePrompt: string | null;
  qualityScore: QualityScore;
  toolSlug: string;
  mode: PromptMode;
  fragments: PromptFragments;
}
