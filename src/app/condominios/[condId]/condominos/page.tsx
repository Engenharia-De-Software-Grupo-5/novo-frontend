'use client';

import { useEffect, useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/features/components/ui/input';
import { CondominioTable } from '@/features/condominos/components/CondominosTable';
import { CpfFilter } from '@/features/condominos/components/CpfFilter';
import { useCondominos } from '@/features/condominos/hooks/queries/use-condominos';
import { PaginationFooter } from '@/features/usuarios/components/PaginationFooter';
import { StatusFilter } from '@/features/usuarios/components/StatusFilter';
import { Users } from 'lucide-react';

import { CondominiumStatus } from '@/types/condomino';
import { AddCondominoDialog } from '@/features/condominos/components/AddCondominoDialog';

export default function CondominiumsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filterInput, setFilterInput] = useState(''); // filtro por nome
  const [cpfInput, setCpfInput] = useState('');
  const [cpfFilter, setCpfFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<CondominiumStatus[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  const { user } = useAuth();

  // Garantir que só renderiza se usuário logado
  useEffect(() => {
    if (!user) notFound();
  }, [user]);

  // Debounce para filtro de CPF
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCpfFilter(cpfInput);
      setPage(1);
      inputRef.current?.focus();
    }, 400);

    return () => clearTimeout(timeout);
  }, [cpfInput]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { data, isLoading } = useCondominos({
    condominiumId: user?.condominioId ?? '',
    page,
    limit,
    cpfFilter,
    statusFilter,
  });

  const condominos = data?.data ?? [];

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-brand-dark text-xl font-semibold">
          Gerenciar Condôminos
        </h1>
        <p className="text-brand-gray mt-1 text-sm">
          Gerencie os condôminos do sistema, veja informações importantes e
          aprove ou rejeite pré-cadastros.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Filtros */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            ref={inputRef}
            placeholder="Filtrar por nome..."
            className="h-9 w-full sm:w-64"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />

          <CpfFilter
            value={cpfFilter}
            onChange={(value) => {
              setCpfFilter(value);
              setPage(1);
            }}
          />

          <StatusFilter
            value={statusFilter}
            onChange={(selected) => {
              setStatusFilter(selected);
              setPage(1);
            }}
          />
        </div>

        <AddCondominoDialog condominiumId={user?.condominioId} />
      </div>

      {/* Conteúdo */}
      <div className="rounded-xl border bg-white">
        {isLoading ? (
          <div className="text-muted-foreground py-16 text-center text-sm">
            Carregando condôminos...
          </div>
        ) : condominos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Users className="text-muted-foreground h-10 w-10" />
            <h2 className="text-foreground text-lg font-semibold">
              Nenhum condômino encontrado
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm">
              {cpfFilter || statusFilter.length > 0
                ? 'Não encontramos condôminos com os filtros aplicados.'
                : 'Ainda não há condôminos cadastrados neste condomínio.'}
            </p>
          </div>
        ) : (
          <>
            <CondominioTable
              condominos={condominos}
              condominiumId={user!.condominioId}
            />

            <PaginationFooter
              page={page}
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
    </div>
  );
}
