'use client';

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/features/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/components/ui/alert-dialog";

import { DespesaSummary } from "@/types/despesa";
import { despesaService } from "../services/despesaService";
import { ViewDespesaDialog } from "./view-despesa-dialog";
import { EditDespesaDialog } from "./edit-despesa-dialog";

interface DataTableRowActionsProps {
  row: Row<DespesaSummary>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const despesa = row.original;
  const params = useParams();
  const router = useRouter();
  const condId = params.condId as string;

  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); 

  const confirmDelete = async () => {
    try {
      await despesaService.delete(condId, despesa.id);
      toast.success("Despesa excluída com sucesso!");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao excluir a despesa.");
    } finally {
      setShowDeleteAlert(false); 
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          
          <DropdownMenuItem onClick={() => setShowViewDialog(true)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            onClick={() => setShowDeleteAlert(true)} 
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewDespesaDialog 
        condId={condId}
        despesaId={despesa.id}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      <EditDespesaDialog 
        condId={condId}
        despesaId={despesa.id}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a despesa
              <span className="font-semibold text-foreground"> {despesa.nome} </span>
              dos registros do condomínio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}