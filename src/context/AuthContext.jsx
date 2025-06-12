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
    const [loading, setLoading] = useState(true) // Start with loading true
    const [isAuthenticated, setIsAuthenticated] = useState(false) // Start with false
    const [authStep, setAuthStep] = useState('login')

    // Check authentication status on mount
    useEffect(() => {
        checkAuthState()
    }, [])

    const checkAuthState = async () => {
        console.log('🔍 Checking authentication state...')
        setLoading(true)

        try {
            // Check if we have Cognito configuration
            const hasConfig = import.meta.env.VITE_COGNITO_USER_POOL_ID &&
                import.meta.env.VITE_COGNITO_CLIENT_ID

            if (!hasConfig) {
                console.log('❌ Cognito not configured, user not authenticated')
                setUser(null)
                setIsAuthenticated(false)
                setAuthStep('login')
                setLoading(false)
                return
            }

            // Try to get current user from Cognito
            const result = await authService.getCurrentUser()
            if (result.success && result.user) {
                console.log('✅ User is authenticated:', result.user.username)
                setUser(result.user)
                setIsAuthenticated(true)
                setAuthStep('authenticated')
            } else {
                console.log('❌ No authenticated user found')
                setUser(null)
                setIsAuthenticated(false)
                setAuthStep('login')
            }
        } catch (error) {
            console.log('❌ Auth check error:', error)
            setUser(null)
            setIsAuthenticated(false)
            setAuthStep('login')
        } finally {
            setLoading(false)
            console.log('🔍 Auth check complete')
        }
    }

    const signUp = async (username, password, email, name) => {
        console.log('📝 Attempting sign up for:', username)
        setLoading(true)

        try {
            const result = await authService.signUp(username, password, email, name)
            if (result.success) {
                console.log('✅ Sign up successful, need to confirm email')
                setAuthStep('confirm')
                return result
            } else {
                console.log('❌ Sign up failed:', result.error)
                return result
            }
        } catch (error) {
            console.log('❌ Sign up error:', error)
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const confirmSignUp = async (username, code) => {
        console.log('📧 Confirming sign up for:', username)
        setLoading(true)

        try {
            const result = await authService.confirmSignUp(username, code)
            if (result.success) {
                console.log('✅ Email confirmed successfully')
                setAuthStep('login')
                return result
            } else {
                console.log('❌ Email confirmation failed:', result.error)
                return result
            }
        } catch (error) {
            console.log('❌ Confirm error:', error)
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const signIn = async (username, password) => {
        console.log('🔑 Attempting sign in for:', username)
        setLoading(true)

        try {
            const result = await authService.signIn(username, password)
            if (result.success) {
                console.log('✅ Sign in successful')
                // Re-check auth state to get user info
                await checkAuthState()
                return result
            } else {
                console.log('❌ Sign in failed:', result.error)
                return result
            }
        } catch (error) {
            console.log('❌ Sign in error:', error)
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        console.log('🚪 Signing out user')
        setLoading(true)

        try {
            const result = await authService.signOut()
            if (result.success) {
                console.log('✅ Sign out successful')
                setUser(null)
                setIsAuthenticated(false)
                setAuthStep('login')
                return result
            } else {
                console.log('❌ Sign out failed:', result.error)
                return result
            }
        } catch (error) {
            console.log('❌ Sign out error:', error)
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const value = {
        user,
        isAuthenticated,
        loading,
        authStep,
        signUp,
        confirmSignUp,
        signIn,
        signOut,
        checkAuthState,
        setAuthStep
    }

    // Debug logging
    console.log('🔐 AuthContext state:', {
        isAuthenticated,
        loading,
        authStep,
        hasUser: !!user
    })

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
