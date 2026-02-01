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

export function UsersTable({ users }: { users: User[] }) {
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
    <div className="relative w-full overflow-x-auto rounded-xl border bg-white">
      <Table>
        <TableHeader className="bg-brand-background">
          <TableRow>
            <TableHead className="w-8" />
            <TableHead className="text-brand-dark w-[40%] pl-6">Nome</TableHead>
            <TableHead className="text-brand-dark">Cargo</TableHead>
            <TableHead className="text-brand-dark">Status</TableHead>
            <TableHead className="text-brand-dark">Último acesso</TableHead>
            <TableHead className="w-10 text-right" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell className="text-muted-foreground w-8">
                <GripVertical className="h-4 w-4" />
              </TableCell>

              {/* Nome */}
              <TableCell className="pl-6 font-medium">{user.name}</TableCell>

              {/* Cargo */}
              <TableCell>
                <span className="text-muted-foreground rounded-md border px-2 py-0.5 text-xs">
                  {user.role}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>

              {/* Último acesso */}
              <TableCell className="text-brand-dark text-sm">
                {/* //{user.lastAccess} */}
                {'Hoje'}
              </TableCell>

              {/* Menu */}
              <TableCell className="w-10 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onSelect={() => {
                        handleViewUser(user);
                      }}
                    >
                      <span className="ml-auto text-right">Visualizar</span>
                      <ScanEye className="text-brand-dark h-4 w-4" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onSelect={() => {
                        handleEditUser(user);
                      }}
                    >
                      <span className="ml-auto text-right">Editar</span>
                      <PencilLine className="text-brand-dark h-4 w-4" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onSelect={() => {
                        handleDeactivateUser(user);
                      }}
                    >
                      <span className="ml-auto text-right">Desativar</span>
                      <FlagOff className="text-brand-dark h-4 w-4" />
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-brand-red-vivid focus:text-brand-red-vivid flex items-center gap-2"  onSelect={() => {
                        handleDeleteUser(user);
                      }}>
                      <span className="ml-auto text-right">Excluir</span>
                      <Trash2 className="h-4 w-4" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ViewUserDialog
        open={openView}
        onOpenChange={setOpenView}
        user={selectedUser}
      />
      <EditUserDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        user={selectedUser}
      />

      <DeactivateUserDialog
        open={openDeactivate}
        onOpenChange={setOpenDeactivate}
        user={selectedUser}
      />

      <DeleteUserDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        user={selectedUser}
      />
    </div>
  );
}
