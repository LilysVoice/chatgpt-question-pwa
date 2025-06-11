const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
    console.warn('VITE_API_URL environment variable not set')
}

export const callChatGPTAPI = async (question) => {
    if (!API_URL) {
        throw new Error('API URL not configured')
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
        throw new Error(data.error)
    }

    return data
}
