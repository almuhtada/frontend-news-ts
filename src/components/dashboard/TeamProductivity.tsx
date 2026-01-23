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
    <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Produktivitas Tim
        </h2>
        <p className="text-sm text-gray-500">
          Performa penulis & editor berdasarkan aktivitas
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ================= PENULIS ================= */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">✍️ Penulis</h3>
            <span className="text-xs text-gray-500">Total artikel dibuat</span>
          </div>

          <div className="space-y-3">
            {writers.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-yellow-50/40 px-4 py-3 hover:bg-yellow-50 transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm font-bold">
                    {w.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {w.name}
                    </p>
                    <p className="text-xs text-gray-500">Penulis</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 text-sm font-semibold text-yellow-700">
                  <FileText className="w-4 h-4" />
                  {w.total}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= EDITOR ================= */}
        <div className="p-6 border-t lg:border-t-0 lg:border-l border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">🧠 Editor</h3>
            <span className="text-xs text-gray-500">Artikel disetujui</span>
          </div>

          <div className="space-y-3">
            {editors.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-emerald-50/40 px-4 py-3 hover:bg-emerald-50 transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                    {e.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {e.name}
                    </p>
                    <p className="text-xs text-gray-500">Editor</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
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
