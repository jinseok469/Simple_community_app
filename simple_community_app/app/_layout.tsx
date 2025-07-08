import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { RecoilRoot } from 'recoil';
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
    <RecoilRoot>
      <Slot></Slot>
      <StatusBar style="auto" />
    </RecoilRoot>
  );
}
