import React from 'react'

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="error">
            <div className="error-content">
                <h3>Oops! Something went wrong</h3>
                <p>{message}</p>
                {onRetry && (
                    <button className="btn btn-secondary" onClick={onRetry}>
                        Try Again
                    </button>
                )}
            </div>
        </div>
    )
}

export default ErrorMessage
