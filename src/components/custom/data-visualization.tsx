"use client"

import type * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Simple Chart Components (you can replace with recharts or other chart library)

interface ChartData {
  label: string
  value: number
  color?: string
}

interface LineChartProps {
  data: ChartData[]
  height?: number
  className?: string
  showGrid?: boolean
  animate?: boolean
}

export function SimpleLineChart({ data, height = 200, className, showGrid = true, animate = true }: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((item.value - minValue) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="relative" style={{ height }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
            {/* Grid */}
            {showGrid && (
              <g className="text-gray-300" strokeWidth="0.2">
                {[0, 25, 50, 75, 100].map((y) => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" />
                ))}
              </g>
            )}

            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              className={animate ? "animate-pulse" : ""}
            />

            {/* Gradient */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Data Points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100
              const y = 100 - ((item.value - minValue) / range) * 100
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#3b82f6"
                  className="hover:r-3 transition-all cursor-pointer"
                >
                  <title>
                    {item.label}: {item.value}
                  </title>
                </circle>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <span>{data[0]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface BarChartProps {
  data: ChartData[]
  height?: number
  className?: string
  horizontal?: boolean
}

export function SimpleBarChart({ data, height = 200, className, horizontal = false }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="space-y-4" style={{ height }}>
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100

            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium truncate">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-white text-xs font-medium">{item.value}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

interface DonutChartProps {
  data: ChartData[]
  size?: number
  className?: string
  showLegend?: boolean
}

export function SimpleDonutChart({ data, size = 200, className, showLegend = true }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]

  let cumulativePercentage = 0

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-8">
          {/* Chart */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 42 42" className="transform -rotate-90">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100
                const strokeDasharray = `${percentage} ${100 - percentage}`
                const strokeDashoffset = -cumulativePercentage
                cumulativePercentage += percentage

                return (
                  <circle
                    key={index}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={item.color || colors[index % colors.length]}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color || colors[index % colors.length] }}
                  />
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm font-medium">({item.value})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Metric Cards
interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: "blue" | "green" | "red" | "yellow" | "purple"
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon,
  color = "blue",
  className,
}: MetricCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
  }

  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className={cn("bg-gradient-to-r text-white p-4", colorClasses[color])}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            {icon && <div className="text-white/80">{icon}</div>}
          </div>
        </div>
        {change !== undefined && (
          <div className="p-4">
            <div className="flex items-center space-x-2">
              {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
              {isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive && "text-green-600",
                  isNegative && "text-red-600",
                  !isPositive && !isNegative && "text-gray-600",
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              <span className="text-sm text-gray-500">{changeLabel}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Dashboard Grid
interface DashboardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function DashboardGrid({ children, columns = 4, className }: DashboardGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return <div className={cn("grid gap-6", gridCols[columns], className)}>{children}</div>
}
