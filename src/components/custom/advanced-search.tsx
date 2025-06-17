"use client"

import * as React from "react"
import { Search, Filter, X, Calendar, MapPin, Tag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export interface SearchFilter {
  id: string
  label: string
  type: "text" | "select" | "date" | "checkbox" | "range"
  options?: { label: string; value: string }[]
  value?: any
  placeholder?: string
  icon?: React.ReactNode
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: Record<string, any>) => void
  filters?: SearchFilter[]
  placeholder?: string
  showQuickFilters?: boolean
  className?: string
}

export function AdvancedSearch({
  onSearch,
  filters = [],
  placeholder = "Search anything...",
  showQuickFilters = true,
  className,
}: AdvancedSearchProps) {
  const [query, setQuery] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, any>>({})
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const handleSearch = React.useCallback(() => {
    onSearch(query, activeFilters)
  }, [query, activeFilters, onSearch])

  const updateFilter = (filterId: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }

  const removeFilter = (filterId: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[filterId]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setQuery("")
  }

  React.useEffect(() => {
    const debounceTimer = setTimeout(handleSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [handleSearch])

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <div className="relative flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 h-12 text-lg border-2 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Filter Button */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "h-12 px-4 border-2 transition-all duration-200",
                activeFilterCount > 0
                  ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "hover:border-gray-400",
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-600 text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Filters</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-sm font-medium flex items-center space-x-2">
                    {filter.icon && <span className="text-blue-500">{filter.icon}</span>}
                    <span>{filter.label}</span>
                  </label>

                  {filter.type === "text" && (
                    <Input
                      placeholder={filter.placeholder}
                      value={activeFilters[filter.id] || ""}
                      onChange={(e) => updateFilter(filter.id, e.target.value)}
                    />
                  )}

                  {filter.type === "select" && (
                    <Select
                      value={activeFilters[filter.id] || ""}
                      onValueChange={(value) => updateFilter(filter.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={filter.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {filter.type === "date" && (
                    <CalendarComponent
                      mode="single"
                      selected={activeFilters[filter.id]}
                      onSelect={(date) => updateFilter(filter.id, date)}
                      className="rounded-md border"
                    />
                  )}

                  {filter.type === "checkbox" && filter.options && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${filter.id}-${option.value}`}
                            checked={(activeFilters[filter.id] || []).includes(option.value)}
                            onCheckedChange={(checked) => {
                              const currentValues = activeFilters[filter.id] || []
                              if (checked) {
                                updateFilter(filter.id, [...currentValues, option.value])
                              } else {
                                updateFilter(
                                  filter.id,
                                  currentValues.filter((v: string) => v !== option.value),
                                )
                              }
                            }}
                          />
                          <label htmlFor={`${filter.id}-${option.value}`} className="text-sm cursor-pointer">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={handleSearch} size="lg" className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
          Search
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find((f) => f.id === filterId)
            if (!filter || !value) return null

            const displayValue = Array.isArray(value) ? value.join(", ") : String(value)

            return (
              <Badge
                key={filterId}
                variant="secondary"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                onClick={() => removeFilter(filterId)}
              >
                {filter.label}: {displayValue}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )
          })}
        </div>
      )}

      {/* Quick Filters */}
      {showQuickFilters && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="h-3 w-3 mr-1" />
            Today
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <User className="h-3 w-3 mr-1" />
            My Items
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Tag className="h-3 w-3 mr-1" />
            Popular
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <MapPin className="h-3 w-3 mr-1" />
            Nearby
          </Button>
        </div>
      )}
    </div>
  )
}
