import type { MenuItem } from "@/types/menu"

interface MenuItemCardProps {
  item: MenuItem
}

export const MenuItemCard = ({ item }: MenuItemCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">₦{item.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
        </div>
      </div>
    </div>
  )
}
