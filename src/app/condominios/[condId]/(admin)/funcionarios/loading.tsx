import { DataTableSkeleton } from '@/features/components/data-table';

export default function FuncionariosLoading() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Gerenciar Funcionários
          </h2>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema, aprove acessos pendentes, atribua
            cargos e acompanhe informações essenciais como status e contratos.
          </p>
        </div>
      </div>
      <DataTableSkeleton
        columnCount={5}
        rowCount={10}
        filterCount={2}
        showSearch
        showActions
      />
    </div>
  );
}
