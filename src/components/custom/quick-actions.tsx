"use client"

import * as React from "react"
import { Plus, Upload, Download, Settings, RefreshCw, Filter, Search, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  onClick: () => void
  variant?: "default" | "secondary" | "outline"
  badge?: string | number
}

interface QuickActionsProps {
  actions: QuickAction[]
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  className?: string
}

export function QuickActions({
  actions,
  onSearch,
  searchPlaceholder = "Quick search...",
  className,
}: QuickActionsProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("quick-search")?.focus()
      }

      // Handle action shortcuts
      actions.forEach((action) => {
        if (action.shortcut && e.key === action.shortcut && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          action.onClick()
        }
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [actions])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <div className={cn("flex items-center justify-between gap-4 p-4 bg-card border rounded-lg", className)}>
      {/* Search */}
      {onSearch && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="quick-search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Badge variant="secondary" className="text-xs">
              ⌘K
            </Badge>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        {actions.slice(0, 4).map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
            className="relative"
            title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
          >
            {action.icon}
            <span className="ml-2 hidden sm:inline">{action.label}</span>
            {action.badge && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {action.badge}
              </Badge>
            )}
          </Button>
        ))}

        {/* More Actions */}
        {actions.length > 4 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {actions.slice(4).map((action) => (
                <DropdownMenuItem key={action.id} onClick={action.onClick}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </div>
                    {action.shortcut && (
                      <Badge variant="secondary" className="text-xs">
                        {action.shortcut}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

// Pre-defined quick actions
export const defaultQuickActions: QuickAction[] = [
  {
    id: "add",
    label: "Add New",
    icon: <Plus className="h-4 w-4" />,
    shortcut: "n",
    onClick: () => console.log("Add new"),
    variant: "default",
  },
  {
    id: "import",
    label: "Import",
    icon: <Upload className="h-4 w-4" />,
    shortcut: "i",
    onClick: () => console.log("Import"),
  },
  {
    id: "export",
    label: "Export",
    icon: <Download className="h-4 w-4" />,
    shortcut: "e",
    onClick: () => console.log("Export"),
  },
  {
    id: "refresh",
    label: "Refresh",
    icon: <RefreshCw className="h-4 w-4" />,
    shortcut: "r",
    onClick: () => console.log("Refresh"),
  },
  {
    id: "filter",
    label: "Filter",
    icon: <Filter className="h-4 w-4" />,
    shortcut: "f",
    onClick: () => console.log("Filter"),
    badge: "3",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    shortcut: ",",
    onClick: () => console.log("Settings"),
  },
]
