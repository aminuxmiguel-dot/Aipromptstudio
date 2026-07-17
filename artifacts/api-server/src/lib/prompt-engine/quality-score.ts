import type { QualityScore, PromptFragments, PromptMode } from "./types";

interface ScoreFactors {
  specificity: number;    // How specific and detailed is the prompt?
  styleCoherence: number; // Does the style vocabulary cohere?
  technicalAccuracy: number; // Are technical terms used correctly?
  originality: number;    // Is the prompt likely to produce original results?
  commercial: number;     // Is the result likely commercially viable?
}

function scoreSpecificity(prompt: string, fragments: PromptFragments): number {
  let score = 50;
  const words = prompt.split(/\s+/).length;
  if (words > 20) score += 10;
  if (words > 40) score += 10;
  if (words > 60) score += 10;
  if (fragments.composition) score += 10;
  if (fragments.lighting) score += 10;
  return Math.min(100, score);
}

function scoreStyleCoherence(prompt: string, mode: PromptMode): number {
  let score = 60;
  const premiumTerms = ["professional", "commercial", "premium", "high-quality", "masterful"];
  const creativeTerms = ["editorial", "cinematic", "artistic", "avant-garde", "bold"];
  const luxuryTerms = ["luxury", "bespoke", "flawless", "museum", "world-class"];

  const lowerPrompt = prompt.toLowerCase();
  if (mode === "minimal") {
    const hasComplexity = premiumTerms.some((t) => lowerPrompt.includes(t));
    if (!hasComplexity) score += 20;
    else score -= 10;
  } else if (mode === "premium") {
    const count = premiumTerms.filter((t) => lowerPrompt.includes(t)).length;
    score += count * 8;
  } else if (mode === "creative") {
    const count = creativeTerms.filter((t) => lowerPrompt.includes(t)).length;
    score += count * 8;
  } else if (mode === "luxury") {
    const count = luxuryTerms.filter((t) => lowerPrompt.includes(t)).length;
    score += count * 8;
  }
  return Math.min(100, score);
}

function scoreTechnicalAccuracy(prompt: string, fragments: PromptFragments): number {
  let score = 55;
  const technicalTerms = [
    "f/", "mm lens", "iso", "aperture", "bokeh", "lighting", "composition",
    "depth of field", "vector", "rgb", "cmyk", "aspect ratio", "16:9", "resolution",
    "studio", "rembrandt", "rule of thirds", "golden ratio",
  ];
  const lowerPrompt = prompt.toLowerCase();
  const count = technicalTerms.filter((t) => lowerPrompt.includes(t)).length;
  score += count * 7;
  if (fragments.negativePrompt && fragments.negativePrompt.length > 10) score += 15;
  return Math.min(100, score);
}

function scoreOriginality(mode: PromptMode, fragments: PromptFragments): number {
  const baseByMode: Record<PromptMode, number> = {
    minimal: 50,
    premium: 65,
    creative: 80,
    luxury: 75,
  };
  let score = baseByMode[mode];
  if (fragments.boosters && fragments.boosters.length > 30) score += 10;
  return Math.min(100, score);
}

function scoreCommercial(mode: PromptMode, prompt: string): number {
  const baseByMode: Record<PromptMode, number> = {
    minimal: 55,
    premium: 75,
    creative: 70,
    luxury: 85,
  };
  let score = baseByMode[mode];
  const commercialTerms = ["commercial", "professional", "brand", "corporate", "business", "retail"];
  const count = commercialTerms.filter((t) => prompt.toLowerCase().includes(t)).length;
  score += count * 5;
  return Math.min(100, score);
}

function getStrengths(factors: ScoreFactors, mode: PromptMode): string[] {
  const strengths: string[] = [];
  if (factors.specificity >= 75) strengths.push("Highly specific — provides clear direction for AI generation");
  if (factors.styleCoherence >= 75) strengths.push("Strong style coherence — visual language is consistent");
  if (factors.technicalAccuracy >= 75) strengths.push("Technically accurate — uses professional terminology correctly");
  if (factors.originality >= 75) strengths.push("High originality potential — unlikely to produce generic results");
  if (factors.commercial >= 75) strengths.push("Commercially viable — suitable for professional brand use");
  if (mode === "luxury") strengths.push("Luxury tier — optimized for maximum output quality");
  if (mode === "creative") strengths.push("Creative tier — designed for distinctive, memorable results");
  return strengths.slice(0, 4);
}

function getWeaknesses(factors: ScoreFactors, mode: PromptMode): string[] {
  const weaknesses: string[] = [];
  if (factors.specificity < 60) weaknesses.push("Could be more specific — add more detail about materials or context");
  if (factors.styleCoherence < 60) weaknesses.push("Style vocabulary could be more cohesive");
  if (factors.technicalAccuracy < 60) weaknesses.push("Add technical parameters (lens, lighting setup, resolution) for better results");
  if (factors.originality < 60) weaknesses.push("May produce generic results — try the Creative or Luxury mode");
  if (factors.commercial < 60) weaknesses.push("Commercial viability is limited — consider Premium or Luxury mode");
  if (mode === "minimal") weaknesses.push("Minimal mode produces shorter prompts — upgrade for more detail");
  return weaknesses.slice(0, 3);
}

function getSuggestions(factors: ScoreFactors, mode: PromptMode): string[] {
  const suggestions: string[] = [];
  if (mode !== "luxury") suggestions.push("Try Luxury mode for maximum quality and detail");
  if (factors.specificity < 70) suggestions.push("Add specific colors, materials, or reference styles to improve results");
  if (factors.technicalAccuracy < 70) suggestions.push("Include camera/lighting specifications (e.g., 85mm lens, Rembrandt lighting)");
  suggestions.push("Add negative prompts in your AI tool to exclude unwanted elements");
  if (mode === "minimal") suggestions.push("Switch to Premium mode for commercial-grade output quality");
  return suggestions.slice(0, 3);
}

function getCommercialReadiness(score: number): "low" | "medium" | "high" {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

export function calculateQualityScore(
  prompt: string,
  fragments: PromptFragments,
  mode: PromptMode
): QualityScore {
  const factors: ScoreFactors = {
    specificity: scoreSpecificity(prompt, fragments),
    styleCoherence: scoreStyleCoherence(prompt, mode),
    technicalAccuracy: scoreTechnicalAccuracy(prompt, fragments),
    originality: scoreOriginality(mode, fragments),
    commercial: scoreCommercial(mode, prompt),
  };

  // Weighted average: specificity 25%, styleCoherence 20%, technical 20%, originality 20%, commercial 15%
  const weighted =
    factors.specificity * 0.25 +
    factors.styleCoherence * 0.2 +
    factors.technicalAccuracy * 0.2 +
    factors.originality * 0.2 +
    factors.commercial * 0.15;

  const finalScore = Math.round(Math.min(100, Math.max(0, weighted)));

  return {
    score: finalScore,
    strengths: getStrengths(factors, mode),
    weaknesses: getWeaknesses(factors, mode),
    suggestions: getSuggestions(factors, mode),
    commercialReadiness: getCommercialReadiness(finalScore),
  };
}
