import { useState } from 'react'
import { callChatGPTAPI } from '../utils/api'

export const useApi = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const askQuestion = async (question) => {
        setLoading(true)
        setError(null)

        try {
            const response = await callChatGPTAPI(question)
            return response
        } catch (err) {
            const errorMessage = err.message || 'Failed to get answer. Please try again.'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, askQuestion }
}
