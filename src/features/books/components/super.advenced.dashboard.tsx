"use client";

import * as React from "react";
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

// Import all our advanced components

import {
  BulkOperations,
  defaultBulkActions,
} from "@/components/custom/bulk-operations";
import {
  QuickActions,
  defaultQuickActions,
} from "@/components/custom/quick-actions";
import { DataImportExport } from "@/components/custom/data-import-export";
import {
  ClockWidget,
  QuickStatsWidget,
  RecentActivityWidget,
  ProgressTrackerWidget,
  NotificationsWidget,
  CalendarWidget,
} from "@/components/custom/dashboard-widgets";
import { AdvancedFilters } from "@/components/custom/advanced-filters";
import { EnhancedDataTable } from "@/components/custom/enhanced-data-table";
import { useNotify } from "@/components/custom/notification-system";
import { EasyDashboard } from "@/components/custom/easy-dashboard";

export default function SuperAdvancedDashboard() {
  const notify = useNotify();
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [tableData, setTableData] = React.useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      role: "admin",
      revenue: 1250,
      department: "IT",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "inactive",
      role: "user",
      revenue: 890,
      department: "Sales",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "active",
      role: "moderator",
      revenue: 2100,
      department: "Marketing",
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice@example.com",
      status: "active",
      role: "user",
      revenue: 1500,
      department: "HR",
    },
    {
      id: "5",
      name: "Charlie Wilson",
      email: "charlie@example.com",
      status: "inactive",
      role: "admin",
      revenue: 3200,
      department: "Finance",
    },
  ]);

  // Navigation configuration
  const navigation = {
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <Activity className="h-4 w-4" />,
      },
      {
        title: "Users",
        href: "/users",
        icon: <Users className="h-4 w-4" />,
        badge: "12",
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: <Calendar className="h-4 w-4" />,
        badge: "3",
      },
    ],
    logo: (
      <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        SuperDash
      </div>
    ),
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  };

  // Quick stats data
  const quickStats = [
    {
      label: "Total Users",
      value: "2,345",
      change: 12,
      icon: <Users className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Revenue",
      value: "$45,231",
      change: 8,
      icon: <DollarSign className="h-4 w-4" />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Active Sessions",
      value: "1,234",
      change: -2,
      icon: <Activity className="h-4 w-4" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Conversion",
      value: "3.24%",
      change: 15,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: "1",
      user: "John Doe",
      action: "created",
      target: "new user account",
      timestamp: new Date(Date.now() - 5 * 60000),
      type: "create" as const,
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "updated",
      target: "profile settings",
      timestamp: new Date(Date.now() - 15 * 60000),
      type: "update" as const,
    },
    {
      id: "3",
      user: "Bob Johnson",
      action: "deleted",
      target: "old report",
      timestamp: new Date(Date.now() - 30 * 60000),
      type: "delete" as const,
    },
    {
      id: "4",
      user: "Alice Brown",
      action: "logged in",
      target: "dashboard",
      timestamp: new Date(Date.now() - 45 * 60000),
      type: "login" as const,
    },
  ];

  // Progress items
  const progressItems = [
    { label: "Monthly Sales Goal", current: 75, target: 100, color: "blue" },
    { label: "User Onboarding", current: 45, target: 60, color: "green" },
    { label: "Project Completion", current: 8, target: 12, color: "purple" },
  ];

  // Notifications
  const [notifications, setNotifications] = React.useState([
    {
      id: "1",
      title: "New user registered",
      message: "John Doe just signed up",
      type: "info" as const,
      timestamp: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "Payment received",
      message: "$1,250 payment processed",
      type: "success" as const,
      timestamp: new Date(),
      read: false,
    },
    {
      id: "3",
      title: "Server warning",
      message: "High CPU usage detected",
      type: "warning" as const,
      timestamp: new Date(),
      read: true,
    },
    {
      id: "4",
      title: "Backup failed",
      message: "Daily backup could not complete",
      type: "error" as const,
      timestamp: new Date(),
      read: false,
    },
  ]);

  // Table columns
  const tableColumns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            table.toggleAllPageRowsSelected(e.target.checked);
            if (e.target.checked) {
              setSelectedItems(tableData.map((item) => item.id));
            } else {
              setSelectedItems([]);
            }
          }}
        />
      ),
      cell: ({ row }: any) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, row.original.id]);
            } else {
              setSelectedItems(
                selectedItems.filter((id) => id !== row.original.id),
              );
            }
          }}
        />
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "department", header: "Department" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }: any) => `$${row.original.revenue}`,
    },
  ];

  // Filter fields
  const filterFields = [
    { key: "name", label: "Name", type: "text" as const },
    { key: "email", label: "Email", type: "text" as const },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      key: "department",
      label: "Department",
      type: "select" as const,
      options: [
        { label: "IT", value: "IT" },
        { label: "Sales", value: "Sales" },
        { label: "Marketing", value: "Marketing" },
        { label: "HR", value: "HR" },
        { label: "Finance", value: "Finance" },
      ],
    },
    { key: "revenue", label: "Revenue", type: "number" as const },
  ];

  // Enhanced bulk actions
  const bulkActions = [
    ...defaultBulkActions,
    {
      id: "send-email",
      label: "Send Email",
      icon: <Mail className="h-4 w-4" />,
      onClick: (ids: string[]) =>
        notify.info("Email sent", `Sent email to ${ids.length} users`),
    },
    {
      id: "call",
      label: "Schedule Call",
      icon: <Phone className="h-4 w-4" />,
      onClick: (ids: string[]) =>
        notify.success(
          "Calls scheduled",
          `Scheduled calls for ${ids.length} users`,
        ),
    },
  ];

  // Enhanced quick actions
  const quickActions = [
    ...defaultQuickActions,
    {
      id: "analytics",
      label: "Analytics",
      icon: <TrendingUp className="h-4 w-4" />,
      shortcut: "a",
      onClick: () => notify.info("Analytics", "Opening analytics dashboard"),
    },
  ];

  // Handlers
  const handleSearch = (query: string) => {
    notify.info("Search", `Searching for: ${query}`);
  };

  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters);
    notify.info("Filters applied", `Applied ${filters.length} filter groups`);
  };

  const handleImport = async (file: File, options: any) => {
    notify.info("Import started", `Importing ${file.name}`);
    // Simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      totalRows: 100,
      successRows: 95,
      errors: [
        { row: 23, message: "Invalid email format" },
        { row: 45, message: "Missing required field" },
      ],
    };
  };

  const handleExport = async (format: string, options: any) => {
    notify.success(
      "Export completed",
      `Data exported as ${format.toUpperCase()}`,
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <EasyDashboard navigation={navigation} className="p-6 space-y-8">
      {/* Top Row - Quick Actions */}
      <QuickActions
        actions={quickActions}
        onSearch={handleSearch}
        searchPlaceholder="Search anything... (⌘K)"
      />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ClockWidget />
        <QuickStatsWidget stats={quickStats} />
        <ProgressTrackerWidget items={progressItems} />
        <CalendarWidget />
      </div>

      {/* Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityWidget activities={recentActivities} />
        <NotificationsWidget
          notifications={notifications}
          onMarkAsRead={markNotificationAsRead}
        />
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        fields={filterFields}
        onFiltersChange={handleFiltersChange}
        savedFilters={[
          { name: "Active IT Users", filters: [] },
          { name: "High Revenue", filters: [] },
        ]}
        onSaveFilter={(name, filters) =>
          notify.success("Filter saved", `Saved filter: ${name}`)
        }
      />

      {/* Bulk Operations */}
      {selectedItems.length > 0 && (
        <BulkOperations
          selectedItems={selectedItems}
          totalItems={tableData.length}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedItems(tableData.map((item) => item.id));
            } else {
              setSelectedItems([]);
            }
          }}
          onClearSelection={() => setSelectedItems([])}
          actions={bulkActions}
        />
      )}

      {/* Data Table */}
      <EnhancedDataTable
        title="Users Management"
        description="Manage your users with advanced features"
        data={tableData}
        columns={tableColumns}
        searchKey="name"
        onAdd={() => notify.success("Add user", "Opening user creation form")}
        onRefresh={() => notify.info("Refreshing", "Reloading user data")}
        onExport={() => notify.success("Export", "Exporting user data")}
      />

      {/* Import/Export */}
      <DataImportExport
        onImport={handleImport}
        onExport={handleExport}
        supportedFormats={["csv", "xlsx", "json", "pdf"]}
      />

      {/* Demo Buttons */}
      <div className="flex flex-wrap gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="w-full text-lg font-semibold mb-4">
          🚀 Test All Features:
        </h3>

        <button
          onClick={() =>
            notify.success("Success!", "Operation completed successfully")
          }
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Success Notification
        </button>

        <button
          onClick={() => notify.error("Error!", "Something went wrong")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Error Notification
        </button>

        <button
          onClick={() =>
            notify.warning("Warning!", "Please check your settings")
          }
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Warning Notification
        </button>

        <button
          onClick={() => notify.info("Info!", "Here's some useful information")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Info Notification
        </button>

        <button
          onClick={() =>
            setSelectedItems(selectedItems.length > 0 ? [] : ["1", "2", "3"])
          }
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Toggle Bulk Selection
        </button>
      </div>
    </EasyDashboard>
  );
}
