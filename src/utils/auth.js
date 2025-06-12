import { Amplify } from 'aws-amplify'
import {
    signUp,
    signIn,
    signOut,
    confirmSignUp,
    getCurrentUser,
    fetchAuthSession
} from 'aws-amplify/auth'

// Configure Amplify
const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
            identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
            region: import.meta.env.VITE_AWS_REGION || 'us-east-2',
            signUpVerificationMethod: 'code'
        }
    }
}

Amplify.configure(amplifyConfig)

// Auth utility functions
export const authService = {
    // Sign up new user
    async signUp(username, password, email, name) {
        try {
            const result = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email,
                        name
                    }
                }
            })
            return { success: true, data: result }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Confirm sign up with verification code
    async confirmSignUp(username, code) {
        try {
            await confirmSignUp({
                username,
                confirmationCode: code
            })
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Sign in user
    async signIn(username, password) {
        try {
            const result = await signIn({
                username,
                password
            })
            return { success: true, data: result }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Sign out user
    async signOut() {
        try {
            await signOut()
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Get current authenticated user
    async getCurrentUser() {
        try {
            const user = await getCurrentUser()
            return { success: true, user }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Get auth session with tokens
    async getAuthSession() {
        try {
            const session = await fetchAuthSession()
            return { success: true, session }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}
