import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full space-y-8 font-mono text-center">

        {/* Archival section label */}
        <div className="text-[11px] text-accent font-semibold uppercase tracking-widest">
          [ ERROR // DISPATCH NOT FOUND ]
        </div>

        {/* Large editorial 404 */}
        <div className="font-serif text-[8rem] sm:text-[10rem] font-normal leading-none text-text-primary/10 select-none">
          404
        </div>

        {/* Message */}
        <div className="space-y-3 -mt-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-text-primary">
            Dispatch Not Found
          </h1>
          <p className="text-sm text-text-secondary font-sans leading-relaxed">
            The page or record you requested does not exist in the archive.
            It may have been moved, deleted, or never filed.
          </p>
        </div>

        {/* Action */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded border border-border hover:border-text-primary bg-bg-surface hover:bg-bg text-text-primary text-xs font-mono font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Masthead</span>
          </Link>
        </div>

        {/* Colophon */}
        <div className="pt-4 text-[10px] text-text-muted tracking-widest uppercase border-t border-border/40">
          joychandrauday.vercel.app · Engineering Dossier
        </div>
      </div>
    </div>
  );
}
