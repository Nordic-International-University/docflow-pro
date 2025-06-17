"use client"

import type * as React from "react"
import { NavigationMenu, type NavItem } from "./navigation-menu"
import { NotificationProvider } from "./notification-system"
import { DashboardGrid, MetricCard } from "./data-visualization"
import { EnhancedDataTable } from "./enhanced-data-table"
import { AdvancedSearch } from "./advanced-search"

// Easy to use Dashboard wrapper
interface EasyDashboardProps {
  children: React.ReactNode
  navigation?: {
    items: NavItem[]
    logo?: React.ReactNode
    user?: {
      name: string
      email: string
      avatar?: string
    }
  }
  className?: string
}

export function EasyDashboard({ children, navigation, className }: EasyDashboardProps) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {navigation && <NavigationMenu {...navigation} />}
        <main className={className}>{children}</main>
      </div>
    </NotificationProvider>
  )
}

// Pre-built dashboard sections
export function DashboardMetrics({ metrics }: { metrics: Array<any> }) {
  return (
    <DashboardGrid columns={4}>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </DashboardGrid>
  )
}

export function DashboardTable({ title, data, columns, ...props }: any) {
  return (
    <div className="space-y-6">
      <EnhancedDataTable title={title} data={data} columns={columns} {...props} />
    </div>
  )
}

export function DashboardSearch({ onSearch, filters }: any) {
  return <AdvancedSearch onSearch={onSearch} filters={filters} className="mb-6" />
}

// Export all components for easy access
export * from "./enhanced-data-table"
export * from "./enhanced-form-builder"
export * from "./custom-modal"
export * from "./advanced-search"
export * from "./notification-system"
export * from "./file-upload"
export * from "./data-visualization"
export * from "./navigation-menu"
