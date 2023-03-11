import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<any>[] = [
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
        accessorKey: 'date_of_birth'
    },
    {
        header: 'Country',
        accessorKey: 'country'
    },
    {
        header: 'Phone',
        accessorKey: 'phone'
    }
]