import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#1e1e1e',
            borderTopColor: '#333',
          },
          default: {
            backgroundColor: '#1e1e1e',
            borderTopColor: '#333',
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="paperplane.fill" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
