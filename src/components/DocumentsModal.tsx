import React, { useState } from "react";
import { 
  X, 
  FileText, 
  UploadCloud, 
  Trash2, 
  Sparkles, 
  Database,
  Search,
  Check
} from "lucide-react";
import { DocumentRecord } from "../types.js";

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentRecord[];
  onUploadDocument: (filename: string, content: string) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
  onQueryDocument: (query: string) => void;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({
  isOpen,
  onClose,
  documents,
  onUploadDocument,
  onDeleteDocument,
  onQueryDocument
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(documents[0] || null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsUploading(true);
    await onUploadDocument(newTitle.trim(), newContent.trim());
    setIsUploading(false);
    setUploadSuccess(true);
    setNewTitle("");
    setNewContent("");
    setTimeout(() => setUploadSuccess(false), 2000);
  };

  const filteredDocs = documents.filter(d => 
    d.filename.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        id="documents-rag-modal"
        className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              RAG Knowledge Base & Document Store
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Uploaded documents are automatically chunked, metadata-indexed, and cited during chat synthesis.
            </p>
          </div>
          <button
            id="close-docs-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document List */}
          <div className="w-1/3 border-r border-zinc-800 flex flex-col bg-zinc-950/30">
            {/* Search */}
            <div className="p-3 border-b border-zinc-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter documents..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    id={`doc-item-${doc.id}`}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between group ${
                      isSelected
                        ? "bg-zinc-800 border border-zinc-700 text-white"
                        : "hover:bg-zinc-800/40 text-zinc-300 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-medium truncate">{doc.filename}</p>
                        <p className="text-[10px] text-zinc-400">{doc.chunkCount} chunks • {Math.round(doc.fileSize / 1024)} KB</p>
                      </div>
                    </div>
                    {doc.id !== "doc_omni_guide" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDocument(doc.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-rose-400 transition"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details / Upload Tab */}
          <div className="w-2/3 p-6 overflow-y-auto flex flex-col justify-between">
            {selectedDoc ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      {selectedDoc.filename}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Uploaded on {new Date(selectedDoc.uploadedAt).toLocaleDateString()} • {selectedDoc.chunkCount} indexed passages
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onQueryDocument(`Summarize key insights from ${selectedDoc.filename}`);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-medium hover:bg-purple-600/30 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Query via RAG
                  </button>
                </div>

                {/* Chunks Preview */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Indexed Knowledge Chunks (Sample Preview)
                  </h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {selectedDoc.chunks.map((chunk) => (
                      <div key={chunk.id} className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 border-b border-zinc-800/80 pb-1">
                          <span className="text-purple-400 font-semibold">Chunk #{chunk.chunkIndex} of {chunk.totalChunks}</span>
                          <span>{chunk.metadata?.section || "Section General"}</span>
                        </div>
                        <p className="line-clamp-4 font-sans text-zinc-300">{chunk.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Quick Upload Form */}
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <h4 className="text-xs font-semibold text-zinc-200 mb-2 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-blue-400" />
                Add New Document or Knowledge Note
              </h4>
              <form onSubmit={handleUpload} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Document Title (e.g. Distributed_Systems_Notes.md)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <textarea
                  rows={3}
                  placeholder="Paste text notes, markdown content, or specifications here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    {uploadSuccess && <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Added & Chunked!</span>}
                  </span>
                  <button
                    type="submit"
                    disabled={isUploading || !newTitle || !newContent}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xs font-medium transition"
                  >
                    {isUploading ? "Chunking..." : "Index Document"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
