import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import { loadProfile } from './src/utils/storage';

import WelcomeScreen from './src/screens/WelcomeScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import DiscoveryScreen from './src/screens/DiscoveryScreen';
import PromptDetailScreen from './src/screens/PromptDetailScreen';
import MyProfileScreen from './src/screens/MyProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    loadProfile().then(profile => {
      setInitialRoute(profile ? 'Discovery' : 'Welcome');
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1a1a2e' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen name="Discovery" component={DiscoveryScreen} />
          <Stack.Screen name="PromptDetail" component={PromptDetailScreen} />
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
