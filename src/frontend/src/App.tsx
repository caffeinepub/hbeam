import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useState } from "react";

const AppRoot = lazy(() =>
  import("./pages/AppView").then((m) => ({ default: m.AppRoot })),
);
const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage })),
);

type View = "landing" | "app";

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.11 0.012 240)" }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: "oklch(0.82 0.19 152)" }}
        aria-label="Loading"
      />
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("landing");

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        {view === "landing" ? (
          <LandingPage onGetStarted={() => setView("app")} />
        ) : (
          <AppRoot />
        )}
      </Suspense>
      <Toaster />
    </>
  );
}
