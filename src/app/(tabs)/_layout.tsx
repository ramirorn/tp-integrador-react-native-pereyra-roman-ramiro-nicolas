import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/tabs';

import { colores } from '../../constants/tema';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSecundario,
        headerTintColor: colores.primario,
      }}>
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="library" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmarks" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
