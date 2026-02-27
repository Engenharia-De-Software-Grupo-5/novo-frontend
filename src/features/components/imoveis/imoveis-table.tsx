'use client'; 

import { useState, useEffect, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, GripVertical, Eye, Pencil, Trash2, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from "@/features/components/ui/button";
import { Badge } from "@/features/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/features/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/features/components/ui/alert-dialog";
import { Imovel } from "@/types/imoveis";

interface ImoveisTableProps {
  readonly data: Imovel[];
}

type StatusConfig = {
  label: string;
  className: string;
  icon: ComponentType<{ className?: string }>;
};

function SortableRow({
  imovel,
  getStatusConfig,
  handleDelete,
}: {
  readonly imovel: Imovel;
  readonly getStatusConfig: (status: string) => StatusConfig;
  readonly handleDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: imovel.idImovel });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: isDragging ? ("relative" as const) : ("static" as const),
    opacity: isDragging ? 0.9 : 1,
  };

  const statusConfig = getStatusConfig(imovel.situacao);
  const StatusIcon = statusConfig.icon;
  const identificacao = `${imovel.nome} (${imovel.idImovel})`;

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      className={`hover:bg-muted/50 border-border group bg-card ${isDragging ? "shadow-md ring-1 ring-border" : ""}`}
    >
      <TableCell className="py-3 pl-4">
        <div {...attributes} {...listeners} className="cursor-move p-1 -ml-1 rounded hover:bg-muted text-muted-foreground/50 hover:text-foreground transition-colors touch-none">
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>

      <TableCell className="font-medium text-foreground py-3 text-sm">
        {identificacao}
      </TableCell>
      
      <TableCell className="py-3">
        <div className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground max-w-[250px] truncate">
          {imovel.endereco.rua}, {imovel.endereco.numero} - {imovel.endereco.bairro}
        </div>
      </TableCell>
      
      <TableCell className="py-3">
        <Badge variant="outline" className={`font-medium shadow-none gap-1.5 px-2 py-0.5 ${statusConfig.className}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusConfig.label}
        </Badge>
      </TableCell>

      <TableCell className="py-3 text-sm text-muted-foreground">
        {imovel.idCondominio}
      </TableCell>

      <TableCell className="text-right py-3 pr-4" onPointerDown={(e) => e.stopPropagation()}>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/imoveis/${imovel.idImovel}`} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/imoveis/${imovel.idImovel}/editar`} className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" /> Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir {imovel.idImovel}?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação é permanente e não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleDelete(imovel.idImovel)}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Sim, excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}

export function ImoveisTable({ data }: ImoveisTableProps) {
  const router = useRouter();
  
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && over) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.idImovel === active.id);
        const newIndex = currentItems.findIndex((item) => item.idImovel === over.id);
        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo": 
        return { label: "Ativo", icon: CheckCircle2, className: "bg-primary/10 text-primary border-primary/20" };
      case "inativo": 
        return { label: "Inativo", icon: AlertCircle, className: "bg-muted text-muted-foreground border-border" };
      case "manutenção": 
        return { label: "Manutenção", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" };
      case "na planta": 
        return { label: "Na Planta", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" };
      default: 
        return { label: status, icon: AlertCircle, className: "bg-secondary text-secondary-foreground border-border" };
    }
  };

  const handleDelete = async (id: string) => {
    console.log(`Excluindo imóvel ${id}...`);
    router.refresh(); 
  };

  return (
    <div className="rounded-md border border-border bg-card">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="text-foreground font-semibold py-3 text-sm">ID / Nome</TableHead>
              <TableHead className="text-foreground font-semibold py-3 text-sm">Localização</TableHead>
              <TableHead className="text-foreground font-semibold py-3 text-sm">Status</TableHead>
              <TableHead className="text-foreground font-semibold py-3 text-sm">Condomínio</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext items={items.map(item => item.idImovel)} strategy={verticalListSortingStrategy}>
              {items.map((imovel) => (
                <SortableRow 
                  key={imovel.idImovel} 
                  imovel={imovel} 
                  getStatusConfig={getStatusConfig} 
                  handleDelete={handleDelete} 
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
