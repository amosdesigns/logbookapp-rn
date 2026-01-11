import { Slot } from 'expo-router'
import { AuthProvider } from '@/lib/providers/auth-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '@/global.css'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <QueryProvider>
          <Slot />
        </QueryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
