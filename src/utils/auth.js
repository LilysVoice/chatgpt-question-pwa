// Simplified auth for testing - replace with full Cognito later
let isConfigured = false
let currentUser = null

// Check if Cognito is configured
const checkConfiguration = () => {
    const hasConfig = import.meta.env.VITE_COGNITO_USER_POOL_ID &&
        import.meta.env.VITE_COGNITO_CLIENT_ID

    if (hasConfig && !isConfigured) {
        console.log('🔧 Configuring Cognito...')

        // Try to import and configure Amplify
        try {
            import('aws-amplify').then(({ Amplify }) => {
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
            })
        } catch (error) {
            console.log('❌ Failed to configure Cognito:', error)
        }
    }

    return hasConfig
}

export const authService = {
    // Get current user
    async getCurrentUser() {
        console.log('🔍 Getting current user...')

        if (!checkConfiguration()) {
            console.log('❌ Cognito not configured')
            return { success: false, error: 'Cognito not configured' }
        }

        try {
            // Check localStorage for demo purposes
            const demoUser = localStorage.getItem('demoAuthUser')
            if (demoUser) {
                currentUser = JSON.parse(demoUser)
                console.log('✅ Found demo user:', currentUser.username)
                return { success: true, user: currentUser }
            }

            // Try real Cognito if configured
            if (isConfigured) {
                const { getCurrentUser } = await import('aws-amplify/auth')
                const user = await getCurrentUser()
                currentUser = user
                return { success: true, user }
            }

            return { success: false, error: 'No user found' }
        } catch (error) {
            console.log('❌ Get user error:', error.message)
            return { success: false, error: error.message }
        }
    },

    // Sign up
    async signUp(username, password, email, name) {
        console.log('📝 Sign up attempt:', username)

        if (!checkConfiguration()) {
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
            if (isConfigured) {
                const { signUp } = await import('aws-amplify/auth')
                const result = await signUp({
                    username,
                    password,
                    options: {
                        userAttributes: { email, name }
                    }
                })
                return { success: true, data: result }
            }

            return { success: false, error: 'Cognito not ready' }
        } catch (error) {
            console.log('❌ Sign up error:', error.message)
            return { success: false, error: error.message }
        }
    },

    // Confirm sign up
    async confirmSignUp(username, code) {
        console.log('📧 Confirm signup:', username)

        if (!checkConfiguration()) {
            // Demo mode - simulate successful confirmation
            console.log('🎭 Demo mode: simulating confirmation')
            return { success: true }
        }

        try {
            if (isConfigured) {
                const { confirmSignUp } = await import('aws-amplify/auth')
                await confirmSignUp({ username, confirmationCode: code })
                return { success: true }
            }

            return { success: false, error: 'Cognito not ready' }
        } catch (error) {
            console.log('❌ Confirm error:', error.message)
            return { success: false, error: error.message }
        }
    },

    // Sign in
    async signIn(username, password) {
        console.log('🔑 Sign in attempt:', username)

        if (!checkConfiguration()) {
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
            if (isConfigured) {
                const { signIn } = await import('aws-amplify/auth')
                const result = await signIn({ username, password })
                currentUser = result.user || result
                return { success: true, data: result }
            }

            return { success: false, error: 'Cognito not ready' }
        } catch (error) {
            console.log('❌ Sign in error:', error.message)
            return { success: false, error: error.message }
        }
    },

    // Sign out
    async signOut() {
        console.log('🚪 Sign out')

        // Clear demo user
        localStorage.removeItem('demoAuthUser')
        currentUser = null

        if (!checkConfiguration()) {
            console.log('🎭 Demo mode: signed out')
            return { success: true }
        }

        try {
            if (isConfigured) {
                const { signOut } = await import('aws-amplify/auth')
                await signOut()
                return { success: true }
            }

            return { success: true }
        } catch (error) {
            console.log('❌ Sign out error:', error.message)
            return { success: false, error: error.message }
        }
    }
}
