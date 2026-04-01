import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AppRoot } from "./pages/AppView";
import { LandingPage } from "./pages/LandingPage";

type View = "landing" | "app";

export default function App() {
  const [view, setView] = useState<View>("landing");

  return (
    <>
      {view === "landing" ? (
        <LandingPage onGetStarted={() => setView("app")} />
      ) : (
        <AppRoot />
      )}
      <Toaster />
    </>
  );
}
