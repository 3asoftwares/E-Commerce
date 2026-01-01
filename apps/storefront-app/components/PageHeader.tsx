import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface PageHeaderProps {
  icon: IconDefinition;
  title: string;
  subtitle?: string;
  badge?: {
    count: number;
    label: string;
  };
  iconGradient?: string;
  titleGradient?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  subtitle,
  badge,
  iconGradient = 'from-indigo-500 to-purple-500',
  titleGradient = 'from-indigo-600 to-purple-600',
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-2">
          <div className={`p-4 bg-gradient-to-br ${iconGradient} rounded-2xl shadow-lg`}>
            <FontAwesomeIcon icon={icon} className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}>
            {title}
          </h1>
        </div>
        {(subtitle || badge) && (
          <div className="text-gray-700 mt-3 text-lg font-medium flex items-center gap-2">
            {badge && (
              <span className={`w-8 h-8 bg-gradient-to-br ${iconGradient} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {badge.count}
              </span>
            )}
            {subtitle || (badge && `${badge.count} ${badge.label}`)}
          </div>
        )}
      </div>
    </div>
  );
};
