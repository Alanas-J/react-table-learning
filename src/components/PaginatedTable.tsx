import React from 'react'
import ReactDOM from 'react-dom/client'
import MOCK_DATA from './MOCK_DATA.json'

import {PaginationState, FiltersTableState, useReactTable, getCoreRowModel, ColumnDef, flexRender, ColumnFiltersState } from '@tanstack/react-table'

export default function PaginatedTable() {
    const rerender = React.useReducer(() => ({}), {})[1]

    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: 'Id',
                accessorKey: 'id'
            },
            {
                header: 'Firstname',
                accessorKey: 'first_name'
            },
            {
                header: 'Last name',
                accessorKey: 'last_name'
            },
            {
                header: 'Date of birth',
                accessorFn: (row) => new Date(row.date_of_birth).getFullYear()
            },
            {
                header: 'Country',
                accessorKey: 'country'
            },
            {
                header: 'Phone',
                accessorKey: 'phone'
            }
        ],
        [])

    const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
        pageIndex: 0, // page to fetch
        pageSize: 10, //amt of records to fetch
    }) 

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const filteredData = MOCK_DATA.filter((row) => {
        let valid = true;

        for(const {id, value} of columnFilters) {
            const element = row[id as keyof typeof row]

            if (typeof element === 'string') valid = element.includes(value as string);
            if (typeof element === 'number') valid = element.toString().includes(value as string);
        }

        return valid;
    })


    const page = filteredData.slice(pageIndex*pageSize, pageIndex*pageSize+pageSize)
    const data = React.useMemo(() => page, [pageIndex, pageSize, columnFilters])

    
    const pagination = React.useMemo(
    () => ({
        pageIndex,
        pageSize,
    }),
    [pageIndex, pageSize])

    const table = useReactTable({
    data: data ?? [], // if query hadn't returned render empty
    columns,
    pageCount: Math.ceil(filteredData.length/pagination.pageSize),
    state: {
        pagination,
        columnFilters
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // manualFiltering: true,
    debugTable: true,
    })

    return (
    <div className="p-2">
        <div className="h-2" />
        <table>
        <thead>
            {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                return (
                    <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                        <div>
                        {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                        </div>
                    )}
                    </th>
                )
                })}
            </tr>
            ))}

            {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                return (
                    <th key={header.id} colSpan={header.colSpan}>
                        <input value={header.column.getFilterValue() as string || ''} onChange={e => header.column.setFilterValue(e.target.value)} type="text" placeholder={header.column.columnDef.header as string} />
                    </th>
                )
                })}
            </tr>
            ))}
        </thead>
        <tbody>
            {table.getRowModel().rows.map(row => {
            return (
                <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                    return (
                    <td key={cell.id}>
                        {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                        )}
                    </td>
                    )
                })}
                </tr>
            )
            })}
        </tbody>
        </table>
        <div className="h-2" />
        <div className="flex items-center gap-2">
        <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
        >
            {'<<'}
        </button>
        <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
        >
            {'<'}
        </button>
        <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
        >
            {'>'}
        </button>
        <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
        >
            {'>>'}
        </button>
        <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
            </strong>
        </span>
        <span className="flex items-center gap-1">
            | Go to page:
            <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
            />
        </span>
        <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
            table.setPageSize(Number(e.target.value))
            }}
        >
            {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
                Show {pageSize}
            </option>
            ))}
        </select>



        {/*dataQuery.isFetching ? 'Loading...' : null */}
        </div>
        <div>{table.getRowModel().rows.length} Rows</div>
        <div>
        <button onClick={() => rerender()}>Force Rerender</button>
        </div>
        <pre>{JSON.stringify(table.getState(), null, 4)}</pre>
    </div>
    )
}
