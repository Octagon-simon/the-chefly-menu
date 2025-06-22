import { useState, useEffect } from "react"
import { database } from "../lib/firebase"
import { ref, onValue } from "firebase/database"

export type MenuItem = {
  id: string
  name: string
  price: number
  description: string
  image: string
}

const useMenu = () => {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Exit early if database is still undefined (should never be on the client, but
    // keeps TypeScript happy and prevents ‘t is undefined’)
    if (!database) return

    const menuRef = ref(database, "menu")
    const unsubscribe = onValue(menuRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const menuItems: MenuItem[] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          setMenu(menuItems)
          setLoading(false)
        } else {
          setMenu([])
          setLoading(false)
        }
      } catch (e: any) {
        setError(e.message)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { menu, loading, error }
}

export default useMenu
