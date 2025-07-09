import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
export default function RootLayout() {
  const router = useRouter();
  
  const pathname = usePathname();

  useEffect( ()=>{
  
    const getToken = async ()=>{
          const path = pathname;
     const publicPaths = ['/login', '/signup'];
        const token = await AsyncStorage.getItem("token");
        if(!token &&  !publicPaths.includes(path)){
          router.replace("/login");
      }
    }
    getToken();
  },[router,pathname])

 

  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        headerShown: false // 스와이프 백 제스처 활성화
      }}
    >
      <Stack.Screen name="index"
        options={{
          gestureEnabled: false, // ✅ index 만 스와이프 백 비활성화
        }}></Stack.Screen>
      <Stack.Screen name="login"
        options={{
          gestureEnabled: false, // ✅ index 만 스와이프 백 비활성화
        }}></Stack.Screen>
     
      {/* Slot이 Stack 안에 있어야 네비게이션 스택 적용됨 */}
      <Slot />
    </Stack>
  );
}
