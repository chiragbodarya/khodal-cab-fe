import type { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyFn: (row: T) => string | number;
  emptyMessage?: string;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  keyFn,
  emptyMessage = 'No data found.',
}: TableProps<T>) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/50 font-semibold tracking-wider text-zinc-500 uppercase">
              {columns.map((col, index) => (
                <th key={index} className="p-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-zinc-350 divide-y divide-zinc-800/60">
            {data.map((row, rowIndex) => (
              <tr
                key={String(keyFn(row) || rowIndex)}
                className="hover:bg-zinc-850/40 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4">
                    {col.render ? col.render(row) : (row[col.accessor as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-zinc-550 rounded-2xl border border-dashed border-zinc-800 p-8 text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
