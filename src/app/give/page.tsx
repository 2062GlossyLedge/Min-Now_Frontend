'use client'

import { useState, useEffect } from 'react'
import ItemCard from '../../components/ItemCard'
import FilterBar from '../../components/FilterBar'
import CheckupManager from '../../components/CheckupManager'
import { updateItem, deleteItem, fetchItemsByStatus } from '@/utils/api'
import { Item } from '@/types/item'
import { useCheckupStatus } from '@/hooks/useCheckupStatus'

export default function GiveView() {
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [showCheckupManager, setShowCheckupManager] = useState(false)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [csrfToken, setCsrfToken] = useState('')
    const isCheckupDue = useCheckupStatus('give')

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
                const { data, error } = await fetchItemsByStatus('Give')
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

    const handleStatusChange = async (id: string, newStatus: string) => {
        const { data: updatedItem, error } = await updateItem(id, { status: newStatus })

        if (error) {
            console.error(error)
            return
        }

        if (updatedItem) {
            // Remove the item from the current view if its status has changed
            if (updatedItem.status !== 'Give') {
                setItems(items.filter((item) => item.id !== id))
            }
        }
    }

    const handleFilterChange = (type: string | null) => {
        setSelectedType(type)
    }

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
                    className="p-2 text-gray-900 dark:text-white hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isCheckupDue && (
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
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

            {showCheckupManager && (
                <CheckupManager
                    checkupType="Give"
                    onClose={() => setShowCheckupManager(false)}
                />
            )}
        </div>
    )
} 