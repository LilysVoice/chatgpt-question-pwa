import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

const WelcomeScreen = () => {
    const { user, signOut } = useAuth()
    const [isGettingStarted, setIsGettingStarted] = useState(false)

    const handleGetStarted = () => {
        setIsGettingStarted(true)
        // Simulate a brief loading state for better UX
        setTimeout(() => {
            // Mark user as no longer new (this could also be done via API)
            window.location.reload() // Simple refresh to update auth state
        }, 1000)
    }

    const handleSignOut = async () => {
        await signOut()
    }

    if (isGettingStarted) {
        return <LoadingSpinner />
    }

    return (
        <div className="welcome-container">
            <div className="welcome-card">
                <div className="welcome-header">
                    <h1>🎉 Welcome to ChatGPT Question App!</h1>
                    <p>Hi <strong>{user?.attributes?.name || user?.username}</strong>!</p>
                </div>

                <div className="welcome-content">
                    <div className="welcome-message">
                        <h2>Thank you for creating your account!</h2>
                        <p>
                            You now have access to our AI-powered question answering service.
                            Ask any question and get instant, intelligent responses powered by ChatGPT.
                        </p>
                    </div>

                    <div className="welcome-features">
                        <h3>What you can do:</h3>
                        <ul>
                            <li>✨ Ask any question and get AI-powered answers</li>
                            <li>📱 Use the app on any device - it's mobile optimized</li>
                            <li>🔒 Your conversations are secure and private</li>
                            <li>⚡ Get instant responses powered by ChatGPT</li>
                            <li>💾 Install this app on your device for easy access</li>
                        </ul>
                    </div>

                    <div className="welcome-actions">
                        <button
                            className="btn btn-primary btn-large"
                            onClick={handleGetStarted}
                        >
                            Start Asking Questions! 🚀
                        </button>

                        <button
                            className="btn btn-secondary btn-small"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="welcome-footer">
                    <p>Ready to explore the power of AI? Let's get started!</p>
                </div>
            </div>
        </div>
    )
}

export default WelcomeScreen
