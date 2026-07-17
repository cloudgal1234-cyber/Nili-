import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { ensureRTLLayout } from './src/utils/rtl';

export default function App() {
  useEffect(() => {
    ensureRTLLayout();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}
