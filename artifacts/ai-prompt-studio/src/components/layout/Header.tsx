import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/tools/logo-prompt", label: "Logo" },
    { href: "/tools/product-photo-prompt", label: "Product" },
    { href: "/tools/portrait-prompt", label: "Portrait" },
    { href: "/tools/youtube-thumbnail-prompt", label: "Thumbnail" },
    { href: "/tools/packaging-prompt", label: "Packaging" },
    { href: "/history", label: "History" },
    { href: "/favorites", label: "Favorites" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
              AI Prompt Studio
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`transition-colors hover:text-foreground ${
                  location === item.href ? "text-foreground" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
          </div>
          <Link href="/tools/logo-prompt">
            <Button className="h-9 px-4 font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(139,92,246,0.5)] dark:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
              Start Free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
