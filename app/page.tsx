import RetroMasthead from "@/components/retro/RetroMasthead";
import RetroFrontispiece from "@/components/retro/RetroFrontispiece";
import RetroBlueprintBench from "@/components/retro/RetroBlueprintBench";
import RetroExhibition from "@/components/retro/RetroExhibition";
import RetroLedger from "@/components/retro/RetroLedger";
import RetroDispatches from "@/components/retro/RetroDispatches";
import RetroMemorandum from "@/components/retro/RetroMemorandum";
import RetroColophon from "@/components/retro/RetroColophon";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/15 selection:text-text-primary transition-colors duration-300">
      {/* Outer framing wrapper ensuring serene white space */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* 1. Archival Broadsheet Masthead */}
        <RetroMasthead />

        <main className="space-y-6 sm:space-y-8">
          {/* 2. The Frontispiece: Archival Portrait & Lead Dossier */}
          <RetroFrontispiece />

          {/* 3. The Primitives Bench: Architecture Field Notes (patterns, not products) */}
          <RetroBlueprintBench />

          {/* 4. Exhibition: Featured Engineering Works Only */}
          <RetroExhibition />

          {/* 5. The Chronicle: Permanent Ledger of Work & Ventures */}
          <RetroLedger />

          {/* 6. Published Dispatches: Engineering Monologues Preview */}
          <RetroDispatches />

          {/* 7. Postbox & Memorandum: Direct Technical Inquiries */}
          <RetroMemorandum />
        </main>

        {/* 8. Archival Colophon & Specification */}
        <RetroColophon />
        
      </div>
    </div>
  );
}
