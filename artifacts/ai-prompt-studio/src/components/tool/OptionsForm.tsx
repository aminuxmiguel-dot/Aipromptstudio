import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface FieldConfig {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

const TOOL_FORM_CONFIGS: Record<string, FieldConfig[]> = {
  "logo-prompt": [
    { name: "subject", label: "Brand / Company", placeholder: "e.g. Apex Digital — a modern fintech startup", required: true },
    { name: "industry", label: "Industry", placeholder: "e.g. Technology, Finance, Fashion" },
    { name: "colors", label: "Color Preferences", placeholder: "e.g. Deep navy, gold accents (optional)" },
    { name: "keywords", label: "Additional Keywords", placeholder: "e.g. trustworthy, innovative, global (optional)" },
  ],
  "product-photo-prompt": [
    { name: "product", label: "Product Description", placeholder: "e.g. Premium leather wallet, matte black finish", required: true },
    { name: "surface", label: "Surface / Background", placeholder: "e.g. marble, concrete, white table (optional)" },
    { name: "mood", label: "Mood / Atmosphere", placeholder: "e.g. luxurious, minimal, dramatic (optional)" },
  ],
  "portrait-prompt": [
    { name: "subject", label: "Subject Description", placeholder: "e.g. Young professional woman, confident expression", required: true },
    { name: "expression", label: "Expression / Emotion", placeholder: "e.g. confident, contemplative, joyful" },
    { name: "setting", label: "Setting / Environment", placeholder: "e.g. urban rooftop, studio, nature (optional)" },
  ],
  "youtube-thumbnail-prompt": [
    { name: "topic", label: "Video Topic", placeholder: "e.g. How I made $10k in one month with AI", required: true },
    { name: "emotion", label: "Emotion / Energy", placeholder: "e.g. shocked, excited, determined" },
    { name: "niche", label: "YouTube Niche", placeholder: "e.g. finance, gaming, tech, lifestyle" },
  ],
  "packaging-prompt": [
    { name: "product", label: "Product Type", placeholder: "e.g. Artisan coffee, 250g bag", required: true },
    { name: "material", label: "Material / Format", placeholder: "e.g. kraft paper, rigid box, glass jar (optional)" },
    { name: "brand", label: "Brand Name / Positioning", placeholder: "e.g. Harvest Roasters — premium specialty coffee (optional)" },
  ],
};

interface OptionsFormProps {
  toolSlug: string;
  onSubmit: (options: Record<string, string>) => void;
  isLoading: boolean;
}

export function OptionsForm({ toolSlug, onSubmit, isLoading }: OptionsFormProps) {
  const fields = TOOL_FORM_CONFIGS[toolSlug] || [];

  const formSchema = z.object(
    fields.reduce((acc, field) => {
      acc[field.name] = field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional();
      return acc;
    }, {} as Record<string, any>)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, any>),
  });

  // Reset form when tool slug changes
  useEffect(() => {
    form.reset(fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, any>));
  }, [toolSlug, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase pt-2 border-t border-border/40">Details</h3>
        
        <div className="space-y-4">
          {fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90 font-medium">
                    {field.label}
                    {!field.required && <span className="text-muted-foreground/60 text-xs ml-1 font-normal">(Optional)</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={field.placeholder} 
                      className="bg-card/30 border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all text-base md:text-sm h-11"
                      {...f} 
                    />
                  </FormControl>
                  <FormMessage className="text-destructive/80 text-xs" />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="pt-4 pb-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Crafting Prompt...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Prompt
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
