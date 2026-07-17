import { Link } from "wouter";
import { useListTools } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Image as ImageIcon, Sparkles, Youtube, Package, Camera } from "lucide-react";

export function ToolsSection() {
  const { data: tools, isLoading } = useListTools();

  const iconMap: Record<string, React.ReactNode> = {
    "logo-prompt": <Sparkles className="h-8 w-8" />,
    "product-photo-prompt": <Camera className="h-8 w-8" />,
    "portrait-prompt": <ImageIcon className="h-8 w-8" />,
    "youtube-thumbnail-prompt": <Youtube className="h-8 w-8" />,
    "packaging-prompt": <Package className="h-8 w-8" />,
  };

  return (
    <section id="tools" className="py-24 bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              The Studio <span className="text-secondary">Suite</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose a specialized generator below. Each tool uses custom-trained templates optimized for specific design disciplines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl border border-border/50 bg-card p-6 flex flex-col">
                <Skeleton className="h-16 w-16 rounded-xl mb-6" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full mb-auto" />
                <Skeleton className="h-10 w-full mt-6" />
              </div>
            ))
          ) : (
            tools?.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                <div className="group h-full p-8 rounded-2xl bg-card border border-border/50 hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl cursor-pointer">
                  <div className="h-16 w-16 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 shadow-inner">
                    {iconMap[tool.slug] || <Sparkles className="h-8 w-8" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-auto flex items-center text-sm font-semibold text-foreground group-hover:text-secondary transition-colors">
                    Open Generator 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
