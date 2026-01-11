# Marina Guard Logbook - Mobile App

React Native mobile application built with Expo for the Town of Islip Marina Guard Logbook system.

## Overview

This is the mobile frontend that connects to the Next.js backend API (`/api/mobile/*`). It provides guards with a mobile-first interface for duty management, log entry, safety checklists, and more.

## Tech Stack

- **Framework:** React Native with Expo (~52.0.0)
- **Navigation:** Expo Router (file-based routing)
- **Authentication:** Clerk (@clerk/clerk-expo)
- **Data Fetching:** React Query (@tanstack/react-query)
- **HTTP Client:** Axios
- **State Management:** Zustand
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React Native

## Prerequisites

- Node.js 22.12+ (same as Next.js backend)
- npm or yarn
- iOS Simulator (macOS only) or Android Emulator
- Expo Go app (for testing on physical devices)

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `mobile/` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/mobile
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Important:**
- For iOS simulator, use `http://localhost:3000`
- For Android emulator, use `http://10.0.2.2:3000`
- For physical devices on same network, use your computer's local IP (e.g., `http://192.168.1.100:3000`)

### 3. Ensure Backend is Running

The mobile app requires the Next.js backend to be running:

```bash
# In the root directory (not mobile/)
cd ..
npm run dev
```

The backend should be running at `http://localhost:3000`.

## Running the App

### Start the Development Server

```bash
npm start
```

This will open the Expo DevTools in your browser.

### Run on iOS Simulator (macOS only)

```bash
npm run ios
```

Or press `i` in the terminal after running `npm start`.

### Run on Android Emulator

```bash
npm run android
```

Or press `a` in the terminal after running `npm start`.

### Run on Physical Device

1. Install the Expo Go app on your iOS or Android device
2. Run `npm start`
3. Scan the QR code with:
   - **iOS:** Camera app
   - **Android:** Expo Go app

**Network Requirements:**
- Your phone and computer must be on the same Wi-Fi network
- Update `EXPO_PUBLIC_API_URL` to use your computer's local IP address

## Project Structure

```
mobile/
├── app/                    # Expo Router app directory
│   ├── (tabs)/             # Bottom tab navigation
│   │   ├── index.tsx       # Home screen
│   │   ├── logs.tsx        # Logs screen
│   │   ├── shifts.tsx      # Shifts screen
│   │   └── profile.tsx     # Profile screen
│   ├── (auth)/             # Authentication screens (future)
│   └── _layout.tsx         # Root layout
├── components/             # Reusable components
│   ├── ui/                 # Base UI components
│   ├── duty/               # Duty-related components
│   ├── logs/               # Log components
│   └── safety/             # Safety checklist components
├── lib/                    # Core libraries
│   ├── api/                # API client (axios wrapper)
│   ├── hooks/              # React Query hooks (future)
│   ├── providers/          # Context providers
│   ├── stores/             # Zustand stores (future)
│   └── types/              # TypeScript type definitions
└── assets/                 # Images, fonts, etc.
```

## Key Features (Phase 2 - Foundation)

✅ **Project Setup**
- Expo with TypeScript
- File-based routing (Expo Router)
- Bottom tab navigation

✅ **Authentication**
- Clerk integration with secure token storage
- Auto-token refresh

✅ **Data Layer**
- API client with Axios
- React Query for caching and sync
- TypeScript types matching backend

✅ **Styling**
- NativeWind (Tailwind CSS)
- Consistent design tokens

## Development Workflow

### 1. Make Changes

Edit files in `app/`, `components/`, or `lib/`. The app will hot-reload automatically.

### 2. TypeScript Check

```bash
npx tsc --noEmit
```

### 3. Linting (future)

```bash
npm run lint
```

## Common Issues

### Metro bundler cache issues

```bash
npx expo start --clear
```

### Environment variables not updating

1. Stop the dev server
2. Clear Metro cache: `npx expo start --clear`
3. Restart

### Cannot connect to API

- Check backend is running (`http://localhost:3000`)
- Verify `EXPO_PUBLIC_API_URL` in `.env`
- For Android emulator, use `http://10.0.2.2:3000`
- For physical device, use local IP (e.g., `http://192.168.1.100:3000`)

## Next Steps (Phase 3)

The following features will be implemented in Phase 3:

- [ ] Duty Management screens (clock in/out with location selection)
- [ ] Safety Checklist screen with submission
- [ ] Log management (create, view, edit logs)
- [ ] Shift calendar view
- [ ] Messaging interface with supervisors
- [ ] Offline support with cache-first strategy
- [ ] Push notifications
- [ ] Image upload for incidents

## Documentation

- [React Native Setup Guide](../docs/react-native-setup-guide.md)
- [API Integration Guide](../docs/api-integration-quick-start.md)
- [Migration Plan](../docs/react-native-migration-plan.md)

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.

---

**Version:** 1.0.0
**Last Updated:** 2026-01-11
