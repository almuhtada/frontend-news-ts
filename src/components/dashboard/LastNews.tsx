import { Calendar, FileText } from "lucide-react";

export interface News {
  id: number;
  title: string;
  author: string;
  editor: string;
  time: string;
  status: "Published" | "Draft";
  category: string;
}

interface Props {
  data: News[];
}

const LastNews: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-emerald-600" />
        Berita Terakhir Di-upload
      </h3>

      <div className="space-y-4">
        {data.map((n) => (
          <div key={n.id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">{n.title}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  n.status === "Published"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {n.status}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Penulis: {n.author} • Editor: {n.editor}
            </p>

            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{n.category}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {n.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastNews;
