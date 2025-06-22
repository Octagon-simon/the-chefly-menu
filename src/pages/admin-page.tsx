import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useMenu } from "@/hooks/use-menu"
import { useToast } from "@/hooks/use-toast"
import { AdminLogin } from "@/components/admin-login"
import { MenuItemForm } from "@/components/menu-item-form"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ToastContainer } from "@/components/toast"
import type { MenuItem } from "@/types/menu"
import { Plus, Edit, Trash2, LogOut, MenuIcon } from "lucide-react"

export const AdminPage = () => {
  const { user, loading: authLoading, logout } = useAuth()
  const { menuItems, loading: menuLoading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu()
  const { toasts, showToast, removeToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  if (authLoading) return <LoadingSpinner />
  if (!user) return <AdminLogin />

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))]
  const filteredItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const handleAddItem = async (item: Omit<MenuItem, "id">) => {
    const result = await addMenuItem(item)
    if (result.success) {
      showToast("Menu item added successfully!", "success")
      setShowForm(false)
    } else {
      showToast(result.error || "Failed to add item", "error")
    }
    return result
  }

  const handleUpdateItem = async (item: Omit<MenuItem, "id">) => {
    if (!editingItem) return { success: false, error: "No item selected" }

    const result = await updateMenuItem(editingItem.id, item)
    if (result.success) {
      showToast("Menu item updated successfully!", "success")
      setEditingItem(null)
    } else {
      showToast(result.error || "Failed to update item", "error")
    }
    return result
  }

  const handleDeleteItem = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const result = await deleteMenuItem(id)
      if (result.success) {
        showToast("Menu item deleted successfully!", "success")
      } else {
        showToast(result.error || "Failed to delete item", "error")
      }
    }
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      showToast("Logged out successfully", "success")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MenuIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
                {category !== "All" && ` (${menuItems.filter((item) => item.category === category).length})`}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>

        {/* Menu Items */}
        {menuLoading ? (
          <LoadingSpinner />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">
              {selectedCategory === "All" ? "Add your first menu item" : "No items in this category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 w-full">
                  <img
                    src={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.name}</h3>
                  {item.description && <p className="text-gray-600 text-sm mb-3">{item.description}</p>}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-green-600">₦{item.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forms */}
      {showForm && <MenuItemForm onSubmit={handleAddItem} onCancel={() => setShowForm(false)} />}

      {editingItem && (
        <MenuItemForm item={editingItem} onSubmit={handleUpdateItem} onCancel={() => setEditingItem(null)} />
      )}
    </div>
  )
}
