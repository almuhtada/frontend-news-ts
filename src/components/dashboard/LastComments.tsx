import { MessageSquare, ExternalLink } from "lucide-react";

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

/* util sederhana untuk ambil URL */
const extractUrl = (text: string) => {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
};

const LastComments: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
        <MessageSquare className="h-5 w-5 text-emerald-600" />
        Komentar Terbaru
      </h3>

      <div className="space-y-4">
        {data.map((c) => {
          const url = extractUrl(c.comment);

          return (
            <div
              key={c.id}
              className="
                rounded-xl border border-gray-100 p-4
                transition hover:bg-gray-50
              "
            >
              {/* AUTHOR */}
              <p className="text-sm font-medium text-gray-900">{c.author}</p>

              {/* COMMENT */}
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="nofollow ugc noopener noreferrer"
                  className="
                    mt-1 inline-flex items-center gap-1
                    text-sm text-emerald-600
                    hover:underline
                  "
                >
                  {url}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <p className="mt-1 text-sm text-gray-700">{c.comment}</p>
              )}

              {/* META */}
              <p className="mt-2 text-xs text-gray-500">
                {c.article} • {c.time}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LastComments;
