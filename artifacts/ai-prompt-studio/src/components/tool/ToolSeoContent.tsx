import { ChevronDown, BookOpen } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToolSeoContentProps {
  content: string;
  toolName: string;
}

export function ToolSeoContent({ content, toolName }: ToolSeoContentProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <div className="w-full max-w-screen-xl mx-auto py-12 px-4 border-t border-border/40 mt-12">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full max-w-3xl mx-auto">
        <CollapsibleTrigger asChild>
          <div className="flex flex-col items-center justify-center gap-3 cursor-pointer group py-4">
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Learn more about {toolName} Generation</h3>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-300", isOpen && "rotate-180")} />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-8">
          <div className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 mx-auto bg-card rounded-2xl p-6 md:p-10 border shadow-sm">
            {/* Split by double newline for basic markdown rendering if it's text */}
            {content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('# ')) return <h1 key={i}>{paragraph.replace('# ', '')}</h1>;
              if (paragraph.startsWith('## ')) return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
              if (paragraph.startsWith('### ')) return <h3 key={i}>{paragraph.replace('### ', '')}</h3>;
              
              // Handle lists
              if (paragraph.includes('\n- ')) {
                const lines = paragraph.split('\n');
                const heading = lines[0].startsWith('- ') ? null : lines[0];
                const items = lines.filter(l => l.startsWith('- ')).map(l => l.replace('- ', ''));
                
                return (
                  <div key={i}>
                    {heading && <p>{heading}</p>}
                    <ul>
                      {items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  </div>
                );
              }
              
              return <p key={i}>{paragraph}</p>;
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
