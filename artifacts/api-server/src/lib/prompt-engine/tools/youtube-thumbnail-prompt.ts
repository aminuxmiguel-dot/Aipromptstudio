import type { ToolConfig } from "../types";

export const youtubeThumbnailPromptTool: ToolConfig = {
  slug: "youtube-thumbnail-prompt",
  name: "YouTube Thumbnail Prompt Generator",
  description:
    "Design click-worthy YouTube thumbnail prompts optimized for maximum CTR. Generate bold, attention-grabbing imagery with proven visual psychology principles.",
  category: "marketing",
  icon: "Play",
  modifiers: ["Reaction Face", "Bold Text", "Split Screen", "Before/After", "Dramatic Scene", "Minimal Clean", "Collage", "3D Rendered"],
  modes: ["minimal", "premium", "creative", "luxury"],
  seoContent: `YouTube thumbnail design is one of the highest-leverage skills in digital content creation. A/B testing data from major YouTube channels consistently shows that thumbnail improvements alone can increase click-through rates by 2-5x — transforming an underperforming video into a viral hit without changing a single frame of content.

The science of thumbnail design intersects psychology, graphic design, and platform-specific visual conventions that have evolved over YouTube's 20-year history. The YouTube Thumbnail Prompt Generator encodes the visual strategies used by the platform's top creators, from MrBeast's high-energy shock compositions to Kurzgesagt's refined illustrated style.

## The Psychology of Click-Through Rate

**Curiosity Gap**: The most effective thumbnails create a tension between what's shown and what's promised. They reveal enough to intrigue but withhold enough to compel clicking. Our prompts encode this principle by specifying partial reveals, dramatic expressions, and visual cliffhangers.

**Pattern Interruption**: YouTube's interface is visually noisy. Thumbnails that break the expected pattern — unusual color combinations, unexpected compositions, subverted visual expectations — stop the scroll and demand attention.

**Emotional Resonance**: Human faces displaying strong, clear emotions generate significantly higher CTR than neutral or object-focused thumbnails. The Reaction Face modifier specifically targets this effect.

## Platform-Optimized Design Principles

YouTube thumbnails are viewed at three very different sizes: the massive hero thumbnail, the medium recommendation panel, and the tiny mobile grid. Our prompts specify designs that read clearly at all three scales by emphasizing bold shapes, high contrast, and minimal complexity.

**Color Strategy**: Bright, saturated colors pop against YouTube's white/dark interface. Red, orange, and yellow consistently outperform cool colors in CTR studies. Our prompts incorporate this finding while maintaining creative flexibility.

**Text Integration**: Thumbnails with 3-5 words of bold, high-contrast text outperform image-only thumbnails in most niches. Our premium and luxury prompts specify text overlay guidelines even though the text itself must be added in post-production.

## Niche-Specific Optimization

Different YouTube niches have evolved distinct visual languages. Technology content uses clean, product-focused imagery. Gaming channels leverage high-energy character poses. Finance and business content relies on credibility signals. Our prompts understand these conventions and work within or productively against them.`,

  generateFragments(mode, options) {
    const topic = options.topic || "a compelling YouTube video";
    const style = options.modifier || "Reaction Face";
    const emotion = options.emotion || "excited";
    const niche = options.niche || "general";

    const introductions: Record<string, string> = {
      minimal: `YouTube thumbnail for ${topic}`,
      premium: `High-CTR YouTube thumbnail design for ${topic}`,
      creative: `Viral YouTube thumbnail concept for ${topic}`,
      luxury: `Premium YouTube thumbnail composition for ${topic}, maximum visual impact`,
    };

    const styleMap: Record<string, Record<string, string>> = {
      "Reaction Face": {
        minimal: "person with expressive face, clear emotion",
        premium: "close-up face with exaggerated shocked expression, mouth open, wide eyes, 4K clarity",
        creative: "dramatic reaction face, theatrical expression, psychological intensity",
        luxury: "perfectly composed reaction shot, maximum emotional impact, flawless lighting on face",
      },
      "Bold Text": {
        minimal: "bold text overlay, high contrast",
        premium: "bold impact typography, yellow outline text, high contrast background, text-safe zones",
        creative: "dynamic kinetic text design, 3D text effect, explosive visual energy",
        luxury: "premium typography design, masterly composed text and image balance, editorial quality",
      },
      "Dramatic Scene": {
        minimal: "dramatic scene, action moment",
        premium: "cinematic dramatic scene, golden hour lighting, intense atmospheric moment",
        creative: "epic cinematic composition, sweeping scale, visual spectacle",
        luxury: "Hollywood-quality visual drama, breathtaking composition, premium production value",
      },
      "Minimal Clean": {
        minimal: "minimal design, clean background",
        premium: "sophisticated minimal design, premium whitespace, refined typography",
        creative: "bold minimalism, powerful simplicity, unexpected visual restraint",
        luxury: "gallery-quality minimalism, architectural white space, luxury brand aesthetic",
      },
      "3D Rendered": {
        minimal: "3D rendered image, digital art",
        premium: "high-quality 3D render, photorealistic materials, professional lighting",
        creative: "stunning 3D composition, unexpected viewpoint, hyperrealistic detail",
        luxury: "AAA game quality 3D render, Pixar-level polish, film VFX standard",
      },
    };

    const compositions: Record<string, string> = {
      minimal: "centered composition, bold and clear",
      premium: "rule of thirds, dynamic visual hierarchy, clear focal point, thumbnail-safe margins",
      creative: "explosive asymmetric composition, overlapping elements, kinetic energy",
      luxury: "masterfully balanced composition, deliberate tension, visual perfection",
    };

    const lightings: Record<string, string> = {
      minimal: "bright, clear lighting",
      premium: "high contrast dramatic lighting, vibrant colors, strong visual pop",
      creative: "cinematic motivated lighting, atmospheric depth, color story",
      luxury: "perfect rim lighting, professional color grade, maximum visual punch",
    };

    const boosters: Record<string, string> = {
      minimal: `${emotion} mood, eye-catching`,
      premium: `${emotion} energy, ${niche} niche optimized, saturated colors, 16:9 ratio, thumbnail design`,
      creative: `${emotion} intensity, ${niche} content, viral potential, pattern-interrupting design`,
      luxury: `${emotion} maximum impact, ${niche} authority, MrBeast-level production quality, irresistible CTR`,
    };

    const negativePrompts: Record<string, string> = {
      minimal: "blurry, dark, boring, low contrast",
      premium: "muddy colors, cluttered, hard to read, low contrast, unprofessional",
      creative: "generic, stock, overdone, cliché, boring",
      luxury: "amateur, cheap, low energy, confusing, unappealing",
    };

    const styleKey = style as keyof typeof styleMap;
    const styleFragments = styleMap[styleKey] || styleMap["Reaction Face"];

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
