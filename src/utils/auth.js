// Fixed auth service with static imports for GitHub Pages deployment
import { Amplify } from 'aws-amplify'
import { getCurrentUser, signUp, confirmSignUp, signIn, signOut, resendSignUpCode } from 'aws-amplify/auth'

let isConfigured = false
let currentUser = null

// Debug: Check environment variables
console.log('🔍 Environment variables check:')
console.log('VITE_COGNITO_USER_POOL_ID:', import.meta.env.VITE_COGNITO_USER_POOL_ID)
console.log('VITE_COGNITO_CLIENT_ID:', import.meta.env.VITE_COGNITO_CLIENT_ID)
console.log('VITE_COGNITO_IDENTITY_POOL_ID:', import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID)
console.log('VITE_AWS_REGION:', import.meta.env.VITE_AWS_REGION)

// Check if Cognito is configured and configure Amplify
const initializeCognito = async () => {
    const hasConfig = import.meta.env.VITE_COGNITO_USER_POOL_ID &&
        import.meta.env.VITE_COGNITO_CLIENT_ID

    if (hasConfig && !isConfigured) {
        console.log('🔧 Configuring Cognito...')

        try {
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
            isConfigured = true
            console.log('✅ Cognito configured successfully')
            console.log('🔧 Config details:', {
                userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
                clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
                region: import.meta.env.VITE_AWS_REGION
            })
        } catch (error) {
            console.log('❌ Failed to configure Cognito:', error)
            throw error
        }
    }

    return hasConfig
}

export const authService = {
    // Get current user
    async getCurrentUser() {
        console.log('🔍 Getting current user...')

        const hasConfig = await initializeCognito()

        if (!hasConfig) {
            console.log('❌ Cognito not configured - missing environment variables')
            // Check localStorage for demo purposes
            const demoUser = localStorage.getItem('demoAuthUser')
            if (demoUser) {
                currentUser = JSON.parse(demoUser)
                console.log('✅ Found demo user:', currentUser.username)
                return { success: true, user: currentUser }
            }
            return { success: false, error: 'Cognito not configured' }
        }

        try {
            // Try real Cognito
            const user = await getCurrentUser()
            currentUser = user
            console.log('✅ Found authenticated user:', user.username)
            return { success: true, user }
        } catch (error) {
            console.log('❌ Get user error:', error.message)

            // Check localStorage for demo user as fallback
            const demoUser = localStorage.getItem('demoAuthUser')
            if (demoUser) {
                currentUser = JSON.parse(demoUser)
                console.log('✅ Found demo user:', currentUser.username)
                return { success: true, user: currentUser }
            }

            return { success: false, error: error.message }
        }
    },

    // Sign up
    async signUp(username, password, email, name) {
        console.log('📝 Sign up attempt:', username)

        const hasConfig = await initializeCognito()

        if (!hasConfig) {
            // Demo mode - simulate successful signup
            console.log('🎭 Demo mode: simulating signup')
            return {
                success: true,
                data: {
                    user: { username },
                    nextStep: { signUpStep: 'CONFIRM_SIGN_UP' }
                }
            }
        }

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
            console.log('✅ Real Cognito signup successful:', result)
            return { success: true, data: result }
        } catch (error) {
            console.log('❌ Sign up error:', error.message)
            return { success: false, error: error.message }
        }
    },

    // Confirm sign up
    async confirmSignUp(username, code) {
        console.log('📧 Confirm signup:', username)

        const hasConfig = await initializeCognito()

        if (!hasConfig) {
            // Demo mode - simulate successful confirmation
            console.log('🎭 Demo mode: simulating confirmation')
            return { success: true }
        }

        try {
            await confirmSignUp({
                username,
                confirmationCode: code
            })
            console.log('✅ Real Cognito confirmation successful')
            return { success: true }
        } catch (error) {
            console.log('❌ Confirm error:', error.message)
            return { success: false, error: error.message }
        }
    },

    // Resend confirmation code
    async resendConfirmationCode(username) {
        console.log('📧 Resending confirmation code for:', username)

        const hasConfig = await initializeCognito()

        if (!hasConfig) {
            console.log('🎭 Demo mode: simulating resend')
            return { success: true }
        }

        try {
            await resendSignUpCode({ username })
            console.log('✅ Confirmation code resent successfully')
            return { success: true }
        } catch (error) {
            console.log('❌ Resend error:', error.message)
            return { success: false, error: error.message }
        }
    },

    // Sign in
    async signIn(username, password) {
        console.log('🔑 Sign in attempt:', username)

        const hasConfig = await initializeCognito()

        if (!hasConfig) {
            // Demo mode - simulate successful signin
            console.log('🎭 Demo mode: simulating signin')
            const demoUser = {
                username,
                attributes: {
                    name: 'Demo User',
                    email: username
                }
            }
            localStorage.setItem('demoAuthUser', JSON.stringify(demoUser))
            currentUser = demoUser
            return { success: true, data: { user: demoUser } }
        }

        try {
            const result = await signIn({ username, password })
            currentUser = result
            console.log('✅ Real Cognito signin successful')

            // Check if user needs confirmation
            if (result.nextStep && result.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                console.log('⚠️ User needs to confirm email before signing in')
                return {
                    success: false,
                    error: 'User is not confirmed. Please check your email for a confirmation code.',
                    needsConfirmation: true,
                    username: username
                }
            }

            return { success: true, data: result }
        } catch (error) {
            console.log('❌ Sign in error:', error.message)

            // Check if it's a confirmation error
            if (error.message.includes('User is not confirmed') || error.message.includes('UserNotConfirmedException')) {
                console.log('⚠️ User needs email confirmation')
                return {
                    success: false,
                    error: 'Please confirm your email address. Check your inbox for a confirmation code.',
                    needsConfirmation: true,
                    username: username
                }
            }

            return { success: false, error: error.message }
        }
    },

    // Sign out
    async signOut() {
        console.log('🚪 Sign out')

        // Clear demo user
        localStorage.removeItem('demoAuthUser')
        currentUser = null

        const hasConfig = await initializeCognito()

        if (!hasConfig) {
            console.log('🎭 Demo mode: signed out')
            return { success: true }
        }

        try {
            await signOut()
            console.log('✅ Real Cognito signout successful')
            return { success: true }
        } catch (error) {
            console.log('❌ Sign out error:', error.message)
            return { success: false, error: error.message }
        }
    }
}
