import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

const SignUpForm = ({ onSignUpSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { signUp } = useAuth()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return false
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await signUp(
                formData.email,
                formData.password,
                formData.email,
                formData.name
            )

            if (result.success) {
                onSignUpSuccess(formData.email)
            } else {
                setError(result.error)
            }
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
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
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
                    minLength="8"
                />
                <small>Must be at least 8 characters with uppercase, lowercase, number, and symbol</small>
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                />
            </div>

            {error && <ErrorMessage message={error} />}

            <button type="submit" className="btn btn-primary" disabled={loading}>
                Sign Up
            </button>

            <div className="auth-footer">
                <p>
                    Already have an account?{' '}
                    <button type="button" className="link-button" onClick={onSwitchToLogin}>
                        Sign in
                    </button>
                </p>
            </div>
        </form>
    )
}

export default SignUpForm
