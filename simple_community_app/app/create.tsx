import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import ImageAttachButton from "../components/ImageAttachButton";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { createPost } from "../hooks/createPost";
import { useUserStore } from "./store/useUserStore";

const Create = () =>{
  const [text, setText] = useState("");
  const router =useRouter();
const [imageUri, setImageUri] = useState<string>("");
const user = useUserStore(state => state.user); 
const handleCreate = async () => {
  if (!text.trim()) {
    Alert.alert("내용을 입력하세요.");
    return;
  }
console.log('선택된 imageUri:', imageUri);
  if(imageUri === ""){
    Alert.alert("이미지를 넣어주세요");
    return;
  }

  try {
    await createPost(user.uid, text, imageUri,user.nickname);
    Alert.alert("게시물이 성공적으로 등록되었습니다.");
    setText("");
    setImageUri(""); // 초기화
    router.push("/");
  } catch (error) {
    console.error("게시 실패:", error);
    Alert.alert("게시 중 오류 발생");
  }
};
  return( <ThemedView style={styles.container}>
    <ScrollView>
      <ThemedText style={styles.headerText}>Jinseok Park</ThemedText>
    <ThemedView style={styles.imageBox}>
      <ImageAttachButton onImageSelected={(uri) => setImageUri(uri)}></ImageAttachButton>
    </ThemedView>
    <TextInput value={text} onChangeText={(text)=>setText(text)} style={styles.input} multiline={true} placeholderTextColor={'lightgray'} placeholder="Please write your content"></TextInput>
     <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <ThemedText style={styles.createButton_text}>게시</ThemedText>
             </TouchableOpacity>
    </ScrollView>
  </ThemedView>)
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "aliceblue"
  },
  headerText:{
    color: "#1F319D",
    marginTop : hp("10%"),
    fontWeight:'900',
 fontSize: 32,
    lineHeight: 48,
    textAlign: 'center',
    marginBottom : hp("5%"),
  },
  imageBox :{
    height : hp("25%"),
    width : wp("80%"),
    alignSelf: 'center',
  },
  input:{
    marginTop: 20,
    borderWidth : 1,
    borderColor: '#1F319D',
    borderRadius: 12,
    backgroundColor:'white',
    height : hp("30%"),
    width : wp("80%"),
    alignSelf: 'center',
      padding: hp("2%"),
  },
  createButton:{
    marginTop: hp("5%"),
      backgroundColor: '#1F319D',
    width : wp("80%"),
    alignSelf: 'center',
    padding : hp("2%"),
    borderRadius: 20,
    marginBottom : hp("10%"),
  },
  createButton_text:{
    fontSize : 20,
    lineHeight : 30,
    textAlign: 'center',
    fontWeight: 800,

  }
})

export default Create;