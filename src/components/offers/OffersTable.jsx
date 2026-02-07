import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import OfferActions from './OfferActions.jsx';
import { formatDate } from '../../utils/formatDate.js';

const templateColors = {
  single_dine: 'blue',
  single_dine_spend: 'green',
  single_spend: 'purple',
  spend_across_dines: 'yellow',
  frequency_time: 'indigo',
  frequency_recurring: 'indigo',
  single_activity: 'red',
  two_action: 'blue',
  three_action: 'blue',
};

const templateLabels = {
  single_dine: 'Single Dine',
  single_dine_spend: 'Dine Spend',
  single_spend: 'Single Spend',
  spend_across_dines: 'Spend Across',
  frequency_time: 'Frequency',
  frequency_recurring: 'Recurring',
  single_activity: 'Activity',
  two_action: '2-Action',
  three_action: '3-Action',
};

export default function OffersTable({ data, onEdit, onClone, onDelete, onViewJson }) {
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.offer_config.title,
        id: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-gray-900">{row.original.offer_config.title}</div>
            <div className="text-xs text-gray-500">{row.original.offer_config.offer_id}</div>
          </div>
        ),
      },
      {
        accessorFn: (row) => row.offer_config.template_type || 'custom',
        id: 'template',
        header: 'Template',
        cell: ({ getValue }) => {
          const val = getValue();
          return <Badge color={templateColors[val] || 'gray'}>{templateLabels[val] || 'Custom'}</Badge>;
        },
      },
      {
        accessorFn: (row) => row.offer_config.actions?.length || 0,
        id: 'actions_count',
        header: 'Actions',
        cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
      },
      {
        accessorKey: 'version',
        header: 'Version',
        cell: ({ getValue }) => <span className="text-gray-600">v{getValue()}</span>,
      },
      {
        accessorKey: 'updated_at',
        header: 'Last Updated',
        cell: ({ getValue }) => <span className="text-gray-600">{formatDate(getValue())}</span>,
      },
      {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <OfferActions
            onEdit={() => onEdit(row.original)}
            onClone={() => onClone(row.original)}
            onDelete={() => onDelete(row.original)}
            onViewJson={() => onViewJson(row.original)}
          />
        ),
        size: 50,
      },
    ],
    [onEdit, onClone, onDelete, onViewJson]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-gray-200 bg-gray-50">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && header.id !== 'actions' && (
                      <ArrowUpDown size={12} className="text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
