"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Link2,
  Minus,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  X,
  Check,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Write insightful engineering analysis...",
}: RichTextEditorProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[320px] p-4 text-text-primary leading-relaxed font-sans",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when loaded/switched externally
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) return null;

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() }).run();
      setImageUrl("");
      setImageAlt("");
      setIsImageModalOpen(false);
    }
  };

  const handleSetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    }
    setLinkUrl("");
    setIsLinkModalOpen(false);
  };

  return (
    <div className="border border-border rounded-xl bg-bg-surface overflow-hidden flex flex-col">
      {/* ── Visual Formatting Toolbar ──────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-bg border-b border-border text-text-secondary select-none">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 1 })
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-border mx-1" />

        {/* Basic Styles */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("bold")
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Bold [Ctrl+B]"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("italic")
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Italic [Ctrl+I]"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("strike")
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("code")
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-border mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "left" })
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "center" })
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive({ textAlign: "right" })
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-border mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-border mx-1" />

        {/* Media: Image & Link */}
        <button
          type="button"
          onClick={() => setIsImageModalOpen(true)}
          className="p-1.5 rounded hover:bg-bg-elevated hover:text-accent transition-colors cursor-pointer"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setLinkUrl(editor.getAttributes("link").href || "");
            setIsLinkModalOpen(true);
          }}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("link")
              ? "bg-accent/20 text-accent font-bold"
              : "hover:bg-bg-elevated hover:text-text-primary"
          }`}
          title="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-border mx-1" />

        {/* Clear & History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer disabled:opacity-30"
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer disabled:opacity-30"
          title="Redo"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Editor Canvas ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-bg-surface">
        <EditorContent editor={editor} />
      </div>

      {/* ── Image Insert Modal ─────────────────────────────────────── */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold font-mono text-text-primary flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-accent" />
                <span>INSERT MEDIA / IMAGE</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertImage} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /images/..."
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Alt Text (Accessibility &amp; SEO)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Architecture diagram of append-only ledger"
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              {imageUrl && (
                <div className="p-2 bg-bg border border-border rounded-lg text-center">
                  <span className="text-[10px] text-text-muted block mb-1">IMAGE PREVIEW</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-36 mx-auto rounded object-cover border border-border"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 cursor-pointer"
                >
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Link Insert Modal ──────────────────────────────────────── */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold font-mono text-text-primary flex items-center gap-2">
                <Link2 className="w-4 h-4 text-accent" />
                <span>HYPERLINK</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSetLink} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Destination URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 cursor-pointer"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
