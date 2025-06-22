"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import type { Toast } from "@/hooks/use-toast"

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export const ToastComponent = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[toast.type]

  return (
    <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 mb-2`}>
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={onRemove} />
      ))}
    </div>
  )
}
