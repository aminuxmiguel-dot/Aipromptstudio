import type { ToolConfig } from "../types";

export const productPhotoPromptTool: ToolConfig = {
  slug: "product-photo-prompt",
  name: "Product Photo Prompt Generator",
  description:
    "Generate professional product photography prompts for e-commerce, advertising, and editorial use. Achieve studio-quality results with precise lighting and composition control.",
  category: "photography",
  icon: "Camera",
  modifiers: ["Studio White", "Lifestyle", "Dark Moody", "Macro Detail", "Flat Lay", "On Model", "Outdoor Natural", "Abstract Background"],
  modes: ["minimal", "premium", "creative", "luxury"],
  seoContent: `Product photography drives purchasing decisions. Research consistently shows that high-quality product imagery increases conversion rates by 30-40% compared to amateur photos. Yet professional product photography sessions cost thousands of dollars — AI-generated product photo prompts offer a compelling alternative for prototyping, marketing materials, and e-commerce listings.

The Product Photo Prompt Generator is engineered with knowledge of professional photography principles: studio lighting setups, lens characteristics, depth of field control, color grading styles, and compositional rules used by top commercial photographers worldwide.

## Photography Styles

**Studio White** produces clean, e-commerce-ready imagery with pure white backgrounds, controlled lighting, and sharp focus throughout. Ideal for Amazon, Shopify, and other marketplace listings where consistency and clarity matter most.

**Lifestyle** places products in authentic real-world contexts, showing them in use by real people in real environments. These prompts generate aspirational imagery that tells a story and connects emotionally with the viewer.

**Dark Moody** uses low-key lighting, dramatic shadows, and rich tonal contrast to create atmospheric product imagery. Perfect for premium spirits, fragrances, luxury goods, and brands with a sophisticated edge.

**Macro Detail** zooms in to reveal texture, craftsmanship, and material quality at close range. Essential for jewelry, watchmaking, skincare, and any product where quality of materials is a key selling point.

**Flat Lay** arranges products in a top-down composition with carefully curated props and backgrounds. Popular on social media, especially Instagram, for food, fashion, beauty, and lifestyle brands.

## Lighting Mastery

Professional product photography is fundamentally about light control. Our prompt engine references specific lighting setups used in commercial studios:

- **Rembrandt Lighting**: Classic three-quarter light with distinctive triangular shadow pattern
- **Butterfly Lighting**: High-centered light creating elegant under-chin shadow
- **Split Lighting**: Dramatic 50/50 light-shadow division for bold contrast
- **Ring Light**: Even, flat illumination with characteristic ring catchlight in reflective surfaces

## Quality Score Factors

Product photo prompts are evaluated on: background clarity, lighting specification, product prominence, depth of field guidance, and post-processing style. Top-scoring prompts (85+) include all five elements and specify camera settings such as aperture, focal length, and ISO equivalents.`,

  generateFragments(mode, options) {
    const product = options.product || "a premium consumer product";
    const style = options.modifier || "Studio White";
    const surface = options.surface || "";
    const mood = options.mood || "";

    const introductions: Record<string, string> = {
      minimal: `Product photo of ${product}`,
      premium: `Professional commercial product photograph of ${product}`,
      creative: `Striking editorial product photography of ${product}`,
      luxury: `Exquisite luxury product photography of ${product}, editorial quality`,
    };

    const styleMap: Record<string, Record<string, string>> = {
      "Studio White": {
        minimal: "white background, clean studio lighting",
        premium: "pure white cyclorama background, three-point studio lighting, even illumination",
        creative: "high-key studio setup, sculptural light and shadow interplay, gallery presentation",
        luxury: "flawless infinity curve, museum-quality lighting, crystalline sharpness",
      },
      "Lifestyle": {
        minimal: "lifestyle setting, natural environment",
        premium: "authentic lifestyle context, golden hour lighting, environmental storytelling",
        creative: "cinematic lifestyle moment, raw authenticity, documentary realism",
        luxury: "aspirational lifestyle setting, art-directed composition, magazine editorial quality",
      },
      "Dark Moody": {
        minimal: "dark background, moody lighting",
        premium: "dramatic low-key lighting, rich shadows, dark luxury aesthetic",
        creative: "noir atmosphere, chiaroscuro lighting, intense visual drama",
        luxury: "bespoke dark studio, sculpted light, velvet shadow depth, cinematic gravitas",
      },
      "Macro Detail": {
        minimal: "macro shot, close-up detail",
        premium: "extreme macro, shallow depth of field, razor-sharp focus, texture revealed",
        creative: "hyper-detailed macro, bokeh background, artistic selective focus",
        luxury: "microscopic precision, flawless surface detail, Swiss watchmaking-level scrutiny",
      },
      "Flat Lay": {
        minimal: "flat lay, top-down view",
        premium: "styled flat lay, curated props, balanced negative space, Instagram-ready",
        creative: "avant-garde flat lay, unexpected angles, dynamic prop arrangement",
        luxury: "couture flat lay, marble surface, gold accents, editorial styling",
      },
    };

    const compositions: Record<string, string> = {
      minimal: "centered product, simple composition",
      premium: "rule of thirds, intentional negative space, perfect product angle",
      creative: "dynamic asymmetric composition, unexpected perspective, visual tension",
      luxury: "masterful composition, golden ratio framing, museum-quality curation",
    };

    const lightings: Record<string, string> = {
      minimal: "natural lighting, soft shadows",
      premium: "professional studio lighting, subtle highlights, controlled shadows, catchlights",
      creative: "dramatic lighting, high contrast, expressive shadow play",
      luxury: "flawless 5-light studio setup, hairlight rim, perfect specular highlights, zero flare",
    };

    const boosters: Record<string, string> = {
      minimal: "product photography, sharp focus",
      premium: `commercial photography, 85mm lens, f/8, ${surface ? `${surface} surface, ` : ""}${mood ? `${mood} mood, ` : ""}Hasselblad quality`,
      creative: `award-winning product photography, ${surface ? `${surface} background, ` : ""}editorial styling, magazine spread quality`,
      luxury: `luxury brand photography, Phase One camera, ${surface ? `${surface} surface, ` : ""}art-directed, flawless retouching`,
    };

    const negativePrompts: Record<string, string> = {
      minimal: "blurry, dark, low quality",
      premium: "amateur, overexposed, underexposed, distorted, lens flare, chromatic aberration",
      creative: "generic, stock photo, cliché, mediocre",
      luxury: "cheap, low-end, amateur, harsh shadows, overprocessed, tacky",
    };

    const styleKey = style as keyof typeof styleMap;
    const styleFragments = styleMap[styleKey] || styleMap["Studio White"];

    return {
      introduction: introductions[mode],
      style: styleFragments[mode] || styleFragments.minimal,
      composition: compositions[mode],
      lighting: lightings[mode],
      boosters: boosters[mode],
      negativePrompt: negativePrompts[mode],
    };
  },
};
