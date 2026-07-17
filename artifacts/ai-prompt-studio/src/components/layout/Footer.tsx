import { Link } from "wouter";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 py-12 md:py-16">
      <div className="container max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                AI Prompt Studio
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The premium creative toolkit for designers, marketers, and content creators. Generate pixel-perfect prompts for any AI image model.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground tracking-wide">Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools/logo-prompt" className="hover:text-primary transition-colors">Logo Design</Link></li>
              <li><Link href="/tools/product-photo-prompt" className="hover:text-primary transition-colors">Product Photography</Link></li>
              <li><Link href="/tools/portrait-prompt" className="hover:text-primary transition-colors">AI Portraits</Link></li>
              <li><Link href="/tools/youtube-thumbnail-prompt" className="hover:text-primary transition-colors">YouTube Thumbnails</Link></li>
              <li><Link href="/tools/packaging-prompt" className="hover:text-primary transition-colors">Packaging Design</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground tracking-wide">Studio</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/history" className="hover:text-primary transition-colors">My History</Link></li>
              <li><Link href="/favorites" className="hover:text-primary transition-colors">Favorites</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground tracking-wide">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Prompt Studio. All rights reserved.</p>
          <p className="flex items-center gap-1">Crafted with precision.</p>
        </div>
      </div>
    </footer>
  );
}
