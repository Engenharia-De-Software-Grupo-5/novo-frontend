'use client'

import { DataTable } from "@/features/components/data-table"
import { columns } from "./columns"
import { USER_ROLES, USER_STATUSES, USER_COLUMN_LABELS } from "../utils/constants"
import { AddUserDialog } from "./AddUserDialog"

interface UsersDataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  pageCount: number
}

export function UsersDataTable({ data, pageCount }: UsersDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Buscar usuários..."
      columnLabels={USER_COLUMN_LABELS}
    
      facetedFilters={[
        {
          columnId: "role",
          title: "Cargo",
          options: USER_ROLES,
        },
        {
          columnId: "status",
          title: "Status",
          options: USER_STATUSES,
        },
      ]}
    
      filterMappings={[
        { urlParam: "q", columnId: "name" },
        { urlParam: "roles", columnId: "role", isArray: true },
        { urlParam: "status", columnId: "status", isArray: true },
      ]}
      actions={<AddUserDialog />}
    />
  )
}
