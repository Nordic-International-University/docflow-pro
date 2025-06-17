"use client"

import * as React from "react"
import { Calendar, Clock, Activity, Bell } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Real-time Clock Widget
export function ClockWidget({ className }: { className?: string }) {
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Clock className="h-8 w-8 text-blue-600" />
          <div>
            <div className="text-2xl font-bold">{time.toLocaleTimeString()}</div>
            <div className="text-sm text-muted-foreground">{time.toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Stats Widget
interface QuickStatsProps {
  stats: Array<{
    label: string
    value: string | number
    change?: number
    icon: React.ReactNode
    color?: string
  }>
  className?: string
}

export function QuickStatsWidget({ stats, className }: QuickStatsProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-lg", stat.color || "bg-blue-100 text-blue-600")}>{stat.icon}</div>
              <div>
                <div className="font-semibold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
            {stat.change !== undefined && (
              <Badge variant={stat.change >= 0 ? "default" : "destructive"} className="text-xs">
                {stat.change >= 0 ? "+" : ""}
                {stat.change}%
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Recent Activity Widget
interface ActivityItem {
  id: string
  user: string
  action: string
  target: string
  timestamp: Date
  type: "create" | "update" | "delete" | "login"
}

interface RecentActivityProps {
  activities: ActivityItem[]
  className?: string
}

export function RecentActivityWidget({ activities, className }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "create":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "update":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case "delete":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case "login":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-4">
          View all activity
        </Button>
      </CardContent>
    </Card>
  )
}

// Progress Tracker Widget
interface ProgressItem {
  label: string
  current: number
  target: number
  color?: string
}

interface ProgressTrackerProps {
  items: ProgressItem[]
  className?: string
}

export function ProgressTrackerWidget({ items, className }: ProgressTrackerProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Progress Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const percentage = Math.min((item.current / item.target) * 100, 100)
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.current} / {item.target}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">{percentage.toFixed(1)}% complete</div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Notifications Widget
interface NotificationItem {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: Date
  read: boolean
}

interface NotificationsWidgetProps {
  notifications: NotificationItem[]
  onMarkAsRead?: (id: string) => void
  className?: string
}

export function NotificationsWidget({ notifications, onMarkAsRead, className }: NotificationsWidgetProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "success":
        return "text-green-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-colors",
                notification.read ? "bg-gray-50 dark:bg-gray-900" : "bg-blue-50 dark:bg-blue-950 border-blue-200",
              )}
              onClick={() => onMarkAsRead?.(notification.id)}
            >
              <div className="flex items-start space-x-2">
                <div className={cn("w-2 h-2 rounded-full mt-2", getNotificationColor(notification.type))} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.timestamp.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-4">
          View all notifications
        </Button>
      </CardContent>
    </Card>
  )
}

// Calendar Widget
export function CalendarWidget({ className }: { className?: string }) {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const today = new Date()
  const events = [
    { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), title: "Team Meeting" },
    { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), title: "Project Deadline" },
    { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), title: "Client Call" },
  ]

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Upcoming Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <div className="text-center">
                <div className="text-lg font-bold">{event.date.getDate()}</div>
                <div className="text-xs text-muted-foreground">
                  {event.date.toLocaleDateString("en", { month: "short" })}
                </div>
              </div>
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.date.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-4">
          View calendar
        </Button>
      </CardContent>
    </Card>
  )
}
