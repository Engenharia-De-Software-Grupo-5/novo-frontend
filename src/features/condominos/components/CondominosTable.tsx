import { useState } from "react";
import { GripVertical, EllipsisVertical, FlagOff, Trash2, ScanEye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/components/ui/dropdown-menu";
import { Button } from "@/features/components/ui/button";
import { StatusBadge } from "@/features/usuarios/components/StatusBadge";
import { CondominoListItem } from "@/features/condominos/services/condominos";
import { ViewCondominoDialog } from "./ViewCondominoDialog";
import { DeleteCondominoDialog } from "./DeleteCondominoDialog";
import { DeactivateCondominoDialog } from "./DeactivateCondominoDialog";

interface CondominioTableProps {
  condominos: CondominoListItem[];
  condominiumId: string;
}

export function CondominioTable({ condominos, condominiumId }: CondominioTableProps) {
  const [openView, setOpenView] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCondomino, setSelectedCondomino] = useState<CondominoListItem | null>(null);

  const handleView = (condomino: CondominoListItem) => {
    setSelectedCondomino(condomino);
    setOpenView(true);
  };

  const handleDeactivate = (condomino: CondominoListItem) => {
    setSelectedCondomino(condomino);
    setOpenDeactivate(true);
  };

  const handleDelete = (condomino: CondominoListItem) => {
    setSelectedCondomino(condomino);
    setOpenDelete(true);
  };

  return (
    <div className="app-table-container">
      <Table className="app-table">
        <TableHeader className="app-table-header">
          <TableRow>
            <TableHead className="col-drag" />
            <TableHead className="col-name">Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="col-actions" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {condominos.map((c) => (
            <TableRow key={c.id} className="app-table-row">
              <TableCell className="col-drag cell-muted">
                <GripVertical className="icon-sm" />
              </TableCell>

              <TableCell className="cell-name">{c.name}</TableCell>
              <TableCell className="text-muted-foreground">{c.email}</TableCell>
              <TableCell className="text-muted-foreground">{c.cpf}</TableCell>
              <TableCell>
                <StatusBadge status={c.status} />
              </TableCell>

              <TableCell className="col-actions">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical className="icon-sm" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="dropdown-menu">
                    <DropdownMenuItem className="dropdown-item" onSelect={() => handleView(c)}>
                      <span>Visualizar</span>
                      <ScanEye className="icon-sm icon-brand" />
                    </DropdownMenuItem>

                    <DropdownMenuItem className="dropdown-item" onSelect={() => handleDeactivate(c)}>
                      <span>Desativar</span>
                      <FlagOff className="icon-sm icon-brand" />
                    </DropdownMenuItem>

                  
                    <DropdownMenuItem 
                      className="dropdown-item focus:text-red-600 focus:bg-red-50 text-red-600" 
                      onSelect={() => handleDelete(c)}
                    >
                      <span>Excluir</span>
                      <Trash2 className="icon-sm text-red-600" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialogs de Ação */}
      <ViewCondominoDialog
        // open={openView}
        // onOpenChange={setOpenView}
        // morador={selectedCondomino}
        // condominiumId={condominiumId}
      />

      <DeactivateCondominoDialog
        open={openDeactivate}
        onOpenChange={setOpenDeactivate}
        morador={selectedCondomino}
        condominiumId={condominiumId}
      />

      <DeleteCondominoDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        morador={selectedCondomino}
        condominiumId={condominiumId}
      />
    </div>
  );
}