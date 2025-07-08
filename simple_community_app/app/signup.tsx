import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
const Signup = () =>{
  return  <ThemedView style={styles.container}>
      <ThemedView style={styles.headers}>
        <ThemedText style={styles.headers_text} >Jinseok Park</ThemedText>
        </ThemedView>
        <ThemedView style={styles.subheaders}>
          <ThemedText style={styles.subHeaders_text}>
            Create your Account
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.main}>
          <ThemedText style={styles.notice}>
<FontAwesome name="exclamation-triangle" size={20} color="#1F319D" /> Incorrect password!</ThemedText>
         <TextInput style={styles.main_input} placeholder="email" placeholderTextColor="lightgray"></TextInput>
         <TextInput style={styles.main_input} secureTextEntry={true}placeholder="password" placeholderTextColor="lightgray"></TextInput>
         <TextInput style={styles.main_input} secureTextEntry={true}placeholder="confirm password" placeholderTextColor="lightgray"></TextInput>
          <TextInput style={styles.main_input} placeholder="nickname" placeholderTextColor="lightgray"></TextInput>
         <TouchableOpacity style={styles.signin_button}>
          <ThemedText style={styles.signin_button_text}>Sign up</ThemedText>
         </TouchableOpacity>
       
        </ThemedView>
    </ThemedView>

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