import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

const LoginForm = ({ onSwitchToSignUp }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { signIn } = useAuth()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await signIn(formData.username, formData.password)
            if (!result.success) {
                setError(result.error || 'Failed to sign in')
            }
            // Success is handled by AuthContext
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label htmlFor="username">Email</label>
                <input
                    type="email"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                />
            </div>

            {error && <ErrorMessage message={error} />}

            <button type="submit" className="btn btn-primary" disabled={loading}>
                Sign In
            </button>

            <div className="auth-footer">
                <p>
                    Don't have an account?{' '}
                    <button type="button" className="link-button" onClick={onSwitchToSignUp}>
                        Sign up
                    </button>
                </p>
            </div>
        </form>
    )
}

export default LoginForm
