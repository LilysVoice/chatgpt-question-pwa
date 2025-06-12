import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../utils/auth'

const AuthContext = createContext()

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuthState()
    }, [])

    const checkAuthState = async () => {
        try {
            const result = await authService.getCurrentUser()
            if (result.success) {
                setUser(result.user)
                setIsAuthenticated(true)
            } else {
                setUser(null)
                setIsAuthenticated(false)
            }
        } catch (error) {
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (username, password, email, name) => {
        const result = await authService.signUp(username, password, email, name)
        return result
    }

    const confirmSignUp = async (username, code) => {
        const result = await authService.confirmSignUp(username, code)
        if (result.success) {
            // Optionally auto-sign in after confirmation
            return result
        }
        return result
    }

    const signIn = async (username, password) => {
        const result = await authService.signIn(username, password)
        if (result.success) {
            await checkAuthState() // Refresh user state
        }
        return result
    }

    const signOut = async () => {
        const result = await authService.signOut()
        if (result.success) {
            setUser(null)
            setIsAuthenticated(false)
        }
        return result
    }

    const value = {
        user,
        isAuthenticated,
        loading,
        signUp,
        confirmSignUp,
        signIn,
        signOut,
        checkAuthState
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
