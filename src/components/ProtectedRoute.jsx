import React from 'react'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from './auth/AuthLayout'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return <AuthLayout />
    }

    return children
}

export default ProtectedRoute
