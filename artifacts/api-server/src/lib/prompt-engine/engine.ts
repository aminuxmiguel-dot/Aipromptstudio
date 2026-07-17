import type { ToolConfig, PromptMode, GeneratedPromptResult } from "./types";
import { calculateQualityScore } from "./quality-score";
import { logoPromptTool } from "./tools/logo-prompt";
import { productPhotoPromptTool } from "./tools/product-photo-prompt";
import { portraitPromptTool } from "./tools/portrait-prompt";
import { youtubeThumbnailPromptTool } from "./tools/youtube-thumbnail-prompt";
import { packagingPromptTool } from "./tools/packaging-prompt";

const TOOLS: ToolConfig[] = [
  logoPromptTool,
  productPhotoPromptTool,
  portraitPromptTool,
  youtubeThumbnailPromptTool,
  packagingPromptTool,
];

const TOOL_MAP = new Map<string, ToolConfig>(
  TOOLS.map((tool) => [tool.slug, tool])
);

export function getAllTools(): ToolConfig[] {
  return TOOLS;
}

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOL_MAP.get(slug);
}

export function generatePrompt(
  toolSlug: string,
  mode: PromptMode,
  options: Record<string, string>
): GeneratedPromptResult {
  const tool = TOOL_MAP.get(toolSlug);
  if (!tool) {
    throw new Error(`Unknown tool: ${toolSlug}`);
  }

  const validModes: PromptMode[] = ["minimal", "premium", "creative", "luxury"];
  if (!validModes.includes(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  const fragments = tool.generateFragments(mode, options);

  // Assemble the final prompt from fragments
  const parts: string[] = [];
  if (fragments.introduction) parts.push(fragments.introduction);
  if (fragments.style) parts.push(fragments.style);
  if (fragments.composition) parts.push(fragments.composition);
  if (fragments.lighting) parts.push(fragments.lighting);
  if (fragments.boosters) parts.push(fragments.boosters);

  const prompt = parts.join(", ");
  const negativePrompt = fragments.negativePrompt || null;

  const qualityScore = calculateQualityScore(prompt, fragments, mode);

  return {
    prompt,
    negativePrompt,
    qualityScore,
    toolSlug,
    mode,
    fragments,
  };
}
