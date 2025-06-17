"use client"

import * as React from "react"
import { Filter, X, Plus, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FilterCondition {
  id: string
  field: string
  operator:
    | "equals"
    | "contains"
    | "starts_with"
    | "ends_with"
    | "greater_than"
    | "less_than"
    | "between"
    | "in"
    | "not_in"
  value: any
  type: "text" | "number" | "date" | "select" | "multiselect" | "boolean"
}

interface FilterGroup {
  id: string
  name: string
  conditions: FilterCondition[]
  operator: "AND" | "OR"
}

interface AdvancedFiltersProps {
  fields: Array<{
    key: string
    label: string
    type: FilterCondition["type"]
    options?: Array<{ label: string; value: string }>
  }>
  onFiltersChange: (filters: FilterGroup[]) => void
  savedFilters?: Array<{ name: string; filters: FilterGroup[] }>
  onSaveFilter?: (name: string, filters: FilterGroup[]) => void
  className?: string
}

export function AdvancedFilters({
  fields,
  onFiltersChange,
  savedFilters = [],
  onSaveFilter,
  className,
}: AdvancedFiltersProps) {
  const [filterGroups, setFilterGroups] = React.useState<FilterGroup[]>([
    {
      id: "default",
      name: "Default Group",
      conditions: [],
      operator: "AND",
    },
  ])
  const [isOpen, setIsOpen] = React.useState(false)
  const [saveFilterName, setSaveFilterName] = React.useState("")

  const addCondition = (groupId: string) => {
    setFilterGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: [
                ...group.conditions,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  field: fields[0]?.key || "",
                  operator: "equals",
                  value: "",
                  type: fields[0]?.type || "text",
                },
              ],
            }
          : group,
      ),
    )
  }

  const removeCondition = (groupId: string, conditionId: string) => {
    setFilterGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter((c) => c.id !== conditionId),
            }
          : group,
      ),
    )
  }

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<FilterCondition>) => {
    setFilterGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((c) => (c.id === conditionId ? { ...c, ...updates } : c)),
            }
          : group,
      ),
    )
  }

  const addGroup = () => {
    setFilterGroups((groups) => [
      ...groups,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: `Group ${groups.length + 1}`,
        conditions: [],
        operator: "AND",
      },
    ])
  }

  const removeGroup = (groupId: string) => {
    setFilterGroups((groups) => groups.filter((g) => g.id !== groupId))
  }

  const clearAllFilters = () => {
    setFilterGroups([
      {
        id: "default",
        name: "Default Group",
        conditions: [],
        operator: "AND",
      },
    ])
  }

  const loadSavedFilter = (savedFilter: { name: string; filters: FilterGroup[] }) => {
    setFilterGroups(savedFilter.filters)
  }

  const saveCurrentFilter = () => {
    if (saveFilterName && onSaveFilter) {
      onSaveFilter(saveFilterName, filterGroups)
      setSaveFilterName("")
    }
  }

  React.useEffect(() => {
    onFiltersChange(filterGroups)
  }, [filterGroups, onFiltersChange])

  const getOperatorOptions = (type: FilterCondition["type"]) => {
    switch (type) {
      case "text":
        return [
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" },
          { value: "starts_with", label: "Starts with" },
          { value: "ends_with", label: "Ends with" },
        ]
      case "number":
      case "date":
        return [
          { value: "equals", label: "Equals" },
          { value: "greater_than", label: "Greater than" },
          { value: "less_than", label: "Less than" },
          { value: "between", label: "Between" },
        ]
      case "select":
      case "multiselect":
        return [
          { value: "in", label: "In" },
          { value: "not_in", label: "Not in" },
        ]
      case "boolean":
        return [{ value: "equals", label: "Equals" }]
      default:
        return [{ value: "equals", label: "Equals" }]
    }
  }

  const renderValueInput = (condition: FilterCondition, groupId: string) => {
    const field = fields.find((f) => f.key === condition.field)

    switch (condition.type) {
      case "text":
        return (
          <Input
            placeholder="Enter value"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
          />
        )
      case "number":
        return (
          <Input
            type="number"
            placeholder="Enter number"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
          />
        )
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {condition.value ? new Date(condition.value).toLocaleDateString() : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={condition.value ? new Date(condition.value) : undefined}
                onSelect={(date) => updateCondition(groupId, condition.id, { value: date?.toISOString() })}
              />
            </PopoverContent>
          </Popover>
        )
      case "select":
        return (
          <Select value={condition.value} onValueChange={(value) => updateCondition(groupId, condition.id, { value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              {field?.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "boolean":
        return (
          <Select value={condition.value} onValueChange={(value) => updateCondition(groupId, condition.id, { value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            placeholder="Enter value"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
          />
        )
    }
  }

  const activeFiltersCount = filterGroups.reduce((count, group) => count + group.conditions.length, 0)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn("flex items-center space-x-2", activeFiltersCount > 0 && "border-blue-500 bg-blue-50")}
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && !isOpen && (
        <div className="flex flex-wrap gap-2">
          {filterGroups.map((group) =>
            group.conditions.map((condition) => {
              const field = fields.find((f) => f.key === condition.field)
              return (
                <Badge
                  key={condition.id}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                  onClick={() => removeCondition(group.id, condition.id)}
                >
                  {field?.label}: {condition.operator} {condition.value}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )
            }),
          )}
        </div>
      )}

      {/* Filter Builder */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filter Builder</span>
              <div className="flex items-center space-x-2">
                {savedFilters.length > 0 && (
                  <Select onValueChange={(value) => loadSavedFilter(JSON.parse(value))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Load saved filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedFilters.map((filter, index) => (
                        <SelectItem key={index} value={JSON.stringify(filter)}>
                          {filter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button variant="outline" size="sm" onClick={addGroup}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Group
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {filterGroups.map((group, groupIndex) => (
              <div key={group.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{group.name}</span>
                    <Select
                      value={group.operator}
                      onValueChange={(value: "AND" | "OR") =>
                        setFilterGroups((groups) =>
                          groups.map((g) => (g.id === group.id ? { ...g, operator: value } : g)),
                        )
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {filterGroups.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeGroup(group.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {group.conditions.map((condition, conditionIndex) => (
                  <div key={condition.id} className="grid grid-cols-12 gap-2 items-center">
                    {conditionIndex > 0 && (
                      <div className="col-span-1 text-center text-sm text-muted-foreground">{group.operator}</div>
                    )}
                    <div className={cn("col-span-3", conditionIndex === 0 && "col-start-2")}>
                      <Select
                        value={condition.field}
                        onValueChange={(value) => {
                          const field = fields.find((f) => f.key === value)
                          updateCondition(group.id, condition.id, {
                            field: value,
                            type: field?.type || "text",
                            value: "",
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields.map((field) => (
                            <SelectItem key={field.key} value={field.key}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={condition.operator}
                        onValueChange={(value: any) => updateCondition(group.id, condition.id, { operator: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getOperatorOptions(condition.type).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-4">{renderValueInput(condition, group.id)}</div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm" onClick={() => removeCondition(group.id, condition.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={() => addCondition(group.id)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Condition
                </Button>
              </div>
            ))}

            {/* Save Filter */}
            {onSaveFilter && (
              <div className="flex items-center space-x-2 pt-4 border-t">
                <Input
                  placeholder="Filter name"
                  value={saveFilterName}
                  onChange={(e) => setSaveFilterName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={saveCurrentFilter} disabled={!saveFilterName}>
                  Save Filter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
