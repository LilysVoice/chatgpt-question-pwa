import React from 'react'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from './auth/AuthLayout'
import WelcomeScreen from './WelcomeScreen'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isNewUser, loading, authStep } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    // Not authenticated - show login/signup
    if (!isAuthenticated) {
        return <AuthLayout />
    }

    // Authenticated but new user - show welcome screen first
    if (isAuthenticated && isNewUser) {
        return <WelcomeScreen />
    }

    // Fully authenticated and not new - show main app
    return children
}

export default ProtectedRoute
