"use client"

import * as React from "react"
import { Upload, Download, FileText, FileSpreadsheet, Database, Check, X, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface ImportExportProps {
  onImport?: (file: File, options: ImportOptions) => Promise<ImportResult>
  onExport?: (format: ExportFormat, options: ExportOptions) => Promise<void>
  supportedFormats?: ExportFormat[]
  className?: string
}

interface ImportOptions {
  format: "csv" | "xlsx" | "json"
  hasHeaders: boolean
  delimiter?: string
  mapping?: Record<string, string>
}

interface ExportOptions {
  includeHeaders: boolean
  selectedColumns?: string[]
  dateFormat?: string
  filters?: Record<string, any>
}

interface ImportResult {
  success: boolean
  totalRows: number
  successRows: number
  errors: Array<{ row: number; message: string }>
}

type ExportFormat = "csv" | "xlsx" | "json" | "pdf"

export function DataImportExport({
  onImport,
  onExport,
  supportedFormats = ["csv", "xlsx", "json", "pdf"],
  className,
}: ImportExportProps) {
  const [importFile, setImportFile] = React.useState<File | null>(null)
  const [importOptions, setImportOptions] = React.useState<ImportOptions>({
    format: "csv",
    hasHeaders: true,
    delimiter: ",",
  })
  const [exportOptions, setExportOptions] = React.useState<ExportOptions>({
    includeHeaders: true,
    dateFormat: "YYYY-MM-DD",
  })
  const [importing, setImporting] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)
  const [importResult, setImportResult] = React.useState<ImportResult | null>(null)
  const [progress, setProgress] = React.useState(0)

  const handleImport = async () => {
    if (!importFile || !onImport) return

    setImporting(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const result = await onImport(importFile, importOptions)
      setImportResult(result)
      setProgress(100)
    } catch (error) {
      console.error("Import failed:", error)
    } finally {
      clearInterval(progressInterval)
      setImporting(false)
    }
  }

  const handleExport = async (format: ExportFormat) => {
    if (!onExport) return

    setExporting(true)
    try {
      await onExport(format, exportOptions)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setExporting(false)
    }
  }

  const formatIcons = {
    csv: <FileText className="h-4 w-4" />,
    xlsx: <FileSpreadsheet className="h-4 w-4" />,
    json: <Database className="h-4 w-4" />,
    pdf: <FileText className="h-4 w-4" />,
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Data Import & Export</span>
        </CardTitle>
        <CardDescription>Import data from files or export your data in various formats</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </TabsTrigger>
          </TabsList>

          {/* Import Tab */}
          <TabsContent value="import" className="space-y-4">
            {/* File Upload */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="import-file"
                />
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-semibold mb-2">Choose file to import</p>
                  <p className="text-gray-600">Supports CSV, XLSX, and JSON files</p>
                </label>
              </div>

              {importFile && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{importFile.name}</span>
                    <Badge variant="secondary">{(importFile.size / 1024).toFixed(1)} KB</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setImportFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Import Options */}
            {importFile && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Import Options</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">File Format</label>
                    <Select
                      value={importOptions.format}
                      onValueChange={(value: any) => setImportOptions({ ...importOptions, format: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {importOptions.format === "csv" && (
                    <div>
                      <label className="text-sm font-medium">Delimiter</label>
                      <Select
                        value={importOptions.delimiter}
                        onValueChange={(value) => setImportOptions({ ...importOptions, delimiter: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=",">, (Comma)</SelectItem>
                          <SelectItem value=";">; (Semicolon)</SelectItem>
                          <SelectItem value="\t">Tab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-headers"
                    checked={importOptions.hasHeaders}
                    onCheckedChange={(checked) => setImportOptions({ ...importOptions, hasHeaders: !!checked })}
                  />
                  <label htmlFor="has-headers" className="text-sm">
                    First row contains headers
                  </label>
                </div>
              </div>
            )}

            {/* Import Progress */}
            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing data...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {/* Import Result */}
            {importResult && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {importResult.success ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {importResult.success ? "Import Successful" : "Import Completed with Errors"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Total rows: {importResult.totalRows}</p>
                  <p>Successfully imported: {importResult.successRows}</p>
                  {importResult.errors.length > 0 && <p>Errors: {importResult.errors.length}</p>}
                </div>
              </div>
            )}

            <Button onClick={handleImport} disabled={!importFile || importing} className="w-full">
              {importing ? "Importing..." : "Import Data"}
            </Button>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            {/* Export Options */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold">Export Options</h4>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-headers"
                  checked={exportOptions.includeHeaders}
                  onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeHeaders: !!checked })}
                />
                <label htmlFor="include-headers" className="text-sm">
                  Include column headers
                </label>
              </div>

              <div>
                <label className="text-sm font-medium">Date Format</label>
                <Select
                  value={exportOptions.dateFormat}
                  onValueChange={(value) => setExportOptions({ ...exportOptions, dateFormat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Export Formats */}
            <div className="grid grid-cols-2 gap-4">
              {supportedFormats.map((format) => (
                <Button
                  key={format}
                  variant="outline"
                  onClick={() => handleExport(format)}
                  disabled={exporting}
                  className="h-16 flex-col space-y-2"
                >
                  {formatIcons[format]}
                  <span className="uppercase">{format}</span>
                </Button>
              ))}
            </div>

            {exporting && (
              <div className="text-center text-sm text-gray-600">
                <p>Preparing export...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
