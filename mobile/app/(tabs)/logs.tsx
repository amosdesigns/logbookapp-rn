import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LogsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4 text-gray-900">
          Logs
        </Text>
        <Text className="text-base text-gray-600">
          Log management coming soon...
        </Text>
      </View>
    </SafeAreaView>
  )
}
