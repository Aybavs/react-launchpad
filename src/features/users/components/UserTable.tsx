import { useMemo, useCallback } from 'react'

import { clsx } from 'clsx'

import { Button, useToast } from '@/core/ui'
import { DataTable } from '@/core/ui/components/DataTable'
import { useModal } from '@/core/ui/hooks/useModal'

import { useDeleteUser } from '../api'

import type { User } from '../types'
import type { ColumnDef } from '@tanstack/react-table'

interface UserTableProps {
  users: User[]
  isLoading?: boolean
  onEdit?: (user: User) => void
  onView?: (user: User) => void
}

const statusColors = {
  active:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
}

const roleColors = {
  admin:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  user: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

export function UserTable({
  users,
  isLoading,
  onEdit,
  onView,
}: UserTableProps) {
  const { openConfirm } = useModal()
  const { success, error } = useToast()
  const deleteUser = useDeleteUser()

  const handleDelete = useCallback(
    (user: User) => {
      openConfirm({
        title: 'Delete User',
        description: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
        onConfirm: async () => {
          try {
            await deleteUser.mutateAsync(user.id)
            success('User deleted successfully')
          } catch {
            error('Failed to delete user')
          }
        },
      })
    },
    [openConfirm, deleteUser, success, error]
  )

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              {row.original.avatar ? (
                <img
                  src={row.original.avatar}
                  alt={`${row.original.firstName} ${row.original.lastName}`}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium">
                  {row.original.firstName[0]}
                  {row.original.lastName[0]}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium">
                {row.original.firstName} {row.original.lastName}
              </p>
              <p className="text-sm text-text-secondary">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <span
            className={clsx(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
              roleColors[row.original.role]
            )}
          >
            {row.original.role}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={clsx(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
              statusColors[row.original.status]
            )}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onView(row.original)
                }}
              >
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(row.original)
                }}
              >
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(row.original)
              }}
              className="text-error hover:text-error"
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onView, handleDelete]
  )

  return (
    <DataTable
      data={users}
      columns={columns}
      isLoading={isLoading}
      enableSorting
      enablePagination
      emptyMessage="No users found"
    />
  )
}
