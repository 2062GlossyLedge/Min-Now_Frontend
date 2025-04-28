'use client'

import { useState, useEffect } from 'react'
import ItemCard from '../../components/ItemCard'
import FilterBar from '../../components/FilterBar'
import CheckupManager from '../../components/CheckupManager'

interface Item {
    id: string
    name: string
    pictureUrl: string
    itemType: string
    status: string
    ownershipDuration: string
    lastUsedDuration: string
}

export default function GiveView() {
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [showCheckupManager, setShowCheckupManager] = useState(false)
    const [selectedType, setSelectedType] = useState<string | null>(null)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('/api/items?status=Give')
                const data = await response.json()
                setItems(data)
            } catch (error) {
                console.error('Error fetching items:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [])

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                setItems(items.filter((item) => item.id !== id))
            }
        } catch (error) {
            console.error('Error updating item status:', error)
        }
    }

    const handleFilterChange = (type: string | null) => {
        setSelectedType(type)
    }

    const filteredItems = selectedType
        ? items.filter((item) => item.itemType === selectedType)
        : items

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Items to Give Away</h1>
                <button
                    onClick={() => setShowCheckupManager(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Set Checkup
                </button>
            </div>

            <FilterBar onFilterChange={handleFilterChange} />

            {filteredItems.length === 0 ? (
                <p className="text-gray-500">No items to give away at the moment.</p>
            ) : (
                <div className="space-y-4">
                    {filteredItems.map((item) => (
                        <ItemCard
                            key={item.id}
                            {...item}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            {showCheckupManager && (
                <CheckupManager
                    checkupType="Give"
                    onClose={() => setShowCheckupManager(false)}
                />
            )}
        </div>
    )
} 