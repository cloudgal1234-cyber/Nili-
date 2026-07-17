import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import AnswersScreen from '../screens/AnswersScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        {/*
          Answers is a normal route (so deep links/back-navigation resolve),
          but the screen itself refuses to render its content unless
          useGameStore().isComplete is true — see AnswersScreen.tsx. That
          check, not this navigator, is the real gate.
        */}
        <Stack.Screen name="Answers" component={AnswersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
