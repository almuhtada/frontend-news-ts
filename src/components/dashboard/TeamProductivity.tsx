import { FileText, CheckCircle2 } from "lucide-react";

export type Role = "Penulis" | "Editor";

export interface Member {
  id: number;
  name: string;
  role: Role;
  total: number;
}

interface Props {
  data: Member[];
}

const TeamProductivity: React.FC<Props> = ({ data }) => {
  const writers = data.filter((d) => d.role === "Penulis");
  const editors = data.filter((d) => d.role === "Editor");

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Produktivitas Tim
        </h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Performa penulis dan editor berdasarkan aktivitas
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ================= PENULIS ================= */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">✍️ Penulis</h3>
            <span className="text-xs text-gray-500">Total artikel dibuat</span>
          </div>

          <div className="space-y-3">
            {writers.map((w) => (
              <div
                key={w.id}
                className="
                  flex items-center justify-between
                  rounded-xl border border-yellow-100
                  bg-gradient-to-r from-yellow-50/60 to-white
                  px-4 py-3
                  transition hover:shadow-sm
                "
              >
                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg
                    bg-gradient-to-br from-yellow-200 to-yellow-100
                    text-sm font-semibold text-yellow-800"
                  >
                    {w.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {w.name}
                    </p>
                    <p className="text-xs text-gray-500">Penulis</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 text-sm font-semibold text-yellow-700">
                  <FileText className="h-4 w-4" />
                  {w.total}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= EDITOR ================= */}
        <div className="p-6 border-t lg:border-t-0 lg:border-l border-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">🧠 Editor</h3>
            <span className="text-xs text-gray-500">Artikel disetujui</span>
          </div>

          <div className="space-y-3">
            {editors.map((e) => (
              <div
                key={e.id}
                className="
                  flex items-center justify-between
                  rounded-xl border border-emerald-100
                  bg-gradient-to-r from-emerald-50/60 to-white
                  px-4 py-3
                  transition hover:shadow-sm
                "
              >
                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg
                    bg-gradient-to-br from-emerald-200 to-emerald-100
                    text-sm font-semibold text-emerald-800"
                  >
                    {e.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {e.name}
                    </p>
                    <p className="text-xs text-gray-500">Editor</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {e.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamProductivity;
