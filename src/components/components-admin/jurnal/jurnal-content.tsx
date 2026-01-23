import {
  BookOpen,
  Trash2,
  Pencil,
  Users,
  ExternalLink,
  Library,
} from "lucide-react";
import type { Publication } from "./types";

/* ================= EMPTY STATE ================= */
const EmptyState: React.FC<{
  isEmpty: boolean;
  onAddFirst: () => void;
}> = ({ isEmpty, onAddFirst }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
      <BookOpen className="h-8 w-8 text-gray-400" />
    </div>

    <h3 className="mb-2 text-lg font-semibold text-gray-800">
      {isEmpty ? "Belum Ada Publikasi" : "Tidak Ada Hasil"}
    </h3>

    <p className="mb-6 text-sm text-gray-600">
      {isEmpty
        ? "Tambahkan publikasi jurnal untuk mulai mendokumentasikan karya ilmiah."
        : "Coba ubah filter atau kata kunci pencarian."}
    </p>

    {isEmpty && (
      <button
        onClick={onAddFirst}
        className="
          inline-flex items-center gap-2
          rounded-xl bg-emerald-600 px-5 py-2.5
          text-sm font-semibold text-white
          transition hover:bg-emerald-700
        "
      >
        Tambah Publikasi
      </button>
    )}
  </div>
);

/* ================= GRID CARD ================= */
const PublicationCard: React.FC<{
  publication: Publication;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ publication, onEdit, onDelete }) => (
  <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
    {/* Header */}
    <div className="mb-4 flex items-start justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
        <BookOpen className="h-5 w-5 text-emerald-600" />
      </div>

      <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-emerald-600"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>

    {/* Content */}
    <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-gray-900">
      {publication.title}
    </h3>

    <div className="mb-4 space-y-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-gray-400" />
        <span className="truncate">{publication.authors}</span>
      </div>
      <div className="flex items-center gap-2">
        <Library className="h-4 w-4 text-gray-400" />
        <span className="truncate">{publication.journal}</span>
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between">
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {publication.year}
      </span>

      <a
        href={publication.link}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex items-center gap-1
          text-xs font-medium text-emerald-600
          hover:underline
        "
      >
        <ExternalLink className="h-4 w-4" />
        Lihat
      </a>
    </div>
  </div>
);

/* ================= LIST ROW ================= */
const PublicationRow: React.FC<{
  publication: Publication;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ publication, onEdit, onDelete }) => (
  <div className="group grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50">
    <div className="col-span-4 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
        <BookOpen className="h-4 w-4 text-emerald-600" />
      </div>
      <span className="truncate text-sm font-medium text-gray-900">
        {publication.title}
      </span>
    </div>

    <div className="col-span-3 truncate text-sm text-gray-600">
      {publication.authors}
    </div>

    <div className="col-span-3 truncate text-sm text-gray-600">
      {publication.journal}
    </div>

    <div className="col-span-1">
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
        {publication.year}
      </span>
    </div>

    <div className="col-span-1 flex gap-1 justify-end opacity-0 transition group-hover:opacity-100">
      <button
        onClick={onEdit}
        className="rounded-md p-1 text-gray-500 hover:text-emerald-600"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="rounded-md p-1 text-gray-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <a
        href={publication.link}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-1 text-gray-400 hover:text-gray-600"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  </div>
);

/* ================= MAIN ================= */
interface JurnalContentProps {
  publications: Publication[];
  totalCount: number;
  viewMode: "grid" | "list";
  onEdit: (publication: Publication) => void;
  onDelete: (id: number) => void;
  onAddFirst: () => void;
}

const JurnalContent: React.FC<JurnalContentProps> = ({
  publications,
  totalCount,
  viewMode,
  onEdit,
  onDelete,
  onAddFirst,
}) => {
  if (!publications.length) {
    return <EmptyState isEmpty={totalCount === 0} onAddFirst={onAddFirst} />;
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {publications.map((publication) => (
          <PublicationCard
            key={publication.id}
            publication={publication}
            onEdit={() => onEdit(publication)}
            onDelete={() => onDelete(publication.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase text-gray-500">
        <div className="col-span-4">Publikasi</div>
        <div className="col-span-3">Penulis</div>
        <div className="col-span-3">Jurnal</div>
        <div className="col-span-1">Tahun</div>
        <div className="col-span-1 text-right">Aksi</div>
      </div>

      <div className="divide-y divide-gray-100">
        {publications.map((publication) => (
          <PublicationRow
            key={publication.id}
            publication={publication}
            onEdit={() => onEdit(publication)}
            onDelete={() => onDelete(publication.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default JurnalContent;
