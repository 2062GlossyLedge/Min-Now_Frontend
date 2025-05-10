import { Item } from '@/types/item'

interface ApiResponse<T> {
    data?: T
    error?: string
}
// Add these interfaces at the top with other interfaces
interface Checkup {
    id: number;
    last_checkup_date: string;
    checkup_interval_months: number;
    is_checkup_due: boolean;
}

interface CheckupCreate {
    interval_months: number;
    checkup_type: string;
}

// utility csrf fetching for put, post, delete reqs
export const fetchWithCsrf = async (url: string, options: RequestInit = {}) => {
    // First, ensure we have a CSRF token
    try {
        const csrfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/csrf-token`, {
            credentials: 'include',
        })
        if (!csrfResponse.ok) {
            throw new Error('Failed to get CSRF token')
        }
        const { token } = await csrfResponse.json()
        const csrfToken = token.token
        console.log('CSRF Token:', token)

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
            const errorText = await response.text()
            console.error('Response not OK:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: errorText
            })
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        }

        return response
    } catch (error) {
        console.error('Fetch error:', {
            error,
            url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
            options: {
                ...options,
                headers: options.headers,
            }
        })
        throw error
    }
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
        console.log('Fetching items with status:', status)
        const response = await fetchWithCsrf(`/api/items?status=${status}`)
        const data = await response.json()
        console.log('Received items data:', data)

        // Map backend fields to frontend interface
        const itemsWithDuration = data.map((item: any) => ({
            ...item,
            itemType: item.item_type, // Map item_type to itemType
            ownershipDuration: item.ownership_duration?.description || 'Not specified'
        }))

        return { data: itemsWithDuration }
    } catch (error: any) {
        console.error('Error fetching items:', {
            error,
            message: error.message,
            stack: error.stack,
            response: error.response
        })
        return { error: error.message || 'Failed to fetch items' }
    }
}

export const fetchCheckup = async (type: string): Promise<ApiResponse<Checkup>> => {
    try {
        const response = await fetchWithCsrf(`/api/checkups?type=${type.toLowerCase()}`)
        const data = await response.json()
        return { data }
    } catch (error) {
        console.error('Error fetching checkup:', error)
        return { error: 'Failed to fetch checkup' }
    }
}

export const createCheckup = async (checkupData: CheckupCreate): Promise<ApiResponse<Checkup>> => {
    try {
        const response = await fetchWithCsrf('/api/checkups', {
            method: 'POST',
            body: JSON.stringify(checkupData),
        })
        const data = await response.json()
        return { data }
    } catch (error) {
        console.error('Error creating checkup:', error)
        return { error: 'Failed to create checkup' }
    }
}

export const completeCheckup = async (checkupId: number): Promise<ApiResponse<Checkup>> => {
    try {
        const response = await fetchWithCsrf(`/api/checkups/${checkupId}/complete`, {
            method: 'POST',
        })
        const data = await response.json()
        return { data }
    } catch (error) {
        console.error('Error completing checkup:', error)
        return { error: 'Failed to complete checkup' }
    }
}
