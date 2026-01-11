import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4 text-gray-900">
          Marina Guard Logbook
        </Text>
        <Text className="text-base text-gray-600">
          Welcome to the mobile app! Phase 2 setup is complete.
        </Text>
      </View>
    </SafeAreaView>
  )
}
