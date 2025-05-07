'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Item } from '@/types/item'
import { CheckCircle2 } from 'lucide-react'
import { fetchWithCsrf, updateItem } from '@/utils/api'

interface CheckupManagerProps {
    checkupType: 'Keep' | 'Give'
    onClose: () => void
}

export default function CheckupManager({ checkupType, onClose }: CheckupManagerProps) {
    const router = useRouter()
    const [interval, setInterval] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [changedItems, setChangedItems] = useState<Set<string>>(new Set())

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetchWithCsrf(`/api/items?status=${checkupType}`)
                const data = await response.json()
                setItems(data)
            } catch (error) {
                console.error('Error fetching items:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchItems()
    }, [checkupType])

    const handleStatusChange = async (itemId: string, newStatus: string) => {
        try {
            const { data: updatedItem, error } = await updateItem(itemId, { status: newStatus })

            if (error) {
                console.error('Error updating item status:', error)
                return
            }

            if (updatedItem) {
                setItems(items.filter(item => item.id !== itemId))
                setChangedItems(prev => new Set([...prev, itemId]))
            }
        } catch (error) {
            console.error('Error updating item status:', error)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        try {
            const formattedCheckupType = checkupType.charAt(0).toUpperCase() + checkupType.slice(1).toLowerCase()

            const response = await fetchWithCsrf('/api/checkups', {
                method: 'POST',
                body: JSON.stringify({
                    checkup_type: formattedCheckupType,
                    interval_months: interval
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Error submitting checkup:', errorData)
                throw new Error('Failed to submit checkup')
            }

            setShowConfirmation(true)
            setTimeout(() => {
                router.refresh()
                onClose()
            }, 1500)
        } catch (error) {
            console.error('Error setting checkup:', error)
            setIsSubmitting(false)
        }
    }

    if (showConfirmation) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="w-16 h-16 text-teal-500 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Checkup Complete!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your {checkupType.toLowerCase()} items have been reviewed.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {checkupType} Items Checkup
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Checkup Interval (months)
                        </label>
                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() => setInterval(Math.max(1, interval - 1))}
                                className="px-3 py-1 border border-teal-300 dark:border-teal-600 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300"
                            >
                                -
                            </button>
                            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{interval}</span>
                            <button
                                type="button"
                                onClick={() => setInterval(Math.min(12, interval + 1))}
                                className="px-3 py-1 border border-teal-300 dark:border-teal-600 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                            Review Items
                        </h3>

                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                            </div>
                        ) : items.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                No items to review
                            </p>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            {item.pictureUrl && (
                                                <img
                                                    src={item.pictureUrl}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.itemType}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'Keep')}
                                                className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${changedItems.has(item.id)
                                                    ? 'bg-teal-50 dark:bg-teal-800 text-teal-600 dark:text-teal-300'
                                                    : 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800'
                                                    }`}
                                            >
                                                Keep
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'Give')}
                                                className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${changedItems.has(item.id)
                                                    ? 'bg-teal-50 dark:bg-teal-800 text-teal-600 dark:text-teal-300'
                                                    : 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800'
                                                    }`}
                                            >
                                                Give
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || items.length === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Complete Checkup'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 