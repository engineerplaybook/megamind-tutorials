import React from 'react';
import { Database } from 'lucide-react';

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
    <div className="overflow-hidden rounded-2xl border border-borderColor/60 shadow-premium bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm text-left border-collapse">
          {/* Table Head */}
          <thead className="text-[10px] md:text-xs font-bold text-textColor-secondary/70 uppercase bg-slate-50 border-b border-borderColor/50">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-5 py-4 font-extrabold tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="divide-y divide-borderColor/40">
            {data.map((item) => (
              <tr 
                key={item.id} 
                className={`group bg-white hover:bg-slate-50/70 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col, index) => (
                  <td key={index} className="px-5 py-3.5 text-textColor-secondary font-medium">
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item) 
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12 text-textColor-secondary/40 flex flex-col items-center justify-center gap-2">
          <Database size={24} className="text-textColor-secondary/30 animate-pulse" />
          <p className="italic text-xs font-medium">No records available in database</p>
        </div>
      )}
    </div>
  );
}

export default DataTable;
