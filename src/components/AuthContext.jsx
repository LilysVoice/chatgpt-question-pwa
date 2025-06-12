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
    const [isNewUser, setIsNewUser] = useState(false)
    const [authStep, setAuthStep] = useState('login') // 'login', 'signup', 'confirm', 'authenticated'

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuthState()
    }, [])

    const checkAuthState = async () => {
        setLoading(true)
        try {
            const result = await authService.getCurrentUser()
            if (result.success) {
                setUser(result.user)
                setIsAuthenticated(true)
                setAuthStep('authenticated')

                // Check if this is their first time (you could store this in user attributes)
                const isFirstTime = result.user.attributes?.['custom:first_login'] !== 'false'
                setIsNewUser(isFirstTime)
            } else {
                setUser(null)
                setIsAuthenticated(false)
                setAuthStep('login')
            }
        } catch (error) {
            setUser(null)
            setIsAuthenticated(false)
            setAuthStep('login')
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (username, password, email, name) => {
        setLoading(true)
        try {
            const result = await authService.signUp(username, password, email, name)
            if (result.success) {
                setAuthStep('confirm')
                setIsNewUser(true)
            }
            return result
        } finally {
            setLoading(false)
        }
    }

    const confirmSignUp = async (username, code) => {
        setLoading(true)
        try {
            const result = await authService.confirmSignUp(username, code)
            if (result.success) {
                setAuthStep('login')
                setIsNewUser(true)
            }
            return result
        } finally {
            setLoading(false)
        }
    }

    const signIn = async (username, password) => {
        setLoading(true)
        try {
            const result = await authService.signIn(username, password)
            if (result.success) {
                await checkAuthState() // This will set authenticated state

                // Mark user as having completed first login
                try {
                    await authService.updateUserAttributes({
                        'custom:first_login': 'false'
                    })
                } catch (attrError) {
                    console.log('Could not update user attributes:', attrError)
                }
            }
            return result
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        const result = await authService.signOut()
        if (result.success) {
            setUser(null)
            setIsAuthenticated(false)
            setIsNewUser(false)
            setAuthStep('login')
        }
        return result
    }

    const value = {
        user,
        isAuthenticated,
        isNewUser,
        loading,
        authStep,
        signUp,
        confirmSignUp,
        signIn,
        signOut,
        checkAuthState,
        setAuthStep
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
