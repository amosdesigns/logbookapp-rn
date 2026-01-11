# React Native Mobile App - Setup Guide

## Project Overview

This is Phase 2 of the React Native migration. We're building a standalone mobile app that connects to the existing Next.js backend via the API layer created in Phase 1.

**Architecture:**
- **Backend:** Next.js 16 with Server Actions (existing)
- **API Layer:** REST API at `/api/mobile/*` (Phase 1 - completed)
- **Mobile App:** React Native with Expo (Phase 2 - this guide)

---

## Directory Structure

The React Native app will be created in a separate directory to keep it isolated from the Next.js app:

```
project-root/
├── logbookapp-rn/          # Next.js backend (existing)
│   ├── app/
│   ├── lib/
│   │   └── api/
│   │       └── mobile-auth.ts
│   └── app/api/mobile/     # Mobile API routes (Phase 1)
│
└── logbookapp-mobile/      # React Native app (Phase 2 - new)
    ├── app/                # Expo Router app directory
    │   ├── (auth)/         # Authentication screens
    │   ├── (tabs)/         # Main app tabs
    │   └── _layout.tsx     # Root layout
    ├── components/         # Reusable components
    │   ├── ui/             # Base UI components
    │   ├── duty/           # Duty-related components
    │   ├── logs/           # Log components
    │   └── safety/         # Safety checklist components
    ├── lib/                # Core libraries
    │   ├── api/            # API client
    │   ├── hooks/          # React Query hooks
    │   ├── stores/         # Zustand stores
    │   └── types/          # TypeScript types
    ├── assets/             # Images, fonts, etc.
    └── package.json
```

---

## Tech Stack

### Core Dependencies

```json
{
  "expo": "~52.0.0",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "typescript": "~5.3.3"
}
```

### Navigation

```json
{
  "expo-router": "~4.0.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11"
}
```

### Authentication

```json
{
  "@clerk/clerk-expo": "^2.0.0",
  "expo-secure-store": "~13.0.0"
}
```

### Data Fetching & State

```json
{
  "@tanstack/react-query": "^5.0.0",
  "axios": "^1.6.0",
  "zustand": "^4.4.0"
}
```

### UI & Styling

```json
{
  "nativewind": "^4.0.0",
  "tailwindcss": "^3.4.0",
  "react-native-reanimated": "~3.16.1",
  "react-native-safe-area-context": "4.12.0"
}
```

### Forms & Validation

```json
{
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.0",
  "zod": "^3.22.0"
}
```

### Utilities

```json
{
  "date-fns": "^3.0.0",
  "expo-constants": "~17.0.0",
  "expo-linking": "~7.0.0"
}
```

---

## Phase 2 Implementation Steps

### Step 1: Initialize Expo Project

```bash
cd ..  # Go to parent directory of logbookapp-rn
npx create-expo-app logbookapp-mobile --template blank-typescript
cd logbookapp-mobile
```

### Step 2: Install Dependencies

```bash
# Navigation
npx expo install expo-router react-native-safe-area-context react-native-screens

# Authentication
npx expo install @clerk/clerk-expo expo-secure-store

# Data & State
npm install @tanstack/react-query axios zustand

# Styling
npm install nativewind tailwindcss
npm install --save-dev @types/react @types/react-native

# Forms
npm install react-hook-form @hookform/resolvers zod

# Utilities
npm install date-fns
npx expo install expo-constants expo-linking
```

### Step 3: Configure Expo Router

Update `app.json`:

```json
{
  "expo": {
    "scheme": "logbookapp",
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Step 4: Configure NativeWind

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        danger: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
}
```

Create `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './global.css' })
```

Create `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Set Up Environment Variables

Create `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/mobile
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Create `.env.production`:

```env
EXPO_PUBLIC_API_URL=https://your-production-url.com/api/mobile
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

### Step 6: Create TypeScript Types

Create `lib/types/index.ts` (copy types from API integration guide):

```typescript
// All the types from docs/api-integration-quick-start.md
// User, DutySession, Location, Log, etc.
```

### Step 7: Create API Client

Create `lib/api/client.ts` (from API integration guide):

```typescript
import axios from 'axios'
import Constants from 'expo-constants'

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL

export class ApiClient {
  // Implementation from api-integration-quick-start.md
}
```

### Step 8: Set Up React Query

Create `lib/providers/query-provider.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Step 9: Set Up Clerk Authentication

Create `lib/providers/auth-provider.tsx`:

```typescript
import { ClerkProvider } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { ReactNode } from 'react'
import Constants from 'expo-constants'

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const publishableKey = Constants.expoConfig?.extra?.clerkPublishableKey ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={publishableKey!}
      tokenCache={tokenCache}
    >
      {children}
    </ClerkProvider>
  )
}
```

### Step 10: Create Root Layout

Create `app/_layout.tsx`:

```typescript
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
```

### Step 11: Create Navigation Structure

Create `app/(tabs)/_layout.tsx`:

```typescript
import { Tabs } from 'expo-router'
import { Home, FileText, Calendar, User } from 'lucide-react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: 'Logs',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="shifts"
        options={{
          title: 'Shifts',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
```

### Step 12: Create Home Screen

Create `app/(tabs)/index.tsx`:

```typescript
import { View, Text } from 'react-native'
import { useActiveDutySession } from '@/lib/hooks/use-duty'

export default function HomeScreen() {
  const { data: dutySession, isLoading } = useActiveDutySession()

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Home</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : dutySession ? (
        <Text>On duty at {dutySession.location?.name}</Text>
      ) : (
        <Text>Not on duty</Text>
      )}
    </View>
  )
}
```

---

## Testing

### Run on iOS Simulator

```bash
npx expo start
# Press 'i' for iOS simulator
```

### Run on Android Emulator

```bash
npx expo start
# Press 'a' for Android emulator
```

### Run on Physical Device

```bash
npx expo start
# Scan QR code with Expo Go app
```

---

## Next Steps (Phase 3)

After Phase 2 is complete, Phase 3 will implement the core features:

1. Duty Management screens (clock in/out)
2. Safety Checklist screen
3. Log management screens (create, view, edit)
4. Shift calendar view
5. Messaging interface
6. Offline support with cache

---

**Document Version:** 1.0
**Last Updated:** 2026-01-11
