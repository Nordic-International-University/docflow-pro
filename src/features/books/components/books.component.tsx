import React from "react";
import { EnhancedDataTable } from "@/components/custom/enhanced-data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface BooksProps {
  className?: string;
}

type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  role: "admin" | "user" | "moderator";
  createdAt: string;
};

const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "admin",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    role: "user",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "inactive",
    role: "moderator",
    createdAt: "2024-01-17",
  },
];

export const Books: React.FC<BooksProps> = ({ className = "" }) => {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>(sampleUsers);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <span className="capitalize px-2 py-1 rounded-full text-xs bg-secondary">
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`capitalize px-2 py-1 rounded-full text-xs ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit user</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedUser(user);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className={`books ${className}`.trim()}>
      <h2>Books</h2>
      <p>Books component</p>
      <EnhancedDataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
        title="Users Management"
        description="Manage your users and their permissions"
        onAdd={() => setIsAddModalOpen(true)}
        onRefresh={() => {
          // Add refresh logic here
          console.log("Refreshing data...");
        }}
        onExport={() => {
          // Add export logic here
          console.log("Exporting data...");
        }}
        loading={loading}
      />
    </div>
  );
};
export default Books;
