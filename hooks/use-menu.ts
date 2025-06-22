"use client"

import { useState, useEffect } from "react"
import { ref, onValue, push, update, remove } from "firebase/database"
import { database } from "../lib/firebase"
import type { MenuItem } from "../types/menu"

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const menuRef = ref(database, "menu")

    const unsubscribe = onValue(menuRef, (snapshot) => {
      try {
        const data = snapshot.val()
        if (data) {
          const items: MenuItem[] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          setMenuItems(items)
        } else {
          setMenuItems([])
        }
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch menu items")
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const addMenuItem = async (item: Omit<MenuItem, "id">) => {
    try {
      const menuRef = ref(database, "menu")
      await push(menuRef, item)
      return { success: true }
    } catch (err) {
      return { success: false, error: "Failed to add menu item" }
    }
  }

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const itemRef = ref(database, `menu/${id}`)
      await update(itemRef, updates)
      return { success: true }
    } catch (err) {
      return { success: false, error: "Failed to update menu item" }
    }
  }

  const deleteMenuItem = async (id: string) => {
    try {
      const itemRef = ref(database, `menu/${id}`)
      await remove(itemRef)
      return { success: true }
    } catch (err) {
      return { success: false, error: "Failed to delete menu item" }
    }
  }

  return {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  }
}
