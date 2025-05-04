'use client'

import { useState, useEffect } from 'react'
import ItemCard from '../../components/ItemCard'
import { updateItem, deleteItem, fetchItemsByStatus } from '@/utils/api'
import { Item } from '@/types/item'

export default function DonatedView() {
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [csrfToken, setCsrfToken] = useState('')

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/csrf-token`, {
                    credentials: 'include',
                })
                if (response.ok) {
                    const data = await response.json()
                    setCsrfToken(data.token)
                }
            } catch (error) {
                console.error('Error fetching CSRF token:', error)
            }
        }

        fetchCsrfToken()
    }, [])

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data, error } = await fetchItemsByStatus('Donate')
                if (error) {
                    console.error(error)
                    setItems([])
                } else {
                    setItems(data || [])
                }
            } catch (error) {
                console.error('Error fetching items:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [])

    const handleEdit = async (id: string, updates: { name?: string, ownershipDate?: Date, lastUsedDate?: Date }) => {
        const { data: updatedItem, error } = await updateItem(id, updates)

        if (error) {
            console.error(error)
            return
        }

        if (updatedItem) {
            // Update the item in place while maintaining the list order
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, ...updatedItem } : item
                )
            )
        }
    }

    const handleDelete = async (id: string) => {
        const { error } = await deleteItem(id)

        if (error) {
            console.error(error)
            return
        }

        setItems(prevItems => prevItems.filter(item => item.id !== id))
    }

    const handleStatusChange = (id: string, newStatus: string) => {
        console.log('Changing status for item:', id, 'to:', newStatus);
        // TODO: Implement API call to update status
    }

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
                            id={item.id}
                            name={item.name}
                            pictureUrl={item.pictureUrl}
                            itemType={item.itemType}
                            status={item.status}
                            ownershipDuration={item.ownershipDuration}
                            lastUsedDuration={item.lastUsedDuration}
                            onStatusChange={handleStatusChange}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
} 