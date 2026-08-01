import React from "react";

interface ProfileHeroProps {
  title: string;
  description?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({
  title,
  description,
  badge,
  badgeIcon,
  children,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="max-w-4xl space-y-3">
        {badge && (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            {badgeIcon}
            <span>{badge}</span>
          </div>
        )}
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
          {title}
        </h1>
        
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            {description}
          </p>
        )}

        {children && (
          <div className="pt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHero;
