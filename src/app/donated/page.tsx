'use client'

import { useState, useEffect } from 'react'
import ItemCard from '../../components/ItemCard'

interface Item {
    id: string
    name: string
    pictureUrl: string
    itemType: string
    status: string
    ownershipDuration: string
    lastUsedDuration: string
}

export default function DonatedView() {
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('/api/items?status=Donate')
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Donated Items</h1>
            {items.length === 0 ? (
                <p className="text-gray-500">No donated items at the moment.</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <ItemCard
                            key={item.id}
                            {...item}
                        />
                    ))}
                </div>
            )}
        </div>
    )
} 