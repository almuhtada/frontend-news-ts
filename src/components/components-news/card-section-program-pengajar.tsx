import React from "react";

type SectionCardProps = {
  title: string;
  icon: React.ElementType;
  gradient?: string;
  children: React.ReactNode;
};

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon: Icon,
  gradient = "bg-gradient-to-r from-blue-500 to-indigo-500",
  children,
}) => {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 border border-gray-100">
      {/* Top border accent */}
      <div className={`absolute top-0 left-0 w-full h-1 ${gradient}`}></div>

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-3 rounded-xl ${gradient} text-white`}>
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
            {title}
          </h2>
        </div>

        {/* Content area */}
        <div>{children}</div>
      </div>

      {/* Decorative corner blob */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
    </div>
  );
};

export default SectionCard;
