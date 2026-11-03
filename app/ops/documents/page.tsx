"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FolderArchive,
  Folder,
  Plus,
  Search,
  FileText,
  Link2,
  Code2,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  Edit3,
  Eye,
  Check,
  Copy,
  Lock,
  Globe,
  Pin,
  Calendar,
  Layers,
  X,
  FileBadge,
  Filter,
} from "lucide-react";

interface DocumentFolder {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string | null;
  sortOrder: number;
}

interface DocumentItem {
  id: string;
  title: string;
  description?: string | null;
  folderId?: string | null;
  fileType: string;
  fileUrl?: string | null;
  fileSize?: string | null;
  content?: string | null;
  tags: string[];
  isPublic: boolean;
  pinned: boolean;
  issuedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  folder?: DocumentFolder | null;
}

export default function OpsDocumentsPage() {
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Modal states
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [docForm, setDocForm] = useState<Partial<DocumentItem>>({
    title: "",
    description: "",
    folderId: "",
    fileType: "pdf",
    fileUrl: "",
    fileSize: "",
    content: "",
    tags: [],
    isPublic: true,
    pinned: false,
    issuedAt: "",
  });
  const [tagInput, setTagInput] = useState("");

  const [folderForm, setFolderForm] = useState<Partial<DocumentFolder>>({
    name: "",
    icon: "folder",
    color: "#FFB44B",
    description: "",
  });
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  // Fetch documents and folders
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ops/documents");
      const data = await res.json();
      if (Array.isArray(data.folders)) setFolders(data.folders);
      if (Array.isArray(data.documents)) setDocuments(data.documents);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        doc.title.toLowerCase().includes(q) ||
        (doc.description && doc.description.toLowerCase().includes(q)) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));

      const matchFolder =
        selectedFolderId === "all" ||
        (selectedFolderId === "unorganized" && !doc.folderId) ||
        doc.folderId === selectedFolderId;

      const matchType = selectedType === "all" || doc.fileType === selectedType;

      return matchSearch && matchFolder && matchType;
    });
  }, [documents, searchQuery, selectedFolderId, selectedType]);

  // Counts
  const publicCount = documents.filter((d) => d.isPublic).length;
  const privateCount = documents.length - publicCount;

  // Open Document Modal for Create or Edit
  const handleOpenDocModal = (doc?: DocumentItem) => {
    if (doc) {
      setDocForm({
        ...doc,
        issuedAt: doc.issuedAt ? doc.issuedAt.split("T")[0] : "",
      });
      setTagInput(doc.tags.join(", "));
    } else {
      setDocForm({
        title: "",
        description: "",
        folderId: selectedFolderId !== "all" && selectedFolderId !== "unorganized" ? selectedFolderId : "",
        fileType: "pdf",
        fileUrl: "",
        fileSize: "",
        content: "",
        tags: ["Document"],
        isPublic: true,
        pinned: false,
        issuedAt: new Date().toISOString().split("T")[0],
      });
      setTagInput("Document");
    }
    setIsDocModalOpen(true);
  };

  // Submit Document Form
  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title?.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        action: docForm.id ? "update_document" : "create_document",
        ...docForm,
        tags,
      };

      const res = await fetch("/api/ops/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save document");
      await fetchData();
      setIsDocModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  // Delete Document
  const handleDeleteDoc = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch("/api/ops/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_document", id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  // Open Folder Modal
  const handleOpenFolderModal = (folder?: DocumentFolder) => {
    if (folder) {
      setEditingFolderId(folder.id);
      setFolderForm({
        name: folder.name,
        icon: folder.icon,
        color: folder.color,
        description: folder.description || "",
      });
    } else {
      setEditingFolderId(null);
      setFolderForm({
        name: "",
        icon: "folder",
        color: "#FFB44B",
        description: "",
      });
    }
    setIsFolderModalOpen(true);
  };

  // Submit Folder Form
  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderForm.name?.trim()) {
      alert("Folder name is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        action: editingFolderId ? "update_folder" : "create_folder",
        id: editingFolderId,
        ...folderForm,
      };

      const res = await fetch("/api/ops/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save folder");
      await fetchData();
      setIsFolderModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save folder");
    } finally {
      setSaving(false);
    }
  };

  // Delete Folder
  const handleDeleteFolder = async (id: string, name: string) => {
    if (!confirm(`Delete folder "${name}"? Documents inside will remain unorganized.`)) return;
    try {
      const res = await fetch("/api/ops/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_folder", id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      if (selectedFolderId === id) setSelectedFolderId("all");
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete folder");
    }
  };

  const handleCopyLink = (url?: string | null, id?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

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
    <div className="space-y-6 font-sans">
      {/* Header telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-accent" />
            <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary">
              DIGITAL DOCUMENTS HUB
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-semibold">
              Folder Management
            </span>
          </div>
          <p className="text-xs font-mono text-text-muted mt-1">
            Organize digital credentials, resume variants, tax &amp; invoices, architectural RFCs, and cheat sheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenFolderModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg-surface text-text-secondary hover:text-text-primary hover:border-text-primary text-xs font-mono transition-colors cursor-pointer"
          >
            <Folder className="w-3.5 h-3.5 text-accent" />
            <span>+ New Folder</span>
          </button>

          <button
            onClick={() => handleOpenDocModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-black font-semibold text-xs font-mono hover:bg-accent/90 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-bg-surface border border-border rounded-xl">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Total Items</span>
          <span className="text-xl font-mono font-bold text-text-primary">{documents.length}</span>
        </div>
        <div className="p-3.5 bg-bg-surface border border-border rounded-xl">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Folders</span>
          <span className="text-xl font-mono font-bold text-accent">{folders.length}</span>
        </div>
        <div className="p-3.5 bg-bg-surface border border-border rounded-xl">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Public / Showcase</span>
          <span className="text-xl font-mono font-bold text-emerald-400">{publicCount}</span>
        </div>
        <div className="p-3.5 bg-bg-surface border border-border rounded-xl">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Private / Internal</span>
          <span className="text-xl font-mono font-bold text-text-muted">{privateCount}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Folders Sidebar (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-bg-surface border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted pb-2 border-b border-border/60">
              <span className="font-semibold uppercase tracking-wider">FOLDERS</span>
              <span>{folders.length}</span>
            </div>

            <div className="space-y-1">
              {/* All Documents Tab */}
              <button
                onClick={() => setSelectedFolderId("all")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedFolderId === "all"
                    ? "bg-accent/15 text-accent font-bold border border-accent/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FolderArchive className="w-3.5 h-3.5 text-accent" />
                  <span>All Documents</span>
                </div>
                <span className="text-[10px] opacity-60">{documents.length}</span>
              </button>

              {/* Dynamic Folders */}
              {folders.map((folder) => {
                const count = documents.filter((d) => d.folderId === folder.id).length;
                const isSelected = selectedFolderId === folder.id;

                return (
                  <div
                    key={folder.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-accent/15 text-accent font-bold border-accent/30"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated border-transparent"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedFolderId(folder.id)}
                      className="flex items-center gap-2 truncate flex-1 text-left cursor-pointer"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: folder.color || "#FFB44B" }}
                      />
                      <span className="truncate">{folder.name}</span>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] opacity-60 group-hover:hidden">{count}</span>
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button
                          onClick={() => handleOpenFolderModal(folder)}
                          className="p-0.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                          title="Edit Folder"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(folder.id, folder.name)}
                          className="p-0.5 text-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Folder"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Unorganized Tab */}
              <button
                onClick={() => setSelectedFolderId("unorganized")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedFolderId === "unorganized"
                    ? "bg-accent/15 text-accent font-bold border border-accent/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder className="w-3.5 h-3.5 text-text-muted" />
                  <span>Unorganized</span>
                </div>
                <span className="text-[10px] opacity-60">
                  {documents.filter((d) => !d.folderId).length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Documents Grid & Toolbar (9 Cols) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Search & Type Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-bg-surface border border-border rounded-xl p-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents by title, description, or tag..."
                className="w-full bg-bg border border-border focus:border-accent rounded-lg pl-8 pr-4 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              {["all", "pdf", "link", "markdown", "code", "image"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-semibold transition-colors cursor-pointer border ${
                    selectedType === t
                      ? "bg-accent/20 border-accent/40 text-accent font-bold"
                      : "bg-bg border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Document Cards */}
          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-text-muted">
              Loading documents...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl py-16 text-center text-xs font-mono text-text-muted space-y-3">
              <FolderArchive className="w-8 h-8 mx-auto text-accent/50" />
              <p>No documents found in this view.</p>
              <button
                onClick={() => handleOpenDocModal()}
                className="px-3 py-1.5 rounded-lg bg-accent text-black font-semibold text-xs font-mono hover:bg-accent/90 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Document</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDocs.map((doc) => {
                return (
                  <div
                    key={doc.id}
                    className="p-4 bg-bg-surface border border-border hover:border-text-primary/40 rounded-xl space-y-3 transition-all relative group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-1.5 truncate">
                          {getTypeIcon(doc.fileType)}
                          {doc.folder ? (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold border truncate"
                              style={{
                                borderColor: `${doc.folder.color}40`,
                                color: doc.folder.color,
                                backgroundColor: `${doc.folder.color}15`,
                              }}
                            >
                              {doc.folder.name}
                            </span>
                          ) : (
                            <span className="text-[10px] text-text-muted font-mono">// Unfiled</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {doc.pinned && (
                            <span title="Pinned">
                              <Pin className="w-3 h-3 text-accent fill-accent" />
                            </span>
                          )}
                          {doc.isPublic ? (
                            <span
                              className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
                              title="Public Showcase"
                            >
                              <Globe className="w-2.5 h-2.5" />
                              <span>PUBLIC</span>
                            </span>
                          ) : (
                            <span
                              className="px-1.5 py-0.2 rounded text-[9px] bg-bg border border-border text-text-muted flex items-center gap-1"
                              title="Private Internal Only"
                            >
                              <Lock className="w-2.5 h-2.5" />
                              <span>PRIVATE</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-xs text-text-muted line-clamp-2 mt-0.5 font-serif">
                            {doc.description}
                          </p>
                        )}
                      </div>

                      {/* Metadata row */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-text-muted pt-1">
                        {doc.fileSize && <span>{doc.fileSize}</span>}
                        {doc.issuedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 opacity-60" />
                            <span>{new Date(doc.issuedAt).toLocaleDateString()}</span>
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {doc.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg text-text-muted border border-border/60"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-mono">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="inline-flex items-center gap-1 text-accent hover:underline cursor-pointer font-semibold text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {doc.fileUrl && (
                          <button
                            onClick={() => handleCopyLink(doc.fileUrl, doc.id)}
                            className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                            title="Copy File URL"
                          >
                            {copiedId === doc.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenDocModal(doc)}
                          className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                          title="Edit Document"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteDoc(doc.id, doc.title)}
                          className="p-1 text-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Document Create / Edit Modal ────────────────────────────── */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-base font-bold font-mono text-text-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <span>{docForm.id ? "EDIT DOCUMENT" : "NEW DIGITAL DOCUMENT"}</span>
              </h2>
              <button
                onClick={() => setIsDocModalOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docForm.title || ""}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder="e.g. AWS Solutions Architect Certificate / Master CV"
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-text-muted uppercase tracking-wider block">Folder</label>
                  <select
                    value={docForm.folderId || ""}
                    onChange={(e) => setDocForm({ ...docForm, folderId: e.target.value })}
                    className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                  >
                    <option value="">(No folder / Unfiled)</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-text-muted uppercase tracking-wider block">File Type</label>
                  <select
                    value={docForm.fileType || "pdf"}
                    onChange={(e) => setDocForm({ ...docForm, fileType: e.target.value })}
                    className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="link">Cloud Link / Drive</option>
                    <option value="markdown">Markdown / Spec</option>
                    <option value="code">Code / Script</option>
                    <option value="image">Image / Scan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">File URL or External Link</label>
                <input
                  type="url"
                  value={docForm.fileUrl || ""}
                  onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                  placeholder="https://drive.google.com/... or https://..."
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-text-muted uppercase tracking-wider block">File Size / Format Badge</label>
                  <input
                    type="text"
                    value={docForm.fileSize || ""}
                    onChange={(e) => setDocForm({ ...docForm, fileSize: e.target.value })}
                    placeholder="e.g. 2.4 MB / Cloud"
                    className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-muted uppercase tracking-wider block">Issued / Effective Date</label>
                  <input
                    type="date"
                    value={docForm.issuedAt || ""}
                    onChange={(e) => setDocForm({ ...docForm, issuedAt: e.target.value })}
                    className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Description / Notes</label>
                <textarea
                  rows={2}
                  value={docForm.description || ""}
                  onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                  placeholder="Context, credential verification ID, or overview..."
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. AWS, Certifications, 2026"
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={docForm.isPublic ?? true}
                    onChange={(e) => setDocForm({ ...docForm, isPublic: e.target.checked })}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <label htmlFor="isPublic" className="text-text-primary cursor-pointer">
                    Public Showcase (visible at /documents)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={docForm.pinned ?? false}
                    onChange={(e) => setDocForm({ ...docForm, pinned: e.target.checked })}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <label htmlFor="pinned" className="text-text-primary cursor-pointer">
                    Pin to Top
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-border text-text-muted hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Folder Create / Edit Modal ──────────────────────────────── */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-base font-bold font-mono text-text-primary flex items-center gap-2">
                <Folder className="w-4 h-4 text-accent" />
                <span>{editingFolderId ? "EDIT FOLDER" : "CREATE NEW FOLDER"}</span>
              </h2>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Folder Name *</label>
                <input
                  type="text"
                  required
                  value={folderForm.name || ""}
                  onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                  placeholder="e.g. Certifications & Credentials"
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Folder Color Tag</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={folderForm.color || "#FFB44B"}
                    onChange={(e) => setFolderForm({ ...folderForm, color: e.target.value })}
                    className="w-8 h-8 rounded border border-border bg-bg cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={folderForm.color || "#FFB44B"}
                    onChange={(e) => setFolderForm({ ...folderForm, color: e.target.value })}
                    className="flex-1 bg-bg border border-border focus:border-accent rounded-lg px-3 py-1.5 text-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={folderForm.description || ""}
                  onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
                  placeholder="What belongs in this folder..."
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none font-sans"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-border text-text-muted hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Document Preview Modal ──────────────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 space-y-4 shadow-2xl">
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
                <div className="p-3 bg-bg rounded-lg border border-border/60 text-text-secondary font-serif leading-relaxed">
                  {previewDoc.description}
                </div>
              )}

              {previewDoc.fileUrl && (
                <div className="p-4 bg-bg border border-border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="truncate w-full sm:w-auto">
                    <span className="text-text-muted block text-[10px]">DIRECT ACCESS URL</span>
                    <span className="text-accent truncate block">{previewDoc.fileUrl}</span>
                  </div>
                  <a
                    href={previewDoc.fileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3 py-1.5 rounded-lg bg-accent text-black font-semibold flex items-center gap-1.5 shrink-0 hover:bg-accent/90 transition-colors"
                  >
                    <span>Open External</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {previewDoc.content && (
                <div className="space-y-1">
                  <span className="text-text-muted text-[10px] uppercase tracking-wider block">[ Inline Document Content ]</span>
                  <pre className="p-4 bg-bg border border-border rounded-lg text-text-primary overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                    {previewDoc.content}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted">
                Created {new Date(previewDoc.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
