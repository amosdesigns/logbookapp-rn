import { ClerkProvider } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { ReactNode } from 'react'
import Constants from 'expo-constants'

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key)
    } catch (err) {
      console.error('Error getting token from SecureStore:', err)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value)
    } catch (err) {
      console.error('Error saving token to SecureStore:', err)
      return
    }
  },
}

const publishableKey = Constants.expoConfig?.extra?.clerkPublishableKey ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error(
    'Missing Clerk Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file'
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      {children}
    </ClerkProvider>
  )
}
