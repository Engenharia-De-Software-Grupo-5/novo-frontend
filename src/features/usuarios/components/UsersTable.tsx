'use client';

import { useState } from 'react';
import { Button } from '@/features/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/components/ui/table';
import {
  EllipsisVertical,
  FlagOff,
  GripVertical,
  PencilLine,
  ScanEye,
  Trash2,
} from 'lucide-react';

import { User } from '@/types/user';

import { DeactivateUserDialog } from './DeactivateUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { StatusBadge } from './StatusBadge';
import { ViewUserDialog } from './ViewUserDialog';

export interface UsersTableProps {
  users: User[];
  condominioId: string;
}

export function UsersTable({ users, condominioId }: UsersTableProps) {
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  function handleViewUser(user: User) {
    setSelectedUser(user);
    setOpenView(true);
  }

  function handleEditUser(user: User) {
    setSelectedUser(user);
    setOpenEdit(true);
  }

  function handleDeactivateUser(user: User) {
    setSelectedUser(user);
    setOpenDeactivate(true);
  }

  function handleDeleteUser(user: User) {
    setSelectedUser(user);
    setOpenDelete(true);
  }

  return (
    <div className="app-table-container">
      <Table className="app-table">
        <TableHeader className="app-table-header">
          <TableRow>
            <TableHead className="col-drag" />
            <TableHead className="col-name">Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último acesso</TableHead>
            <TableHead className="col-actions" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="app-table-row">
              <TableCell className="col-drag cell-muted">
                <GripVertical className="icon-sm" />
              </TableCell>

              {/* Nome */}
              <TableCell className="cell-name">{user.name}</TableCell>

              {/* Cargo */}
              <TableCell>
                <span className="badge-role">{user.role}</span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>

              {/* Último acesso */}
              <TableCell className="cell-last-access">Hoje</TableCell>

              {/* Menu */}
              <TableCell className="col-actions">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical className="icon-sm" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="dropdown-menu">
                    <DropdownMenuItem
                      className="dropdown-item"
                      onSelect={() => handleViewUser(user)}
                    >
                      <span>Visualizar</span>
                      <ScanEye className="icon-sm icon-brand" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="dropdown-item"
                      onSelect={() => handleEditUser(user)}
                    >
                      <span>Editar</span>
                      <PencilLine className="icon-sm icon-brand" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="dropdown-item"
                      onSelect={() => handleDeactivateUser(user)}
                    >
                      <span>Desativar</span>
                      <FlagOff className="icon-sm icon-brand" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="dropdown-item dropdown-danger"
                      onSelect={() => handleDeleteUser(user)}
                    >
                      <span>Excluir</span>
                      <Trash2 className="icon-sm" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* dialogs continuam iguais */}
      <ViewUserDialog
        open={openView}
        onOpenChange={setOpenView}
        user={selectedUser}
      />
      <EditUserDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        user={selectedUser}
        condominioId={condominioId}
      />

      <DeactivateUserDialog
        open={openDeactivate}
        onOpenChange={setOpenDeactivate}
        user={selectedUser}
        condominioId={condominioId}
      />

      <DeleteUserDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        user={selectedUser}
        condominioId={condominioId}
      />
    </div>
  );
}
