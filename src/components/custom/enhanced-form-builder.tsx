"use client"

import * as React from "react"
import { useForm, type UseFormReturn, type FieldValues, type Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Eye, EyeOff, Calendar, Upload, X, Check, AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Enhanced Field Types
export type EnhancedFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "switch"
  | "file"
  | "date"
  | "multiselect"

export interface SelectOption {
  label: string
  value: string
  description?: string
  color?: string
}

export interface EnhancedFormFieldConfig {
  name: string
  label: string
  type: EnhancedFieldType
  placeholder?: string
  description?: string
  required?: boolean
  options?: SelectOption[]
  accept?: string // for file inputs
  multiple?: boolean
  min?: number
  max?: number
  step?: number
  rows?: number // for textarea
  className?: string
  icon?: React.ReactNode
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | boolean
  }
}

interface EnhancedFormBuilderProps<T extends FieldValues> {
  fields: EnhancedFormFieldConfig[]
  schema: z.ZodSchema<T>
  onSubmit: (data: T) => void | Promise<void>
  defaultValues?: Partial<T>
  submitText?: string
  resetText?: string
  loading?: boolean
  className?: string
  title?: string
  description?: string
  showProgress?: boolean
  layout?: "vertical" | "horizontal" | "grid"
  columns?: 1 | 2 | 3
  children?: (form: UseFormReturn<T>) => React.ReactNode
}

export function EnhancedFormBuilder<T extends FieldValues>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitText = "Submit",
  resetText = "Reset",
  loading = false,
  className,
  title,
  description,
  showProgress = false,
  layout = "vertical",
  columns = 1,
  children,
}: EnhancedFormBuilderProps<T>) {
  const [showPassword, setShowPassword] = React.useState<Record<string, boolean>>({})
  const [uploadedFiles, setUploadedFiles] = React.useState<Record<string, File[]>>({})

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  })

  const watchedValues = form.watch()
  const filledFields = fields.filter((field) => {
    const value = watchedValues[field.name as keyof typeof watchedValues]
    return value !== undefined && value !== "" && value !== null
  }).length

  const progress = showProgress ? (filledFields / fields.length) * 100 : 0

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  const handleFileChange = (fieldName: string, files: FileList | null) => {
    if (files) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: Array.from(files),
      }))
    }
  }

  const removeFile = (fieldName: string, index: number) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName]?.filter((_, i) => i !== index) || [],
    }))
  }

  const renderField = (field: EnhancedFormFieldConfig) => {
    const { name, label, type, placeholder, description, options, className: fieldClassName, icon, validation } = field

    return (
      <FormField
        key={name}
        control={form.control}
        name={name as Path<T>}
        render={({ field: formField, fieldState }) => (
          <FormItem className={cn("space-y-2", fieldClassName)}>
            <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {icon && <span className="text-blue-500">{icon}</span>}
              <span>{label}</span>
              {field.required && <span className="text-red-500">*</span>}
            </FormLabel>

            <FormControl>
              <div className="relative">
                {type === "text" || type === "email" || type === "number" ? (
                  <Input
                    type={type}
                    placeholder={placeholder}
                    className={cn(
                      "border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                      fieldState.error && "border-red-500 focus:border-red-500 focus:ring-red-200",
                      !fieldState.error && formField.value && "border-green-500",
                    )}
                    {...formField}
                  />
                ) : type === "password" ? (
                  <div className="relative">
                    <Input
                      type={showPassword[name] ? "text" : "password"}
                      placeholder={placeholder}
                      className={cn(
                        "border-2 pr-10 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                        fieldState.error && "border-red-500 focus:border-red-500 focus:ring-red-200",
                        !fieldState.error && formField.value && "border-green-500",
                      )}
                      {...formField}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility(name)}
                    >
                      {showPassword[name] ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                ) : type === "textarea" ? (
                  <Textarea
                    placeholder={placeholder}
                    rows={field.rows || 3}
                    className={cn(
                      "border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none",
                      fieldState.error && "border-red-500 focus:border-red-500 focus:ring-red-200",
                      !fieldState.error && formField.value && "border-green-500",
                    )}
                    {...formField}
                  />
                ) : type === "select" ? (
                  <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                    <SelectTrigger
                      className={cn(
                        "border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                        fieldState.error && "border-red-500 focus:border-red-500 focus:ring-red-200",
                        !fieldState.error && formField.value && "border-green-500",
                      )}
                    >
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            {option.color && (
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: option.color }} />
                            )}
                            <div>
                              <div>{option.label}</div>
                              {option.description && (
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : type === "checkbox" ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={name}
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                      className="border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor={name} className="text-sm font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ) : type === "switch" ? (
                  <div className="flex items-center justify-between">
                    <Label htmlFor={name} className="text-sm font-normal">
                      {label}
                    </Label>
                    <Switch
                      id={name}
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                ) : type === "radio" ? (
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="flex flex-col space-y-2"
                  >
                    {options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} className="border-2 text-blue-600" />
                        <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer">
                          <div>
                            <div>{option.label}</div>
                            {option.description && (
                              <div className="text-xs text-muted-foreground">{option.description}</div>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : type === "file" ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor={name}
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">{field.accept || "All files supported"}</p>
                        </div>
                        <input
                          id={name}
                          type="file"
                          className="hidden"
                          accept={field.accept}
                          multiple={field.multiple}
                          onChange={(e) => {
                            handleFileChange(name, e.target.files)
                            formField.onChange(e.target.files)
                          }}
                        />
                      </label>
                    </div>

                    {uploadedFiles[name] && uploadedFiles[name].length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles[name].map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                            <span className="text-sm text-blue-700">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(name, index)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : type === "date" ? (
                  <div className="relative">
                    <Input
                      type="date"
                      className={cn(
                        "border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                        fieldState.error && "border-red-500 focus:border-red-500 focus:ring-red-200",
                        !fieldState.error && formField.value && "border-green-500",
                      )}
                      {...formField}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                ) : null}

                {/* Field Status Icon */}
                {type !== "checkbox" && type !== "switch" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {fieldState.error ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : formField.value && !fieldState.error ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
            </FormControl>

            {description && (
              <FormDescription className="flex items-center space-x-1 text-xs text-gray-600">
                <Info className="h-3 w-3" />
                <span>{description}</span>
              </FormDescription>
            )}
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    )
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }

  return (
    <Card className="w-full shadow-lg border-2">
      {(title || description || showProgress) && (
        <CardHeader className="space-y-4">
          {title && (
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
          )}
          {description && <CardDescription className="text-gray-600">{description}</CardDescription>}
          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="text-blue-600 font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardHeader>
      )}

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
            <div className={cn(layout === "grid" ? `grid gap-6 ${gridCols[columns]}` : "space-y-6")}>
              {fields.map(renderField)}
            </div>

            {children && children(form)}

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  submitText
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={loading}
                className="border-2 hover:border-gray-400 transition-colors"
              >
                {resetText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
