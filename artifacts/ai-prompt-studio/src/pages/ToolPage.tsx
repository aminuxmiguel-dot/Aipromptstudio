import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { 
  useGetTool, 
  useGeneratePrompt, 
  useSaveHistory, 
  GeneratedPrompt,
  getGetToolQueryKey,
  getListHistoryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionId } from "@/hooks/useSessionId";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

import { ModeSelector } from "@/components/tool/ModeSelector";
import { ModifierGrid } from "@/components/tool/ModifierGrid";
import { OptionsForm } from "@/components/tool/OptionsForm";
import { GeneratedPromptCard } from "@/components/tool/GeneratedPromptCard";
import { QualityScorePanel } from "@/components/tool/QualityScorePanel";
import { PromptFragmentsView } from "@/components/tool/PromptFragmentsView";
import { ToolSeoContent } from "@/components/tool/ToolSeoContent";
import { AdSlot } from "@/components/ads/AdSlot";

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug || "";
  const sessionId = useSessionId();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tool, isLoading: isToolLoading, isError: isToolError } = useGetTool(slug, {
    query: { enabled: !!slug, queryKey: getGetToolQueryKey(slug) }
  });

  const generatePrompt = useGeneratePrompt();
  const saveHistory = useSaveHistory();

  const [selectedMode, setSelectedMode] = useState("premium");
  const [selectedModifier, setSelectedModifier] = useState("");
  const [generatedResult, setGeneratedResult] = useState<GeneratedPrompt | null>(null);

  // Set default mode and modifier when tool loads
  useEffect(() => {
    if (tool) {
      if (tool.modes.length > 0 && !tool.modes.includes(selectedMode)) {
        setSelectedMode(tool.modes[0]);
      } else if (!selectedMode) {
        setSelectedMode("premium");
      }
      
      if (tool.modifiers.length > 0 && !selectedModifier) {
        setSelectedModifier(tool.modifiers[0]);
      }
      
      // Reset result when changing tools
      setGeneratedResult(null);
    }
  }, [tool, slug]);

  useSEO(tool ? {
    title: `${tool.name} — Free AI Prompt Generator | AI Prompt Studio`,
    description: `Generate professional ${tool.name.toLowerCase()} prompts instantly. No AI API key required. Choose from ${tool.modes.length} quality modes and ${tool.modifiers.length} style modifiers.`,
    ogType: "website",
    twitterCard: "summary_large_image",
  } : {
    title: "AI Prompt Generator — AI Prompt Studio",
    description: "Generate professional AI image prompts for Midjourney, DALL·E, and Stable Diffusion. No API key needed.",
  });

  usePageAnalytics({
    eventType: "page_view",
    toolSlug: slug || undefined,
    sessionId,
  });

  const handleGenerate = (options: Record<string, string>) => {
    if (!slug) return;

    // Merge the selected modifier into options if one is selected and not already in options
    const finalOptions = { ...options };
    if (selectedModifier && !finalOptions.style) {
      finalOptions.style = selectedModifier;
    }

    generatePrompt.mutate(
      {
        data: {
          toolSlug: slug,
          mode: selectedMode,
          options: finalOptions,
          sessionId,
        }
      },
      {
        onSuccess: (result) => {
          setGeneratedResult(result);
          
          // Auto-save to history
          saveHistory.mutate(
            {
              data: {
                toolSlug: slug,
                mode: selectedMode,
                prompt: result.prompt,
                negativePrompt: result.negativePrompt,
                qualityScore: result.qualityScore.score,
                options: JSON.stringify(finalOptions),
                sessionId,
              }
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getListHistoryQueryKey() });
              }
            }
          );
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Generation failed",
            description: "There was an error generating your prompt. Please try again.",
          });
        }
      }
    );
  };

  if (isToolLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Loading studio environment...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isToolError || !tool) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-8">
          <div className="h-20 w-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <Lightbulb className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight">Tool Not Found</h1>
            <p className="text-xl text-muted-foreground">
              We couldn't find the generator you're looking for.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2 mt-4">
              <ArrowLeft className="h-4 w-4" />
              Return to Studio
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {tool && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": tool.name,
              "description": tool.description,
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": tool.modifiers.join(", "),
            })
          }}
        />
      )}
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted/10 border-b border-border/40 pb-8 pt-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {tool.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {tool.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>
        </div>

        <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Configurator */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-8 lg:sticky lg:top-24">
              <ModeSelector 
                value={selectedMode} 
                onChange={setSelectedMode} 
                modes={tool.modes} 
              />
              
              <ModifierGrid 
                value={selectedModifier} 
                onChange={setSelectedModifier} 
                modifiers={tool.modifiers} 
              />
              
              <OptionsForm 
                toolSlug={slug} 
                onSubmit={handleGenerate} 
                isLoading={generatePrompt.isPending} 
              />

              {/* Sidebar ad slot — below the form */}
              <AdSlot slotId="tool-sidebar-rectangle" format="rectangle" responsive />
            </div>
            
            {/* Right Column: Output Canvas */}
            <div className="lg:col-span-7 xl:col-span-8">
              {!generatedResult ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/5 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Create</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your parameters on the left and hit generate. Your crafted prompt and quality analysis will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <GeneratedPromptCard 
                    prompt={generatedResult.prompt}
                    negativePrompt={generatedResult.negativePrompt || null}
                    toolSlug={slug}
                    mode={selectedMode}
                    qualityScore={generatedResult.qualityScore.score}
                    sessionId={sessionId}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="md:col-span-1">
                      <QualityScorePanel qualityScore={generatedResult.qualityScore} />
                    </div>
                    <div className="md:col-span-1">
                      <PromptFragmentsView fragments={generatedResult.fragments} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
        
        {/* SEO Content */}
        {tool.seoContent && (
          <ToolSeoContent content={tool.seoContent} toolName={tool.name} />
        )}
      </main>

      <Footer />
    </div>
  );
}
