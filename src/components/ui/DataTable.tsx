import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

function DataTable<T extends { id: string | number }>({ data, columns, onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm relative">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={`px-6 py-4 font-semibold ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={`bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col, index) => (
                <td key={index} className="px-6 py-4">
                  {typeof col.accessor === 'function' 
                    ? col.accessor(item) 
                    : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
}

export default DataTable;
