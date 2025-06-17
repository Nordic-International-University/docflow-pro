"use client"

import * as React from "react"
import { Upload, X, File, ImageIcon, Video, FileText, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: "uploading" | "completed" | "error"
  url?: string
}

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  onRemove?: (fileId: string) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  className?: string
  disabled?: boolean
  showPreview?: boolean
  uploadText?: string
  dragText?: string
}

export function FileUpload({
  onUpload,
  onRemove,
  accept = "*/*",
  multiple = true,
  maxSize = 10,
  maxFiles = 5,
  className,
  disabled = false,
  showPreview = true,
  uploadText = "Click to upload files",
  dragText = "or drag and drop files here",
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.startsWith("video/")) return Video
    if (file.type.includes("pdf") || file.type.includes("document")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }

  const handleFileSelect = async (selectedFiles: FileList) => {
    if (disabled) return

    const newFiles: File[] = []
    const errors: string[] = []

    Array.from(selectedFiles).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else if (files.length + newFiles.length < maxFiles) {
        newFiles.push(file)
      } else {
        errors.push(`Maximum ${maxFiles} files allowed`)
      }
    })

    if (errors.length > 0) {
      // Handle errors (you can integrate with notification system)
      console.error("Upload errors:", errors)
      return
    }

    // Create upload file objects
    const uploadFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    setFiles((prev) => [...prev, ...uploadFiles])

    // Simulate upload progress
    uploadFiles.forEach((uploadFile) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  progress: Math.min(f.progress + Math.random() * 30, 100),
                }
              : f,
          ),
        )
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  progress: 100,
                  status: "completed" as const,
                  url: `https://example.com/files/${f.file.name}`,
                }
              : f,
          ),
        )
      }, 2000)
    })

    try {
      await onUpload(newFiles)
    } catch (error) {
      // Handle upload error
      uploadFiles.forEach((uploadFile) => {
        setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error" as const } : f)))
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    onRemove?.(fileId)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">{uploadText}</h3>
        <p className="text-gray-600 mb-4">{dragText}</p>
        <p className="text-sm text-gray-500">
          Max file size: {maxSize}MB • Max files: {maxFiles} • Accepted: {accept}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700">Uploaded Files ({files.length})</h4>
          {files.map((uploadFile) => {
            const FileIcon = getFileIcon(uploadFile.file)
            return (
              <div
                key={uploadFile.id}
                className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {showPreview && uploadFile.preview ? (
                    <img
                      src={uploadFile.preview || "/placeholder.svg"}
                      alt={uploadFile.file.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                      <FileIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{uploadFile.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(uploadFile.file.size)}</p>

                  {/* Progress Bar */}
                  {uploadFile.status === "uploading" && (
                    <div className="mt-2">
                      <Progress value={uploadFile.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{Math.round(uploadFile.progress)}% uploaded</p>
                    </div>
                  )}

                  {/* Status */}
                  {uploadFile.status === "completed" && (
                    <p className="text-xs text-green-600 mt-1">✓ Upload completed</p>
                  )}
                  {uploadFile.status === "error" && <p className="text-xs text-red-600 mt-1">✗ Upload failed</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {uploadFile.status === "completed" && uploadFile.url && (
                    <>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={uploadFile.url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={uploadFile.url} download={uploadFile.file.name}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
