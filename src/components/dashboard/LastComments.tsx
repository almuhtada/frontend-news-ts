import { MessageSquare } from "lucide-react";

export interface Comment {
  id: number;
  author: string;
  comment: string;
  article: string;
  time: string;
}

interface Props {
  data: Comment[];
}

const LastComments: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        Komentar Terbaru
      </h3>

      <div className="space-y-4">
        {data.map((c) => (
          <div key={c.id} className="border-l-4 border-emerald-500 pl-4">
            <p className="text-sm font-medium text-gray-900">{c.author}</p>
            <p className="text-sm text-gray-700">{c.comment}</p>
            <p className="text-xs text-gray-500 mt-1">
              {c.article} • {c.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastComments;
