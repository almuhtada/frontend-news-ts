import NewsSection from "./NewsSection";
import type { Post } from "../../services/posts";

export interface NewsSectionConfig {
  title: string;
  articles: Post[];
  icon?: "clock" | "trending" | "flame" | "zap";
  iconColor?: string;
  iconBgColor?: string;
  badgeType?: "views" | "popular" | "viral" | "new";
  layout?: "horizontal" | "vertical";
  emphasized?: boolean;
}

interface MultiNewsSectionProps {
  sections: NewsSectionConfig[];
  isLoading?: boolean;
}

const MultiNewsSection = ({ sections, isLoading = false }: MultiNewsSectionProps) => {
  if (isLoading) {
    return (
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <section key={i} className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="bg-white rounded-3xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sections.map((section, index) => (
        <NewsSection
          key={index}
          title={section.title}
          articles={section.articles}
          icon={section.icon}
          iconColor={section.iconColor}
          iconBgColor={section.iconBgColor}
          badgeType={section.badgeType}
          layout={section.layout}
          emphasized={section.emphasized}
        />
      ))}
    </div>
  );
};

export default MultiNewsSection;
