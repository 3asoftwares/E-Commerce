import '../../styles/globals.css';

export interface Column<T> {
  /**
   * Column header
   */
  header?: string;
  /**
   * Column label (alias for header)
   */
  label?: string;
  /**
   * Data accessor key
   */
  accessor?: keyof T;
  /**
   * Column key (alias for accessor)
   */
  key?: string;
  /**
   * Custom cell renderer
   */
  cell?: (row: T) => React.ReactNode;
  /**
   * Custom render function (alias for cell)
   */
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  /**
   * Table columns
   */
  columns: Column<T>[];
  /**
   * Table data
   */
  data: T[];
  /**
   * Is table loading?
   */
  loading?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Enable hover effect
   */
  hoverable?: boolean;
  /**
   * Enable striped rows
   */
  striped?: boolean;
  /**
   * Row click handler
   */
  onRowClick?: (row: T) => void;
}

/**
 * Table component for displaying data
 */
export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  hoverable = true,
  striped = false,
  onRowClick,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {column.header || column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`
                ${hoverable ? 'hover:bg-gray-50' : ''}
                ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
                transition-colors duration-150
              `}
            >
              {columns.map((column, colIndex) => {
                const accessor = column.accessor || column.key;
                const renderer = column.cell || column.render;
                return (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderer ? renderer(row) : accessor ? row[accessor as keyof T] : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
