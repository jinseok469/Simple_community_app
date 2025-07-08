import { StyleSheet, Text } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useUserStore } from './store/useUserStore';
const Home = () =>{
  // useEffect(()=>{
  //   const login = async () =>{
  //     await AsyncStorage.clear();
  //   }
  //   login();
  // },[])
  const userInfo = useUserStore((state) => state.user);
  return <ThemedView style={styles.container}>
    <ThemedText style={styles.text}>홈화면 입니다
      <Text></Text>
    사용자 이메일 : {userInfo.email}<Text></Text>
    사용자 닉네임 : {userInfo.nickname}
    </ThemedText>
  </ThemedView>
}

const styles = StyleSheet.create({
  container :{
    flex :1 ,
    paddingTop: hp("20%")
  },
  text : {
    color: 'black',
    fontSize : 30,
    lineHeight: 40,
  }
})

export default Home;