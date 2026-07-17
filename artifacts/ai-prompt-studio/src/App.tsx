import { useEffect, useRef, lazy, Suspense } from "react";
import { useWebVitals } from "@/hooks/useWebVitals";
import { Loader2 } from 'lucide-react';
import { ClerkProvider, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { Switch, Route, useLocation, Router as WouterRouter } from 'wouter';

const HomePage = lazy(() => import('./pages/HomePage'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SeoPage = lazy(() => import('./pages/SeoPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFound = lazy(() => import('./pages/not-found'));

// Clerk publishable key — derived from hostname (Replit proxy) or env var.
// May be null in dev environments without Clerk configured.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// When no Clerk key is available the app runs in "auth-less" mode:
// all prompt generation features work, sign-in/sign-up pages are hidden.
const hasClerk = !!clerkPubKey;

// Empty in dev (intentional), auto-set in prod via Replit Clerk proxy.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#8B5CF6",
    colorForeground: "#f1f5f9",
    colorMutedForeground: "#94a3b8",
    colorDanger: "#ef4444",
    colorBackground: "#0f0f1a",
    colorInput: "#1e293b",
    colorInputForeground: "#f1f5f9",
    colorNeutral: "#334155",
    fontFamily: "'Outfit', sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#0f0f1a] border border-[#1e293b] rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl shadow-violet-500/10",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#f1f5f9] font-bold text-2xl",
    headerSubtitle: "text-[#94a3b8]",
    socialButtonsBlockButtonText: "text-[#f1f5f9] font-medium",
    socialButtonsBlockButton: "!border-[#334155] !bg-[#1e293b] hover:!bg-[#263548]",
    formFieldLabel: "text-[#94a3b8] text-sm",
    formFieldInput: "!bg-[#1e293b] !border-[#334155] !text-[#f1f5f9] focus:!border-[#8B5CF6]",
    formButtonPrimary: "!bg-[#8B5CF6] hover:!bg-[#7C3AED] !text-white font-semibold",
    footerActionLink: "!text-[#8B5CF6] hover:!text-[#7C3AED]",
    footerActionText: "!text-[#94a3b8]",
    footerAction: "!bg-transparent",
    dividerText: "!text-[#94a3b8]",
    dividerLine: "!bg-[#1e293b]",
    identityPreviewEditButton: "!text-[#8B5CF6]",
    formFieldSuccessText: "!text-emerald-400",
    alertText: "!text-[#f1f5f9]",
    alert: "!border-[#334155] !bg-[#1e293b]",
    otpCodeFieldInput: "!border-[#334155] !bg-[#1e293b] !text-[#f1f5f9]",
    logoBox: "mb-2",
    logoImage: "h-10 w-auto",
    formFieldRow: "gap-2",
    main: "gap-4",
  },
};

/** Clears React Query cache when the Clerk user changes. Only rendered inside ClerkProvider. */
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

/** Core route table — works with or without Clerk. */
function AppRouter() {
  useWebVitals();
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={HomePage} />
        {/* Sign-in / sign-up only available when Clerk is configured */}
        {hasClerk && <Route path="/sign-in/*?" component={SignInPage} />}
        {hasClerk && <Route path="/sign-up/*?" component={SignUpPage} />}
        <Route path="/tools/:slug" component={ToolPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/favorites" component={FavoritesPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route path="/seo" component={SeoPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

/** Wraps the app with ClerkProvider when a publishable key is available. */
function AppProviders() {
  const [, setLocation] = useLocation();

  const core = (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );

  if (!hasClerk) return core;

  return (
    <ClerkProvider
      publishableKey={clerkPubKey!}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to AI Prompt Studio" } },
        signUp: { start: { title: "Create your account", subtitle: "Start generating premium prompts" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Cache invalidator must live inside ClerkProvider */}
          <ClerkQueryClientCacheInvalidator />
          <AppRouter />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WouterRouter base={basePath}>
        <AppProviders />
      </WouterRouter>
    </ThemeProvider>
  );
}

export default App;
