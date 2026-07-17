import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useUser, useClerk, Show } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function Header() {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/tools/logo-prompt", label: "Logo" },
    { href: "/tools/product-photo-prompt", label: "Product" },
    { href: "/tools/portrait-prompt", label: "Portrait" },
    { href: "/tools/youtube-thumbnail-prompt", label: "Thumbnail" },
    { href: "/tools/packaging-prompt", label: "Packaging" },
    { href: "/history", label: "History" },
    { href: "/favorites", label: "Favorites" },
    { href: "/analytics", label: "Analytics" },
  ];

  const getInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress.charAt(0).toUpperCase();
    }
    return "U";
  };

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

          <Show when="signed-out">
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" className="h-9 px-4 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="h-9 px-4 font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(139,92,246,0.5)] dark:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
                  Start Free
                </Button>
              </Link>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                {getInitial()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ redirectUrl: basePath || "/" })}
                className="h-8 px-3 text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            </div>
          </Show>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl absolute top-16 left-0 w-full p-4 shadow-lg flex flex-col gap-4">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors p-2 rounded-md hover:bg-muted ${
                  location === item.href ? "bg-muted/50 text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 px-2 py-2 border-t border-border/40">
            <span className="text-sm font-medium text-muted-foreground mr-auto">Theme</span>
            <ThemeToggle />
          </div>

          <div className="pt-2 flex flex-col gap-2 border-t border-border/40">
            <Show when="signed-out">
              <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Free
                </Button>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                    {getInitial()}
                  </div>
                  <span className="text-sm font-medium">
                    {user?.firstName || user?.primaryEmailAddress?.emailAddress || "Account"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut({ redirectUrl: basePath || "/" });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign Out
                </Button>
              </div>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
