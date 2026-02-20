'use client';

import { DataTable } from '@/features/components/data-table/data-table';
import { EMPLOYEE_ROLES } from '@/features/funcionarios/constants';

import { PaymentSummary } from '@/types/payment';

import { PAYMENT_COLUMN_LABELS, PAYMENT_STATUSES } from '../constants';
import { AddPaymentDialog } from './add-payment-dialog';
import { columns } from './columns';

interface PagamentosDataTableProps {
  data: PaymentSummary[];
  pageCount: number;
}

export function PagamentosDataTable({
  data,
  pageCount,
}: PagamentosDataTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Filtrar pagamentos..."
      facetedFilters={[
        {
          columnId: 'role',
          title: 'Cargo',
          options: EMPLOYEE_ROLES.map((r) => ({
            label: r.label,
            value: r.value,
          })),
        },
        {
          columnId: 'status',
          title: 'Status',
          options: PAYMENT_STATUSES.map((r) => ({
            label: r.label,
            value: r.value,
          })),
        },
      ]}
      columnLabels={PAYMENT_COLUMN_LABELS}
      filterMappings={[
        { columnId: 'name' },
        { columnId: 'role', isArray: true },
        { columnId: 'status', isArray: true },
      ]}
      actions={<AddPaymentDialog />}
    />
  );
}
