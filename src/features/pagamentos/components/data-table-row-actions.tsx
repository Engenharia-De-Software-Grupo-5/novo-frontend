'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { MoreHorizontal, PencilLine, ScanEye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { PaymentDetail, PaymentSummary } from '@/types/payment';

// I need:
import { deletePayment, getPaymentById } from '../services/paymentService';
import { PaymentDialog } from './add-payment-dialog';
import { ViewPaymentDialog } from './view-payment-dialog';

interface DataTableRowActionsProps {
  payment: PaymentSummary;
}

export function DataTableRowActions({ payment }: DataTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(
    null
  );

  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deletePayment(condId, payment.id);
      toast.success('Pagamento excluído com sucesso!');
      router.refresh();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Erro ao excluir pagamento. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  async function handleEdit() {
    try {
      toast.loading('Carregando detalhes...');
      const detail = await getPaymentById(condId, payment.id);
      setPaymentDetail(detail);
      toast.dismiss();
      setShowEditDialog(true);
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao carregar detalhes do pagamento.');
      console.error(error);
    }
  }

  async function handleView() {
    try {
      toast.loading('Carregando detalhes...');
      const detail = await getPaymentById(condId, payment.id);
      setPaymentDetail(detail);
      toast.dismiss();
      setShowViewDialog(true);
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao carregar detalhes do pagamento.');
      console.error(error);
    }
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
          <DropdownMenuItem
            className="flex items-center justify-between gap-2"
            onSelect={handleEdit}
          >
            Editar
            <PencilLine className="h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive flex items-center justify-between gap-2"
            onSelect={() => setShowDeleteDialog(true)}
          >
            Excluir
            <Trash2 className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o pagamento de{' '}
              <span className="text-foreground font-semibold">
                {payment.name}
              </span>
              ? Esta ação não pode ser desfeita.
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

      {/* Edit Dialog */}
      {showEditDialog && paymentDetail && (
        <PaymentDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          payment={paymentDetail}
        />
      )}

      {/* View Dialog */}
      {showViewDialog && paymentDetail && (
        <ViewPaymentDialog
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
          payment={paymentDetail}
        />
      )}
    </>
  );
}
