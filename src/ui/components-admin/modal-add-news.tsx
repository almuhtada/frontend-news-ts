import React, { useRef, useEffect, useState } from "react";
import { generateSmartExcerpt } from "../../utils/excerptGenerator";
import {
  X,
  Upload,
  Image,
  FileText,
  Tag,
  User,
  Eye,
  Save,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Strikethrough,
  Search,
  Plus,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface FormData {
  title: string;
  category_id: string;
  content: string; // HTML
  excerpt: string;
  status: "draft" | "publish" | "archived";
  tag_ids?: number[];
}

interface Props {
  isOpen: boolean;
  isEditing: boolean;
  form: FormData;
  previewUrl: string;
  categories: { id: number; name: string }[];
  tags: { id: number; name: string }[];
  saving?: boolean;
  onClose: () => void;
  onChange: (form: FormData) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage?: () => void;
  onSave: () => void;
  onCreateTag?: (name: string) => Promise<{ id: number; name: string } | null>;
}

const NewsModal: React.FC<Props> = ({
  isOpen,
  isEditing,
  form,
  previewUrl,
  categories,
  tags,
  saving = false,
  onClose,
  onChange,
  onFileChange,
  onRemoveImage,
  onSave,
  onCreateTag,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUserTyping = useRef(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Tag dropdown state
  const [tagSearch, setTagSearch] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);

  // Set initial content saat modal dibuka
  useEffect(() => {
    if (isOpen && editorRef.current && !isUserTyping.current) {
      editorRef.current.innerHTML = form.content;
    }
  }, [isOpen, form.content]);

  // Click outside to close tag dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter tags based on search
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // Check if search query exactly matches an existing tag
  const exactMatch = tags.some(
    (tag) => tag.name.toLowerCase() === tagSearch.toLowerCase()
  );

  // Get selected tags
  const selectedTags = tags.filter((tag) => form.tag_ids?.includes(tag.id));

  // Handle tag selection
  const handleSelectTag = (tagId: number) => {
    const currentTags = form.tag_ids || [];
    if (!currentTags.includes(tagId)) {
      onChange({ ...form, tag_ids: [...currentTags, tagId] });
    }
    setTagSearch("");
    setIsTagDropdownOpen(false);
  };

  // Handle tag removal
  const handleRemoveTag = (tagId: number) => {
    const currentTags = form.tag_ids || [];
    onChange({ ...form, tag_ids: currentTags.filter((id) => id !== tagId) });
  };

  // Handle create new tag
  const handleCreateTag = async () => {
    if (!onCreateTag || !tagSearch.trim() || creatingTag) return;

    setCreatingTag(true);
    try {
      const newTag = await onCreateTag(tagSearch.trim());
      if (newTag) {
        const currentTags = form.tag_ids || [];
        onChange({ ...form, tag_ids: [...currentTags, newTag.id] });
        setTagSearch("");
        setIsTagDropdownOpen(false);
      }
    } finally {
      setCreatingTag(false);
    }
  };

  if (!isOpen) return null;

  const execCmd = (command: string, value?: string) => {
    // Fokus ke editor tanpa pindah cursor
    if (
      editorRef.current &&
      !editorRef.current.contains(document.activeElement)
    ) {
      editorRef.current.focus();
    }

    // Jalankan command
    document.execCommand(command, false, value);

    // Update content setelah command tanpa re-render yang mengubah cursor
    setTimeout(() => {
      if (editorRef.current) {
        onChange({ ...form, content: editorRef.current.innerHTML });
      }
    }, 0);
  };

  // Auto-generate ringkasan dari isi berita menggunakan smart algorithm
  const generateExcerpt = () => {
    if (!form.content.trim()) return;

    // Gunakan smart excerpt generator yang bisa memilih kalimat penting
    const excerpt = generateSmartExcerpt(form.content, {
      maxLength: 250,
      minSentences: 2,
      maxSentences: 4,
    });

    onChange({ ...form, excerpt });
  };

  const isFormValid =
    form.title.trim() && form.category_id.trim() && form.content.trim();

  const plainTextLength = form.content.replace(/<[^>]*>/g, "").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {isEditing ? (
              <FileText className="w-5 h-5" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {isEditing ? "Edit Berita" : "Tambah Berita Baru"}
          </h2>
          <p className="text-xs text-white/90">
            {isEditing ? "Perbarui informasi berita" : "Buat artikel berita"}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Judul */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Judul Berita *
            </label>
            <input
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              placeholder="Judul berita..."
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            {form.title && (
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {form.title.length} karakter
              </div>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              Kategori *
            </label>
            <select
              value={form.category_id}
              onChange={(e) =>
                onChange({ ...form, category_id: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags - Dropdown with Search */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              Tags
            </label>

            {/* Selected Tags as Chips */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                  >
                    #{tag.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag.id)}
                      className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Dropdown Container */}
            <div ref={tagDropdownRef} className="relative">
              {/* Search Input */}
              <div
                className={`flex items-center border-2 rounded-lg px-3 py-2 transition-colors ${
                  isTagDropdownOpen
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : "border-gray-200"
                }`}
              >
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => {
                    setTagSearch(e.target.value);
                    setIsTagDropdownOpen(true);
                  }}
                  onFocus={() => setIsTagDropdownOpen(true)}
                  placeholder="Cari atau buat tag baru..."
                  className="flex-1 outline-none text-sm"
                />
                {creatingTag ? (
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isTagDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Dropdown Menu */}
              {isTagDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {/* Create new tag option */}
                  {tagSearch.trim() && !exactMatch && onCreateTag && (
                    <button
                      type="button"
                      onClick={handleCreateTag}
                      disabled={creatingTag}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-emerald-50 flex items-center gap-2 text-emerald-600 border-b border-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                      Buat tag baru: <span className="font-medium">"{tagSearch}"</span>
                    </button>
                  )}

                  {/* Filtered tags list */}
                  {filteredTags.length > 0 ? (
                    filteredTags
                      .filter((tag) => !form.tag_ids?.includes(tag.id))
                      .map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleSelectTag(tag.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Tag className="w-3 h-3 text-gray-400" />
                          {tag.name}
                        </button>
                      ))
                  ) : (
                    !tagSearch.trim() && (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        Tidak ada tags tersedia
                      </div>
                    )
                  )}

                  {/* No results message */}
                  {tagSearch.trim() && filteredTags.length === 0 && !onCreateTag && (
                    <div className="px-3 py-2 text-sm text-gray-400">
                      Tag tidak ditemukan
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected count */}
            {form.tag_ids && form.tag_ids.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {form.tag_ids.length} tag dipilih
              </div>
            )}
          </div>

          {/* Isi Berita - Rich Text */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Isi Berita *
            </label>

            {/* Toolbar - Multiple Rows */}
            <div className="border border-gray-200 rounded-t-lg bg-gray-50">
              {/* Row 1: Text Formatting */}
              <div className="flex flex-wrap gap-1 px-2 py-1.5 border-b border-gray-200">
                <button
                  onClick={() => execCmd("bold")}
                  className="editor-btn"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("italic")}
                  className="editor-btn"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("underline")}
                  className="editor-btn"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("strikeThrough")}
                  className="editor-btn"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                  onClick={() => execCmd("formatBlock", "<h1>")}
                  className="editor-btn"
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("formatBlock", "<h2>")}
                  className="editor-btn"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("formatBlock", "<h3>")}
                  className="editor-btn"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("formatBlock", "<p>")}
                  className="editor-btn text-xs font-semibold"
                  title="Normal Text"
                >
                  P
                </button>
              </div>

              {/* Row 2: Lists & Alignment */}
              <div className="flex flex-wrap gap-1 px-2 py-1.5">
                <button
                  onClick={() => execCmd("insertUnorderedList")}
                  className="editor-btn"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("insertOrderedList")}
                  className="editor-btn"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                  onClick={() => execCmd("justifyLeft")}
                  className="editor-btn"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("justifyCenter")}
                  className="editor-btn"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("justifyRight")}
                  className="editor-btn"
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                  onClick={() => execCmd("formatBlock", "<blockquote>")}
                  className="editor-btn"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  onClick={() => execCmd("formatBlock", "<pre>")}
                  className="editor-btn"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const url = prompt("Masukkan URL:");
                    if (url) execCmd("createLink", url);
                  }}
                  className="editor-btn"
                  title="Insert Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[200px] max-h-[300px] overflow-y-auto border-2 border-t-0 border-gray-200 rounded-b-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500 prose prose-sm max-w-none"
              onInput={(e) => {
                isUserTyping.current = true;
                const content = (e.target as HTMLDivElement).innerHTML;
                onChange({ ...form, content });
              }}
              onBlur={(e) => {
                isUserTyping.current = false;
                const content = (e.target as HTMLDivElement).innerHTML;
                onChange({ ...form, content });
              }}
            />

            {form.content && (
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{plainTextLength} karakter</span>
                <span>{Math.ceil(plainTextLength / 100)} menit baca</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Ringkasan (Excerpt)
              </label>
              <button
                type="button"
                onClick={generateExcerpt}
                disabled={!form.content.trim()}
                className="text-xs px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Auto Generate
              </button>
            </div>
            <textarea
              value={form.excerpt}
              onChange={(e) => onChange({ ...form, excerpt: e.target.value })}
              placeholder="Ringkasan singkat berita..."
              rows={2}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                onChange({
                  ...form,
                  status: e.target.value as "draft" | "publish" | "archived",
                })
              }
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Image className="w-4 h-4 text-emerald-600" />
              Gambar Berita
            </label>

            {!previewUrl ? (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-emerald-50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Klik upload gambar
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                {/* Overlay buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <label className="px-4 py-2 bg-white text-emerald-600 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Ganti</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="hidden"
                    />
                  </label>
                  {onRemoveImage && (
                    <button
                      type="button"
                      onClick={onRemoveImage}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isFormValid && (
            <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-700">
                Judul, kategori, dan isi berita wajib diisi
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t px-4 py-3 flex justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <User className="w-3 h-3" />
            Draft otomatis
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm"
            >
              Batal
            </button>
            <button
              onClick={onSave}
              disabled={!isFormValid || saving}
              className={`px-4 py-2 rounded-lg text-sm text-white flex items-center gap-1
                ${
                  isFormValid && !saving
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              <Save className="w-3 h-3" />
              {saving
                ? "Menyimpan..."
                : isEditing
                  ? "Perbarui"
                  : "Publikasikan"}
            </button>
          </div>
        </div>

        {/* Editor Styles */}
        <style>{`
          .editor-btn {
            padding: 6px;
            border-radius: 6px;
            color: #4b5563;
            transition: all 0.15s;
          }
          .editor-btn:hover {
            background: #e5e7eb;
            color: #059669;
          }
          .editor-btn:active {
            background: #d1d5db;
            transform: scale(0.95);
          }

          /* Editor Content Styling */
          [contenteditable] {
            outline: none;
          }
          [contenteditable] h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.5em 0;
            color: #1f2937;
          }
          [contenteditable] h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.5em 0;
            color: #374151;
          }
          [contenteditable] h3 {
            font-size: 1.25em;
            font-weight: bold;
            margin: 0.5em 0;
            color: #4b5563;
          }
          [contenteditable] p {
            margin: 0.5em 0;
            line-height: 1.6;
          }
          [contenteditable] ul {
            margin: 0.5em 0;
            padding-left: 2em;
            list-style-type: disc;
          }
          [contenteditable] ol {
            margin: 0.5em 0;
            padding-left: 2em;
            list-style-type: decimal;
          }
          [contenteditable] li {
            margin: 0.25em 0;
            display: list-item;
          }
          [contenteditable] blockquote {
            border-left: 4px solid #059669;
            padding-left: 1em;
            margin: 1em 0;
            color: #6b7280;
            font-style: italic;
          }
          [contenteditable] pre {
            background: #f3f4f6;
            padding: 1em;
            border-radius: 0.5em;
            overflow-x: auto;
            font-family: monospace;
            margin: 1em 0;
          }
          [contenteditable] a {
            color: #059669;
            text-decoration: underline;
          }
          [contenteditable]:empty:before {
            content: 'Tulis isi berita di sini...';
            color: #9ca3af;
          }
        `}</style>
      </div>
    </div>
  );
};

export default NewsModal;
