"use client"

import type * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full h-full",
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: CustomModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={closeOnOverlayClick ? onClose : undefined}>
      <DialogContent
        className={cn(sizeClasses[size], className)}
        onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-gray-600 dark:text-gray-400">{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="flex-1 overflow-auto py-4">{children}</div>

        {footer && <DialogFooter className="border-t pt-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

// Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={loading}>
            {loading ? "Loading..." : confirmText}
          </Button>
        </div>
      }
    >
      <div className="py-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CustomModal>
  )
}
