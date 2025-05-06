'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface AddItemFormProps {
    onClose: () => void
}

export default function AddItemForm({ onClose }: AddItemFormProps) {
    const router = useRouter()
    const [name, setName] = useState('')
    const [pictureEmoji, setPictureEmoji] = useState('')
    const [itemType, setItemType] = useState('Clothing')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [csrfToken, setCsrfToken] = useState('')
    const [receivedDate, setReceivedDate] = useState<Date | undefined>(new Date())

    const itemTypes = [
        'Clothing',
        'Technology',
        'Household Item',
        'Vehicle',
        'Other'
    ]

    useEffect(() => {
        // Fetch CSRF token from backend endpoint
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/csrf-token`, {
                    credentials: 'include',
                })
                if (response.ok) {
                    const data = await response.json()
                    console.log('CSRF Token:', data)
                    setCsrfToken(data.token)
                    console.log('CSRF Token:', csrfToken)
                } else {
                    console.error('Failed to fetch CSRF token')
                }
            } catch (error) {
                console.error('Error fetching CSRF token:', error)
            }
        }

        fetchCsrfToken()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    picture_url: pictureEmoji,
                    item_type: itemType,
                    status: 'Keep',
                    item_received_date: receivedDate?.toISOString()
                }),
            })

            if (response.ok) {
                router.refresh()
                onClose()
            } else {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error('Error adding item:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Add New Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Emoji</label>
                        <input
                            type="text"
                            value={pictureEmoji}
                            onChange={(e) => setPictureEmoji(e.target.value.slice(0, 1))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Type</label>
                        <select
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
                        >
                            {itemTypes.map((type) => (
                                <option key={type} value={type} className="py-2">
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Received</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal mt-1 focus:border-teal-500 focus:ring-teal-500"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {receivedDate ? format(receivedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800" align="start">
                                <Calendar
                                    mode="single"
                                    selected={receivedDate}
                                    onSelect={setReceivedDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name || !pictureEmoji}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 