"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  FolderArchive,
  ArrowLeft,
  Search,
  ExternalLink,
  FileBadge,
  Link2,
  FileText,
  Code2,
  Image as ImageIcon,
  Calendar,
  Eye,
  X,
  Compass,
} from "lucide-react";

interface PublicFolder {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface PublicDocument {
  id: string;
  title: string;
  description?: string | null;
  folderId?: string | null;
  fileType: string;
  fileUrl?: string | null;
  fileSize?: string | null;
  content?: string | null;
  tags: string[];
  pinned: boolean;
  issuedAt?: string | null;
  createdAt: string;
  folder?: PublicFolder | null;
}

export default function PublicDocumentsPage() {
  const { isBn } = useLanguage();
  const [folders, setFolders] = useState<PublicFolder[]>([]);
  const [documents, setDocuments] = useState<PublicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [previewDoc, setPreviewDoc] = useState<PublicDocument | null>(null);

  useEffect(() => {
    async function loadPublicDocs() {
      try {
        const res = await fetch("/api/ops/documents?public=true");
        const data = await res.json();
        if (Array.isArray(data.folders)) setFolders(data.folders);
        if (Array.isArray(data.documents)) setDocuments(data.documents);
      } catch (err) {
        console.error("Failed to load public documents", err);
      } finally {
        setLoading(false);
      }
    }
    loadPublicDocs();
  }, []);

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        doc.title.toLowerCase().includes(q) ||
        (doc.description && doc.description.toLowerCase().includes(q)) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));

      const matchFolder =
        selectedFolderId === "all" || doc.folderId === selectedFolderId;

      return matchSearch && matchFolder;
    });
  }, [documents, searchQuery, selectedFolderId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileBadge className="w-4 h-4 text-rose-400" />;
      case "link":
        return <Link2 className="w-4 h-4 text-blue-400" />;
      case "markdown":
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case "code":
        return <Code2 className="w-4 h-4 text-accent" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/15 selection:text-text-primary font-sans">
      <main className="max-w-4xl mx-auto px-6 py-10 sm:py-14 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? "মূল পোর্টফোলিওতে ফিরুন" : "return to home"}</span>
          </Link>
          <div className="text-[11px] font-mono text-text-muted flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>VERIFIED ARTIFACTS &amp; DOCUMENTS</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase">
            // Digital Archive &amp; Proof of Work
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary">
            {isBn ? "ডিজিটাল ডকুমেন্টস ও সনদপত্র" : "Digital Documents & Credentials"}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-serif max-w-2xl">
            {isBn
              ? "যাচাইকৃত সনদপত্র, রেজ্যুমে সংস্করণ, আর্কিটেকচারাল পেপার্স এবং পাবলিক ডিজিটাল ডকুমেন্টস সংকলন।"
              : "A curated repository of verified certifications, curriculum vitae editions, system architecture RFCs, and public engineering documents."}
          </p>
        </div>

        {/* Search & Folder Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "ডকুমেন্ট বা সনদ খুঁজুন..." : "Filter documents by name or concept..."}
              className="w-full bg-bg-surface border border-border focus:border-text-primary rounded-lg pl-8 pr-4 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
            />
          </div>

          {/* Folder Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pb-1">
            <button
              onClick={() => setSelectedFolderId("all")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                selectedFolderId === "all"
                  ? "bg-accent/15 border-accent text-accent font-bold"
                  : "bg-bg-surface border-border text-text-muted hover:text-text-primary"
              }`}
            >
              All Documents ({documents.length})
            </button>

            {folders.map((folder) => {
              const count = documents.filter((d) => d.folderId === folder.id).length;
              if (count === 0) return null;

              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-2 ${
                    selectedFolderId === folder.id
                      ? "bg-accent/15 border-accent text-accent font-bold"
                      : "bg-bg-surface border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: folder.color || "#FFB44B" }}
                  />
                  <span>{folder.name}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Document Items Grid */}
        <div className="space-y-3 pt-2">
          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-text-muted">
              Loading public documents...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 border border-dashed border-border rounded-xl text-center text-xs font-mono text-text-muted">
              No public documents match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 bg-bg-surface border border-border/80 hover:border-accent rounded-xl transition-all space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(doc.fileType)}
                        {doc.folder && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-semibold border"
                            style={{
                              borderColor: `${doc.folder.color}40`,
                              color: doc.folder.color,
                              backgroundColor: `${doc.folder.color}15`,
                            }}
                          >
                            {doc.folder.name}
                          </span>
                        )}
                      </div>

                      {doc.fileSize && (
                        <span className="text-[10px] text-text-muted font-mono">{doc.fileSize}</span>
                      )}
                    </div>

                    <h2 className="text-base font-bold font-serif text-text-primary group-hover:text-accent transition-colors">
                      {doc.title}
                    </h2>

                    {doc.description && (
                      <p className="text-xs text-text-secondary font-serif line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-text-muted">
                      {doc.issuedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 opacity-60" />
                          <span>{new Date(doc.issuedAt).toLocaleDateString()}</span>
                        </span>
                      )}
                      {doc.tags.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-bg text-text-muted">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="text-text-muted hover:text-text-primary inline-flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isBn ? "প্রিভিউ" : "View Details"}</span>
                    </button>

                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-accent hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>{isBn ? "ডকুমেন্ট খুলুন" : "Access File"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Public Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-xl max-h-[85vh] flex flex-col p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 truncate">
                {getTypeIcon(previewDoc.fileType)}
                <h3 className="text-base font-bold text-text-primary truncate">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs font-mono">
              {previewDoc.description && (
                <div className="p-3 bg-bg rounded-lg border border-border/60 text-text-secondary font-serif leading-relaxed text-sm">
                  {previewDoc.description}
                </div>
              )}

              {previewDoc.content && (
                <pre className="p-4 bg-bg border border-border rounded-lg text-text-primary overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {previewDoc.content}
                </pre>
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Close
              </button>

              {previewDoc.fileUrl && (
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-4 py-1.5 rounded-lg bg-accent text-black font-semibold flex items-center gap-1.5 hover:bg-accent/90"
                >
                  <span>Open Full Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
