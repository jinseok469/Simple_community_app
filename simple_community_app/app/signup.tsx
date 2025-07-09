import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { db } from '../firebaseConfig';
const Signup = () =>{
  const [email, setEmail] = useState("");
  const [correct,setCorrect] = useState(true);
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [nickname, setNickname] = useState("");
const router = useRouter();
const handleSignup = async () => {
  if (!email || !password || !confirmPassword || !nickname) {
    alert("모든 필드를 입력해주세요.");
    return;
  }

  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    setCorrect(false);
    return;
  }

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore에 유저 정보 저장
    await setDoc(doc(db, "user", user.uid), {
      email,
      nickname,
      createdAt: new Date(),
    });

    alert("회원가입 완료!");
    router.replace("/login");
  } catch (error: any) {
    console.error("회원가입 실패:", error);
    alert(error.message);
  }
};
  return <KeyboardAvoidingView
  style={{ flex: 1 }} 
  behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headers}>
        <ThemedText style={styles.headers_text} >Jinseok Park</ThemedText>
        </ThemedView>
        <ThemedView style={styles.subheaders}>
          <ThemedText style={styles.subHeaders_text}>
            Create your Account
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.main}>
          {!correct &&<ThemedText style={styles.notice}>
<FontAwesome name="exclamation-triangle" size={20} color="#1F319D" /> Incorrect password!</ThemedText>}
         <TextInput style={styles.main_input} placeholder="email" placeholderTextColor="lightgray"  value={email}
  onChangeText={setEmail}></TextInput>
         <TextInput style={styles.main_input} secureTextEntry={true}placeholder="password" placeholderTextColor="lightgray" value={password}
  onChangeText={setPassword} onChange={()=>setCorrect(true)}></TextInput>
         <TextInput style={styles.main_input} secureTextEntry={true}placeholder="confirm password" placeholderTextColor="lightgray" value={confirmPassword}
  onChangeText={setConfirmPassword} onChange={()=>setCorrect(true)}></TextInput>
          <TextInput style={styles.main_input} placeholder="nickname" placeholderTextColor="lightgray"  value={nickname}
  onChangeText={setNickname}></TextInput>
         <TouchableOpacity style={styles.signin_button}>
          <ThemedText style={styles.signin_button_text} onPress={handleSignup}>Sign up</ThemedText>
         </TouchableOpacity>
       
        </ThemedView>
    </ThemedView>
    </ScrollView>
</KeyboardAvoidingView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headers:{
    paddingTop : hp('10%'),
    paddingBottom: hp('10%'),
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

export default Signup;