import { useState, useEffect } from 'react'
import { fetchCheckup } from '@/utils/api'

export const useCheckupStatus = (type: 'keep' | 'give') => {
    const [isCheckupDue, setIsCheckupDue] = useState(false)

    useEffect(() => {
        const checkCheckupStatus = async () => {
            try {
                const { data, error } = await fetchCheckup(type)
                console.log(`Checkup status for ${type}:`, data)
                if (data && Array.isArray(data) && data.length > 0) {
                    // Get the most recent checkup
                    const mostRecentCheckup = data[0]
                    setIsCheckupDue(mostRecentCheckup.is_checkup_due)
                }
            } catch (error) {
                console.error('Error checking checkup status:', error)
            }
        }
        checkCheckupStatus()
    }, [type])

    return isCheckupDue
} 