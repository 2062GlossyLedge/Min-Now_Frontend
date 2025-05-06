import { Item } from '@/types/item'

interface ApiResponse<T> {
    data?: T
    error?: string
}

export const fetchWithCsrf = async (url: string, options: RequestInit = {}) => {
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || ''

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
}

export const updateItem = async (id: string, updates: {
    name?: string,
    ownershipDate?: Date,
    lastUsedDate?: Date,
    status?: string
}): Promise<ApiResponse<Item>> => {
    try {
        const response = await fetchWithCsrf(`/api/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: updates.name,
                item_received_date: updates.ownershipDate?.toISOString(),
                last_used: updates.lastUsedDate?.toISOString(),
                status: updates.status,
            }),
        })
        const data = await response.json()
        return { data }
    } catch (error) {
        console.error('Error updating item:', error)
        return { error: 'Failed to update item' }
    }
}

export const deleteItem = async (id: string): Promise<ApiResponse<void>> => {
    try {
        await fetchWithCsrf(`/api/items/${id}`, {
            method: 'DELETE',
        })
        return {}
    } catch (error) {
        console.error('Error deleting item:', error)
        return { error: 'Failed to delete item' }
    }
}

export const fetchItemsByStatus = async (status: string): Promise<ApiResponse<Item[]>> => {
    try {
        const response = await fetchWithCsrf(`/api/items?status=${status}`)
        const data = await response.json()
        return { data }
    } catch (error) {
        console.error('Error fetching items:', error)
        return { error: 'Failed to fetch items' }
    }
} 