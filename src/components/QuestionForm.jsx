import React, { useState } from 'react'

const QuestionForm = ({ onSubmit, disabled }) => {
    const [inputValue, setInputValue] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (inputValue.trim() && !disabled) {
            onSubmit(inputValue.trim())
        }
    }

    return (
        <form onSubmit={handleSubmit} className="question-form">
            <div className="input-group">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question here..."
                    className="question-input"
                    rows="4"
                    disabled={disabled}
                    maxLength="500"
                />
                <div className="char-count">
                    {inputValue.length}/500
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={!inputValue.trim() || disabled}
            >
                Get Answer
            </button>
        </form>
    )
}

export default QuestionForm
