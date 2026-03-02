'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RoleGuard } from '@/features/components/auth/RoleGuard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/features/components/ui/alert-dialog';
import { Button } from '@/features/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/components/ui/dropdown-menu';
import {
  Flag,
  FlagOff,
  MoreHorizontal,
  PencilLine,
  ScanEye,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { EmployeeDetail, EmployeeSummary } from '@/types/employee';

import {
  deleteFuncionario,
  getFuncionarioById,
  patchFuncionario,
} from '../services/funcionarioService';
import { EmployeeDialog } from './add-employee-dialog';
import { ViewEmployeeDialog } from './view-employee-dialog';

interface DataTableRowActionsProps {
  readonly employee: EmployeeSummary;
}

export function DataTableRowActions({ employee }: DataTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToggleStatusDialog, setShowToggleStatusDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const isInactive = employee.status === 'inativo';

  async function handleView() {
    try {
      const detail = await getFuncionarioById(condId, employee.id);
      setEmployeeDetail(detail);
      setShowViewDialog(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Erro ao carregar dados do funcionário.');
    }
  }

  async function handleEdit() {
    try {
      const detail = await getFuncionarioById(condId, employee.id);
      setEmployeeDetail(detail);
      setShowEditDialog(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Erro ao carregar dados do funcionário.');
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteFuncionario(condId, employee.id);
      toast.success(`Funcionário "${employee.name}" excluído com sucesso!`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Erro ao excluir funcionário. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  async function handleToggleStatus() {
    const newStatus = isInactive ? 'ativo' : 'inativo';
    try {
      setIsTogglingStatus(true);
      await patchFuncionario(condId, employee.id, { status: newStatus });
      toast.success(
        isInactive
          ? `Funcionário "${employee.name}" ativado com sucesso!`
          : `Funcionário "${employee.name}" desativado com sucesso!`
      );
      router.refresh();
    } catch (error) {
      console.error('Error toggling employee status:', error);
      toast.error('Erro ao alterar status do funcionário. Tente novamente.');
    } finally {
      setIsTogglingStatus(false);
      setShowToggleStatusDialog(false);
    }
  }

  let toggleButtonLabel = 'Desativar';
  if (isTogglingStatus) {
    toggleButtonLabel = isInactive ? 'Ativando...' : 'Desativando...';
  } else if (isInactive) {
    toggleButtonLabel = 'Ativar';
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex items-center justify-between gap-2"
            onSelect={handleView}
          >
            Visualizar
            <ScanEye className="h-4 w-4" />
          </DropdownMenuItem>
          <RoleGuard roles={['Admin']}>
            <DropdownMenuItem
              className="flex items-center justify-between gap-2"
              onSelect={handleEdit}
            >
              Editar
              <PencilLine className="h-4 w-4" />
            </DropdownMenuItem>
          </RoleGuard>
          <DropdownMenuItem
            className="flex items-center justify-between gap-2"
            onSelect={() => setShowToggleStatusDialog(true)}
          >
            {isInactive ? 'Ativar' : 'Desativar'}
            {isInactive ? (
              <Flag className="h-4 w-4" />
            ) : (
              <FlagOff className="h-4 w-4" />
            )}
          </DropdownMenuItem>
          <RoleGuard roles={['Admin']}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive flex items-center justify-between gap-2"
              onSelect={() => setShowDeleteDialog(true)}
            >
              Excluir
              <Trash2 className="h-4 w-4" />
            </DropdownMenuItem>
          </RoleGuard>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de visualização */}
      {employeeDetail && showViewDialog && (
        <ViewEmployeeDialog
          employee={employeeDetail}
          open={showViewDialog}
          onOpenChange={(value) => {
            setShowViewDialog(value);
            if (!value) setEmployeeDetail(null);
          }}
        />
      )}

      {/* Dialog de edição */}
      {employeeDetail && showEditDialog && (
        <EmployeeDialog
          employee={employeeDetail}
          open={showEditDialog}
          onOpenChange={(value) => {
            setShowEditDialog(value);
            if (!value) setEmployeeDetail(null);
          }}
        />
      )}

      {/* Dialog de confirmar exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir funcionário</AlertDialogTitle>
            <AlertDialogDescription>
              {'Tem certeza que deseja excluir o funcionário '}
              <span className="text-foreground font-semibold">
                {employee.name}
              </span>
              {'? Esta ação não pode ser desfeita.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmar ativar/desativar */}
      <AlertDialog
        open={showToggleStatusDialog}
        onOpenChange={setShowToggleStatusDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isInactive ? 'Ativar' : 'Desativar'} funcionário
            </AlertDialogTitle>
            <AlertDialogDescription>
              {'Tem certeza que deseja '}
              {isInactive ? 'deixar ativo' : 'deixar inativo'} o funcionário{' '}
              <span className="text-foreground font-semibold">
                {employee.name}
              </span>
              {'?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingStatus}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
            >
              {toggleButtonLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
