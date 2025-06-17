"use client";

import type * as React from "react";
import {
  Trash2,
  Edit,
  Download,
  Mail,
  Archive,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "secondary";
  onClick: (selectedIds: string[]) => void;
  disabled?: boolean;
}

interface BulkOperationsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
  actions: BulkAction[];
  className?: string;
}

export function BulkOperations({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  actions,
  className,
}: BulkOperationsProps) {
  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isPartiallySelected =
    selectedItems.length > 0 && selectedItems.length < totalItems;

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg animate-in slide-in-from-top-2 duration-200",
        className,
      )}
    >
      <div className="flex items-center space-x-4">
        <Checkbox
          checked={isAllSelected}
          ref={(el) => {
            if (el) (el as any).indeterminate = isPartiallySelected;
          }}
          onCheckedChange={onSelectAll}
          className="border-blue-500 data-[state=checked]:bg-blue-600"
        />
        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {selectedItems.length} selected
          </Badge>
          <span className="text-sm text-muted-foreground">
            of {totalItems} items
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Quick Actions */}
        {actions.slice(0, 3).map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outline"}
            size="sm"
            onClick={() => action.onClick(selectedItems)}
            disabled={action.disabled}
            className="h-8"
          >
            {action.icon}
            <span className="ml-2 hidden sm:inline">{action.label}</span>
          </Button>
        ))}

        {/* More Actions */}
        {actions.length > 3 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.slice(3).map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => action.onClick(selectedItems)}
                  disabled={action.disabled}
                  className={cn(
                    action.variant === "destructive" &&
                      "text-red-600 focus:text-red-600",
                  )}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenuSeparator />

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

// Pre-defined bulk actions
export const defaultBulkActions: BulkAction[] = [
  {
    id: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
    onClick: (ids) => console.log("Delete:", ids),
  },
  {
    id: "edit",
    label: "Edit",
    icon: <Edit className="h-4 w-4" />,
    onClick: (ids) => console.log("Edit:", ids),
  },
  {
    id: "export",
    label: "Export",
    icon: <Download className="h-4 w-4" />,
    onClick: (ids) => console.log("Export:", ids),
  },
  {
    id: "email",
    label: "Send Email",
    icon: <Mail className="h-4 w-4" />,
    onClick: (ids) => console.log("Email:", ids),
  },
  {
    id: "archive",
    label: "Archive",
    icon: <Archive className="h-4 w-4" />,
    onClick: (ids) => console.log("Archive:", ids),
  },
];
