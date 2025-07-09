import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { auth, db } from '../firebaseConfig';
import { useUserStore } from './store/useUserStore';
const Login = () =>{
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [correct , setCorrect] = useState<boolean>(true);
const setUser = useUserStore((state) => state.setUser);

  async function fetchUserData(uid: string) {
  const userDocRef = doc(db, "user", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    console.log("유저 데이터:", userData);
    return userData;
  } else {
    console.log("해당 UID의 유저 문서가 없습니다.");
    return null;
  }
}

  async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("로그인 성공, UID:", user.uid);
    const token = await user.getIdToken();
    await AsyncStorage.setItem("token",token);
     const userInfo = await fetchUserData(user.uid);
      setUser({
    uid: user.uid,
    email: user.email ?? '',
    nickname: userInfo?.nickname ?? '',
  });
    router.push("/")
  } catch (error) {
    console.error("로그인 실패:", error);
    setCorrect(false);
    // 에러 처리 (비밀번호 틀림, 네트워크 오류 등)
  }
}

  return <ThemedView style={styles.container}>
   
      <ThemedView style={styles.headers}>
        <ThemedText style={styles.headers_text} >Jinseok Park</ThemedText>
        </ThemedView>
        <ThemedView style={styles.subheaders}>
          <ThemedText style={styles.subHeaders_text}>
            Login to your Account
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.main}>
          {!correct &&
          <ThemedText style={styles.notice}>
<FontAwesome name="exclamation-triangle" size={20} color="#1F319D" /> Incorrect email or password!</ThemedText>}
         <TextInput value={email} onChangeText={(text)=>setEmail(text)} style={styles.main_input} placeholder="email" placeholderTextColor="lightgray"></TextInput>
         <TextInput value={password} onChangeText={(text)=>setPassword(text)} style={styles.main_input} secureTextEntry={true} placeholder="password" placeholderTextColor="lightgray"></TextInput>
         <TouchableOpacity style={styles.signin_button} onPress={()=>login(email,password)}>
          <ThemedText style={styles.signin_button_text}>Sign in</ThemedText>
         </TouchableOpacity>
       <ThemedView style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
  <ThemedText style={styles.footer}>Don&apos;t have an account?</ThemedText>
  <Link href="/signup" asChild>
    <ThemedText style={styles.footer_link}> Sign up</ThemedText>
  </Link>
</ThemedView>

        </ThemedView>
    </ThemedView>

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headers:{
    paddingTop : hp('15%'),
    paddingBottom: hp('15%'),
    minHeight: hp('30%'),
  },
  subheaders:{
    marginBottom : hp('5%'),
  },
  subHeaders_text :{
    textAlign:'center',
    color:'black',
    fontSize : 24,
    fontWeight : '700',
  },
  headers_text:{
textAlign:'center',
color:'#1F319D',
fontWeight:'900',
 fontSize: 32,
    lineHeight: 48,
  },
  main : {
    flexDirection : 'column',
    gap : hp("3%"),
  },
  notice : {
    color : 'black',
    textAlign : 'center',
    fontWeight : '500',
  },
  main_input : {
    padding: hp("2%"),
    width : wp("80%"),
    alignSelf : 'center',
    borderColor : '#1F319D',
    borderWidth : 2,
    borderRadius : 10,
  },
  signin_button:{
    backgroundColor: '#1F319D',
    width : wp("80%"),
    alignSelf: 'center',
    padding : hp("2%"),
    borderRadius: 10,
  },
  signin_button_text: {
    textAlign : 'center',
    fontSize: 20,
    fontWeight : 700,
  },
  footer:{
    color : 'gray',
    fontSize : 15,
    fontWeight:600,
    textAlign:'center',
  },
  footer_link:{
    color : '#1F319D',
    fontWeight: 600,
    fontSize : 20
  }
});

export default Login;