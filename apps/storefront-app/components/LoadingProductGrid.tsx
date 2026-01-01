interface LoadingProductGridProps {
  count?: number;
  variant?: 'default' | 'compact';
}

export const LoadingProductGrid: React.FC<LoadingProductGridProps> = ({
  count = 8,
  variant = 'default',
}) => {
  const gridClasses = variant === 'compact' 
    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

  const heightClasses = variant === 'compact' ? 'h-32' : 'h-48';

  return (
    <div className={`grid ${gridClasses}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden bg-white shadow-md animate-pulse"
        >
          <div className={`${heightClasses} bg-gray-200`}></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
