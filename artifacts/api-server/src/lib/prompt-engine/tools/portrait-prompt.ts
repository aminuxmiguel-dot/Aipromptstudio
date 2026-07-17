import type { ToolConfig } from "../types";

export const portraitPromptTool: ToolConfig = {
  slug: "portrait-prompt",
  name: "AI Portrait Prompt Generator",
  description:
    "Create compelling AI portrait prompts for realistic, artistic, and stylized character imagery. Control lighting, mood, style, and character details with precision.",
  category: "photography",
  icon: "User",
  modifiers: ["Photorealistic", "Oil Painting", "Cinematic", "Fantasy", "Studio Headshot", "Environmental", "Dramatic", "Soft Natural"],
  modes: ["minimal", "premium", "creative", "luxury"],
  seoContent: `Portrait generation is one of the most challenging and rewarding applications of AI image generation. The human face is extraordinarily complex — we are evolutionarily wired to detect even the subtlest imperfections in facial proportions, expressions, and lighting. Creating AI portrait prompts that consistently produce high-quality, believable results requires mastery of both photographic and artistic principles.

The AI Portrait Prompt Generator draws on knowledge from three distinct disciplines: professional portrait photography, classical painting techniques, and cinematic cinematography. Each prompt mode leverages different aspects of these traditions.

## Portrait Photography Principles

Professional portrait photographers think in layers: the subject, the light, the background, and the relationship between all three. Our prompts encode this layered thinking:

**Subject Direction**: Age, ethnicity, expression, and character attributes are specified with sensitivity and precision, creating diverse, authentic representations without stereotypes.

**Lighting Setups**: We reference industry-standard portrait lighting configurations — Rembrandt, butterfly, split, loop, and broad lighting — each creating distinctly different emotional tones and facial topography.

**Lens and Depth of Field**: Portrait focal lengths (85mm, 105mm, 135mm) produce characteristic compression and bokeh that define the "look" of professional portraits. Our prompts specify these technical parameters to guide AI generation.

## Artistic Traditions

The Oil Painting modifier draws on 500 years of portrait painting technique, referencing specific Old Masters whose work defined the genre. Vermeer's light, Rembrandt's chiaroscuro, and Sargent's confident brushwork are encoded into these prompts.

## Cinematic Character Design

Cinematic portraits follow the grammar of film: motivated lighting (light has a source and a reason), environmental storytelling, and careful attention to how clothing and background reveal character. Think Annie Leibovitz shooting for Vanity Fair.

## Ethical Portrait Generation

All portrait prompts are designed to produce fictional, composite characters rather than attempting to replicate real individuals. The Quality Score system penalizes prompts that could be used to generate misleading imagery.`,

  generateFragments(mode, options) {
    const subject = options.subject || "a person";
    const style = options.modifier || "Photorealistic";
    const expression = options.expression || "confident";
    const setting = options.setting || "";

    const introductions: Record<string, string> = {
      minimal: `Portrait of ${subject}`,
      premium: `Professional portrait photograph of ${subject}`,
      creative: `Compelling character portrait of ${subject}`,
      luxury: `Masterpiece portrait of ${subject}, gallery exhibition quality`,
    };

    const styleMap: Record<string, Record<string, string>> = {
      "Photorealistic": {
        minimal: "photorealistic, sharp focus",
        premium: "hyperrealistic portrait photography, Sony A7R V, 85mm f/1.4",
        creative: "ultra-detailed photorealism, editorial magazine quality, nuanced expression",
        luxury: "transcendent photorealism, Phase One IQ4 quality, flawless skin texture, every detail perfect",
      },
      "Oil Painting": {
        minimal: "oil painting portrait, traditional style",
        premium: "classical oil painting, Old Masters technique, Rembrandt lighting, rich impasto",
        creative: "expressive contemporary oil painting, painterly brushwork, chromatic boldness",
        luxury: "museum-quality oil painting, virtuoso technique, National Portrait Gallery standard",
      },
      "Cinematic": {
        minimal: "cinematic portrait, film look",
        premium: "cinematic portrait, anamorphic lens, film grain, ARRI ALEXA aesthetic",
        creative: "neo-noir cinematic portrait, high contrast, atmospheric tension",
        luxury: "auteur-quality cinematography, Kubrick-esque framing, perfect color grading",
      },
      "Fantasy": {
        minimal: "fantasy portrait, magical elements",
        premium: "detailed fantasy portrait, ethereal atmosphere, magical realism",
        creative: "epic fantasy character portrait, dramatic otherworldly elements, high concept",
        luxury: "visionary fantasy artwork, Brom-quality illustration, breathtaking detail",
      },
      "Studio Headshot": {
        minimal: "professional headshot, clean background",
        premium: "premium executive headshot, corporate photography, gray seamless background",
        creative: "creative professional headshot, distinctive character, modern studio aesthetic",
        luxury: "world-class professional portrait, flawless presentation, luxury talent agency standard",
      },
    };

    const compositions: Record<string, string> = {
      minimal: "head and shoulders, direct gaze",
      premium: "three-quarter composition, intentional gaze direction, breathing room",
      creative: "dynamic framing, unexpected crop, psychological depth",
      luxury: "masterful compositional balance, exquisite negative space, iconic framing",
    };

    const lightings: Record<string, string> = {
      minimal: "natural soft light",
      premium: `Rembrandt lighting, ${expression} expression, catchlights in eyes, subtle fill`,
      creative: "dramatic split lighting, expressive shadows, cinematic atmosphere",
      luxury: "5-light studio masterclass, perfect Rembrandt triangle, silken skin highlight, deep shadow mystery",
    };

    const boosters: Record<string, string> = {
      minimal: "detailed, high quality",
      premium: `${expression} expression, ${setting ? `${setting}, ` : ""}professional photography, skin texture detail`,
      creative: `${expression} mood, ${setting ? `${setting} setting, ` : ""}award-winning portrait photography`,
      luxury: `${expression}, ${setting ? `${setting}, ` : ""}world-class portrait, Annie Leibovitz quality, extraordinary detail`,
    };

    const negativePrompts: Record<string, string> = {
      minimal: "blurry, distorted, low quality",
      premium: "extra limbs, deformed, blurry, bad anatomy, watermark, airbrushed plastic skin",
      creative: "generic, stock photo, amateur, unflattering, distorted",
      luxury: "imperfect, amateur, unnatural, plastic, oversmoothed, uncanny valley",
    };

    const styleKey = style as keyof typeof styleMap;
    const styleFragments = styleMap[styleKey] || styleMap["Photorealistic"];

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
