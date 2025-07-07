import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { StyleSheet } from "react-native"
import { Stack } from 'expo-router';
const Login = () =>{
  return <ThemedView style={styles.container}>
      <Stack.Screen
      options={{
        headerShown: false, // 헤더 숨기기
      }}
    />
      <ThemedView style={styles.headers}>
        <ThemedText style={styles.headers_text}>Jinseok Park</ThemedText></ThemedView>
    </ThemedView>

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headers:{
    flex: 1,
    padding: 100,
     
  },
  headers_text:{
textAlign:'center',
color:'#1F319D',
fontWeight:800,
fontSize:30,
  }
});

export default Login;