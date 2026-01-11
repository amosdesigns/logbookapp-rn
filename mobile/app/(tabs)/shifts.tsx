import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ShiftsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4 text-gray-900">
          Shifts
        </Text>
        <Text className="text-base text-gray-600">
          Shift calendar coming soon...
        </Text>
      </View>
    </SafeAreaView>
  )
}
