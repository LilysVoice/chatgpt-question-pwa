import React from 'react'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from './auth/AuthLayout'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth()

    console.log('🛡️ ProtectedRoute check:', { isAuthenticated, loading, hasUser: !!user })

    // Always show loading first while checking auth
    if (loading) {
        console.log('⏳ Still checking authentication...')
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <LoadingSpinner />
            </div>
        )
    }

    // If not authenticated, FORCE authentication
    if (!isAuthenticated) {
        console.log('❌ User not authenticated, showing auth screen')
        return <AuthLayout />
    }

    // Only show main app if authenticated
    console.log('✅ User authenticated, showing main app')
    return children
}

export default ProtectedRoute
