'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/features/components/ui/input';
import { RolesFilter } from '@/features/usuarios/components/RolesFilter';
import { useUsers } from '@/features/usuarios/hooks/queries/use-users';
import { Users } from 'lucide-react';

import { Role, Status } from '@/types/user';

import { AddUserDialog } from '../../../../../features/usuarios/components/AddUserDialog';
import { PaginationFooter } from '../../../../../features/usuarios/components/PaginationFooter';
import { UsersTable } from '../../../../../features/usuarios/components/UsersTable';
import { StatusFilter } from '@/features/usuarios/components/StatusFilter';
import { notFound } from 'next/navigation';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [filterInput, setFilterInput] = useState('');
 
  const [filter, setFilter] = useState('');
  const [rolesFilter, setRolesFilter] = useState<Role[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);

  const safePage = Math.max(1, page);

  const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
    if (!user) {
      notFound()
    }
  }, [user])


  const { data, isLoading } = useUsers({
    condominioId: user?.condominioId,
    page,
    limit,
    filter,
    roles: rolesFilter,
    statuses: statusFilter,
  });


  const users = data?.items ?? [];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter(filterInput);
      setPage(1);
      inputRef.current?.focus();
    }, 400); 

    return () => clearTimeout(timeout);
  }, [filterInput]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

 
  if (!mounted) return null;

  
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
              ref={inputRef}
              placeholder="Filtrar usuários..."
              className="h-9 w-full sm:w-64"
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
            />

            <RolesFilter
              value={rolesFilter}
              onChange={(roles) => setRolesFilter(roles)}
            />

            <StatusFilter value={statusFilter} onChange={(status) => {
            setStatusFilter(status);
            setPage(1);
          }} />

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
              <UsersTable users={users} condominioId={user.condominioId} />

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
