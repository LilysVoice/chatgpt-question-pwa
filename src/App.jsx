import React, { useState } from 'react'
import QuestionForm from './components/QuestionForm'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import { useApi } from './hooks/useApi'

function App() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const { loading, error, askQuestion } = useApi()

    const handleSubmit = async (questionText) => {
        setQuestion(questionText)
        setAnswer('')

        try {
            const response = await askQuestion(questionText)
            setAnswer(response.answer)
        } catch (err) {
            console.error('Failed to get answer:', err)
        }
    }

    const handleReset = () => {
        setQuestion('')
        setAnswer('')
    }

    return (
        <div className="app">
            <div className="container">
                <header className="header">
                    <h1 className="title">💭 What would you like to know today?</h1>
                    <p className="subtitle">Ask any question and get an instant answer</p>
                </header>

                <main className="main">
                    {!question && !loading && (
                        <QuestionForm onSubmit={handleSubmit} disabled={loading} />
                    )}

                    {loading && <LoadingSpinner />}

                    {error && (
                        <ErrorMessage
                            message={error}
                            onRetry={() => question && handleSubmit(question)}
                        />
                    )}

                    {answer && !loading && (
                        <div className="result">
                            <div className="question-display">
                                <h3>Your Question:</h3>
                                <p>"{question}"</p>
                            </div>

                            <div className="answer-display">
                                <h3>Answer:</h3>
                                <div className="answer-text">{answer}</div>
                            </div>

                            <button
                                className="btn btn-secondary"
                                onClick={handleReset}
                            >
                                Ask Another Question
                            </button>
                        </div>
                    )}
                </main>

                <footer className="footer">
                    <p>Powered by ChatGPT & AWS Lambda</p>
                </footer>
            </div>
        </div>
    )
}

export default App
