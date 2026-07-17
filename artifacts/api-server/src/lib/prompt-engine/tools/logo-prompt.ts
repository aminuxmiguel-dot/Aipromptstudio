import type { ToolConfig } from "../types";

export const logoPromptTool: ToolConfig = {
  slug: "logo-prompt",
  name: "Logo Prompt Generator",
  description:
    "Create stunning AI-generated logo prompts for brands, businesses, and personal projects. Generate professional logo concepts with precise style control.",
  category: "branding",
  icon: "Layers",
  modifiers: ["Modern", "Flat", "Geometric", "Monogram", "Negative Space", "Vintage", "Minimalist", "Abstract", "Wordmark", "Emblem"],
  modes: ["minimal", "premium", "creative", "luxury"],
  seoContent: `A logo is the cornerstone of brand identity — the single mark that must communicate a company's values, personality, and promise in an instant. Yet creating a compelling AI logo prompt that actually produces professional results requires deep knowledge of design principles, typography, color theory, and composition.

The Logo Prompt Generator uses a modular template engine built on professional design principles. Each prompt is assembled from carefully crafted fragments: the Introduction sets the context and medium, the Style fragment communicates aesthetic direction (flat vector, geometric minimalism, vintage hand-lettered), the Composition fragment guides spatial relationships and visual hierarchy, the Lighting fragment adds depth through shadow and highlight treatment, and the Boosters add specificity that elevates generic results to professional-grade output.

## Understanding Prompt Modes

**Minimal Mode** produces clean, focused prompts that work well with simpler AI models and tight creative briefs. These prompts specify the essential elements without over-constraining the AI, leaving room for creative interpretation.

**Premium Mode** adds professional design language — aspect ratios, color palette specifications, typography guidance, and rendering style. These prompts consistently produce commercial-quality results suitable for real brand applications.

**Creative Mode** introduces unexpected combinations, non-standard compositions, and experimental style fusions. Use this when you need distinctive, memorable marks that stand out in a crowded marketplace.

**Luxury Mode** generates prompts with the highest specificity and craft language. Every fragment is optimized for maximum quality output, including references to luxury design houses, premium materials, and elite aesthetic sensibilities.

## Prompt Modifiers Explained

- **Modern**: Clean lines, sans-serif typography, contemporary color palettes
- **Flat**: Two-dimensional design without shadows or 3D effects, bold solid colors
- **Geometric**: Mathematical shapes, grids, precise angles and proportions
- **Monogram**: Letter-based marks combining initials into a unified symbol
- **Negative Space**: Creative use of background/foreground contrast to embed hidden imagery
- **Vintage**: Retro aesthetics, aged textures, classic typography from past decades
- **Minimalist**: Maximum impact through reduction — fewer elements, more white space
- **Abstract**: Non-representational forms that convey feeling rather than literal meaning

## Commercial Readiness

Logo prompts generated through this tool are optimized for commercial use. The Quality Score system evaluates each prompt across five dimensions: specificity, style coherence, technical accuracy, originality potential, and commercial viability. Prompts scoring above 80 are generally ready for professional design workflows.`,

  generateFragments(mode, options) {
    const subject = options.subject || "a modern technology company";
    const style = options.modifier || "modern";
    const industry = options.industry || "technology";
    const colors = options.colors || "";
    const keywords = options.keywords || "";

    const introductions: Record<string, string> = {
      minimal: `Minimalist logo design for ${subject}`,
      premium: `Professional vector logo design for ${subject}, ${industry} industry`,
      creative: `Bold innovative logo concept for ${subject}, pushing boundaries of ${style} design`,
      luxury: `Ultra-premium brand mark for ${subject}, crafted with meticulous attention to ${style} design principles`,
    };

    const styles: Record<string, Record<string, string>> = {
      modern: {
        minimal: "clean sans-serif typography, flat design",
        premium: "geometric sans-serif, precise negative space, balanced proportions",
        creative: "dynamic typography, unexpected geometric intersections, kinetic energy",
        luxury: "refined sans-serif letterforms, mathematical precision, Swiss design influence",
      },
      flat: {
        minimal: "flat 2D design, solid colors, no gradients",
        premium: "pure flat vector, bold solid color palette, scalable at any size",
        creative: "deconstructed flat forms, layered opacity, bold color blocking",
        luxury: "masterful flat composition, limited color palette, iconic simplicity",
      },
      geometric: {
        minimal: "basic geometric shapes, clean lines",
        premium: "precise geometric construction, golden ratio proportions, mathematical balance",
        creative: "fragmented geometric forms, tessellation patterns, optical illusions",
        luxury: "sacred geometry, perfect mathematical harmony, architectural precision",
      },
      monogram: {
        minimal: "interlocked initials, clean letterform",
        premium: "custom monogram mark, harmonious letter integration, refined spacing",
        creative: "deconstructed letterforms, unexpected ligatures, typographic play",
        luxury: "bespoke monogram, hand-crafted quality, heraldic elegance",
      },
      "negative space": {
        minimal: "clever negative space, dual meaning",
        premium: "sophisticated negative space concept, dual imagery, optical precision",
        creative: "complex hidden imagery, perceptual ambiguity, conceptual depth",
        luxury: "masterful negative space, philosophical duality, enduring symbolism",
      },
      vintage: {
        minimal: "vintage style badge, retro type",
        premium: "vintage badge design, aged texture, classic serif typography, period-accurate details",
        creative: "eclectic vintage fusion, mixed era references, distressed authenticity",
        luxury: "heirloom quality vintage design, archival printing reference, timeless craftsmanship",
      },
    };

    const compositions: Record<string, string> = {
      minimal: "centered composition, white background",
      premium: "balanced composition, generous breathing room, precise alignment",
      creative: "dynamic asymmetric composition, visual tension, directional energy",
      luxury: "refined centered composition, perfect proportional harmony, exquisite spacing",
    };

    const lightings: Record<string, string> = {
      minimal: "flat, no shadows",
      premium: "subtle depth, minimal shadow, clean presentation",
      creative: "dramatic contrast, expressive shadow play",
      luxury: "exquisite embossed depth, premium metallic sheen, subtle dimensionality",
    };

    const boosters: Record<string, string> = {
      minimal: "vector art, simple, scalable",
      premium: `professional brand identity, ${colors ? `color palette: ${colors}, ` : ""}scalable vector, commercial quality${keywords ? `, ${keywords}` : ""}`,
      creative: `award-winning design, unexpected concept${colors ? `, ${colors} palette` : ""}${keywords ? `, ${keywords}` : ""}`,
      luxury: `Fortune 500 quality, ${colors ? `exclusive ${colors} palette, ` : ""}flawless execution, investment-grade brand asset${keywords ? `, ${keywords}` : ""}`,
    };

    const negativePrompts: Record<string, string> = {
      minimal: "complex, busy, photorealistic, 3D render",
      premium: "amateur, cluttered, drop shadow, bevel, photorealistic, raster",
      creative: "generic, stock, cliché, overdone, photorealistic",
      luxury: "cheap, pixelated, amateur, clipart, stock imagery, generic",
    };

    const styleKey = style.toLowerCase() as keyof typeof styles;
    const styleMap = styles[styleKey] || styles["modern"];

    return {
      introduction: introductions[mode],
      style: styleMap[mode] || styleMap.minimal,
      composition: compositions[mode],
      lighting: lightings[mode],
      boosters: boosters[mode],
      negativePrompt: negativePrompts[mode],
    };
  },
};
