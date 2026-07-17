import type { ToolConfig } from "../types";

export const packagingPromptTool: ToolConfig = {
  slug: "packaging-prompt",
  name: "Packaging Design Prompt Generator",
  description:
    "Generate professional packaging design prompts for products, brands, and retail concepts. Create premium unboxing experiences and shelf-stopping package designs.",
  category: "branding",
  icon: "Package",
  modifiers: ["Luxury Box", "Eco Minimal", "Bold Retail", "Glass Bottle", "Tin Container", "Paper Bag", "Rigid Sleeve", "Metallic Foil"],
  modes: ["minimal", "premium", "creative", "luxury"],
  seoContent: `Packaging design is the silent salesperson — the first physical touchpoint between a brand and consumer that must communicate quality, values, and product promise in a single glance. In retail environments, a package has approximately 1.7 seconds to capture attention before a shopper moves on. Online, packaging imagery drives purchasing decisions for millions of e-commerce products daily.

The Packaging Design Prompt Generator is built on professional packaging design principles used by agencies serving Fortune 500 CPG (Consumer Packaged Goods) brands. Every prompt mode reflects a different phase of the design process, from initial concept exploration to final luxury execution.

## The Architecture of Effective Packaging

Premium packaging design operates across five simultaneous dimensions:

**Structural Design**: The physical form — box, bottle, bag, tin, or sleeve — communicates product positioning before graphics are even applied. Our prompts specify structural forms that match product categories and price points.

**Visual Hierarchy**: Packaging must communicate brand name, product name, variant/flavor, and key claims in a fraction of a second. Our prompts encode professional hierarchical layouts that guide the eye through this information in the correct sequence.

**Material and Finish Vocabulary**: The difference between a premium and budget product often comes down entirely to material specification. Soft-touch matte lamination, spot UV coating, debossed letterpress, foil stamping, and blind embossing — our luxury prompts reference these high-end finishing techniques.

**Color Psychology in Retail**: Different retail environments have distinct color conventions. Pharmaceutical packaging skews clinical white and blue. Premium food emphasizes appetite colors — deep burgundy, warm gold, rich green. Beauty products use editorial fashion colors. Our prompts understand these category conventions.

**Unboxing Experience Design**: Modern packaging must perform on social media as well as retail shelves. The "unboxing moment" has become a marketing event in itself — tissue paper, ribbon pulls, nested reveals, and handwritten elements that create shareable moments.

## Sustainability and Eco Design

The Eco Minimal modifier reflects growing consumer demand for environmentally responsible packaging. These prompts specify natural, recycled, and biodegradable materials while maintaining strong visual design quality — proving that sustainability and premium aesthetics are not mutually exclusive.

## Digital Visualization Best Practices

AI-generated packaging mockups are valuable for rapid concept validation before committing to physical prototypes. Our prompts specify three-dimensional mockup presentations on neutral or contextual backgrounds, allowing stakeholders to evaluate designs in realistic context.`,

  generateFragments(mode, options) {
    const product = options.product || "a premium consumer product";
    const style = options.modifier || "Luxury Box";
    const material = options.material || "";
    const brand = options.brand || "";

    const introductions: Record<string, string> = {
      minimal: `Packaging design for ${product}`,
      premium: `Professional product packaging design for ${product}`,
      creative: `Distinctive brand packaging concept for ${product}`,
      luxury: `Ultra-premium packaging design for ${product}, collector-grade execution`,
    };

    const styleMap: Record<string, Record<string, string>> = {
      "Luxury Box": {
        minimal: "elegant box packaging, minimal design",
        premium: "premium rigid box, soft-touch matte finish, foil stamping, clean typography",
        creative: "sculptural luxury box, unexpected structural form, exquisite material play",
        luxury: "museum-quality presentation box, hand-crafted detail, Hermès-level packaging design",
      },
      "Eco Minimal": {
        minimal: "eco-friendly packaging, natural materials",
        premium: "kraft paper packaging, debossed logo, natural twine, sustainable materials",
        creative: "innovative eco packaging, seed paper elements, living material concept",
        luxury: "luxury eco packaging, premium recycled materials, carbon-neutral statement, refined simplicity",
      },
      "Bold Retail": {
        minimal: "eye-catching retail packaging, bold colors",
        premium: "shelf-stopping retail package, bold typography, high-contrast color blocking",
        creative: "disruptive retail design, category-defying visual language, maximum shelf impact",
        luxury: "premium retail powerhouse, strategic color psychology, dominant shelf presence",
      },
      "Glass Bottle": {
        minimal: "glass bottle product packaging",
        premium: "premium glass bottle with custom silhouette, frosted finish, embossed branding",
        creative: "sculptural glass bottle, unexpected form factor, art-object aesthetic",
        luxury: "bespoke glass vessel, museum-worthy form, handblown quality, gravity-defying design",
      },
      "Metallic Foil": {
        minimal: "metallic packaging, foil finish",
        premium: "holographic foil packaging, premium metallic finish, light-reactive surfaces",
        creative: "bold metallic concept, unexpected foil application, dimensional reflective design",
        luxury: "18K gold foil packaging, fine jeweler aesthetic, collector edition treatment",
      },
    };

    const compositions: Record<string, string> = {
      minimal: "clean product shot, neutral background",
      premium: "professional 3/4 angle mockup, lifestyle context, depth of field",
      creative: "dynamic multi-angle composition, environmental storytelling",
      luxury: "gallery presentation, perfect shadow, pristine environment, flawless composition",
    };

    const lightings: Record<string, string> = {
      minimal: "natural soft lighting",
      premium: "professional product lighting, specular highlights on materials, subtle shadows",
      creative: "dramatic studio lighting, material-specific highlights, atmospheric depth",
      luxury: "jeweler-quality lighting, perfect highlight map, zero interference, material truth",
    };

    const boosters: Record<string, string> = {
      minimal: `product packaging, ${material ? `${material} material, ` : ""}clean and professional`,
      premium: `commercial packaging photography, ${material ? `${material}, ` : ""}${brand ? `${brand} brand, ` : ""}retail-ready visualization`,
      creative: `award-winning packaging design, ${material ? `${material} material innovation, ` : ""}brand identity coherence${brand ? `, ${brand}` : ""}`,
      luxury: `Dieline Award quality, ${material ? `${material} premium material, ` : ""}${brand ? `${brand} luxury positioning, ` : ""}investment-grade design asset`,
    };

    const negativePrompts: Record<string, string> = {
      minimal: "blurry, poorly designed, amateur",
      premium: "generic, stock, template, amateur design, poor typography",
      creative: "cliché, overdone, generic, uninspired",
      luxury: "cheap, plastic, low-end, generic, amateurish, mass-market",
    };

    const styleKey = style as keyof typeof styleMap;
    const styleFragments = styleMap[styleKey] || styleMap["Luxury Box"];

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
