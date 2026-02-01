'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/features/components/ui/button';
import { Input } from '@/features/components/ui/input';
import { useUsers } from '@/feature/usuarios/hooks/queries/use-users';
import { Plus } from 'lucide-react';
import { Users } from 'lucide-react';


import { PaginationFooter } from './components/PaginationFooter';
import { UsersTable } from './components/UsersTable';
import { AddUserDialog } from './components/AddUserDialog';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('');

  const { data, isLoading } = useUsers({
    condominioId: user?.condominioId,
    page,
    limit,
    filter,
  });

  const users = data?.items ?? [];
  const safePage = Math.max(1, page);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // evita hydration mismatch
  if (!mounted) return null;
  if (!user) return null;
  if (isLoading) return <p>Loading users...</p>;

  return (
    <div className="p-4 md:p-6">
      <ul className="space-y-2">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-brand-dark text-xl font-semibold">
            Gerencie os usuários do sistema
          </h1>

          <p className="text-brand-gray mt-1 text-sm">
            Aprove acessos pendentes, atribua cargos e visualize informações
            essenciais dos usuários do sistema.
          </p>
        </div>

        {/* Filtros + ação */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Filtros */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Filtrar usuários..."
              className="h-9 w-full sm:w-64"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            />

            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Cargo
            </Button>

            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Status
            </Button>
          </div>

          {/* Botão direita */}
          <AddUserDialog />
        </div>

        {/* Conteúdo */}
        <div className="rounded-xl border bg-white">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Users className="text-muted-foreground h-10 w-10" />

              <h2 className="text-foreground text-lg font-semibold">
                Nenhum usuário encontrado
              </h2>

              <p className="text-muted-foreground max-w-sm text-sm">
                {filter
                  ? 'Não encontramos usuários com os filtros aplicados.'
                  : 'Ainda não há usuários cadastrados neste condomínio.'}
              </p>
            </div>
          ) : (
            <>
              <UsersTable users={users} />

              <PaginationFooter
                page={safePage}
                totalPages={data?.totalPages ?? 1}
                pageSize={limit}
                totalItems={data?.totalItems ?? 0}
                onPageChange={(p) => setPage(Math.max(1, p))}
                onPageSizeChange={(size) => {
                  setLimit(size);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>
      </ul>
    </div>
  );
}
