import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FloatingButton from "../components/FloatingButton";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { db } from "../firebaseConfig";
import { usePostStore } from "./store/usePostStore";
import { useUserStore } from "./store/useUserStore";
const Home = () =>{
 const [posts, setPosts] = useState<any[]>([]);
 const router = useRouter();
 
 const userClear = useUserStore((state)=> state.clearUser);
 useFocusEffect(
  useCallback(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const postList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postList);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, [])
);

const handleLogoutPress = () => {
  Alert.alert(
    "로그아웃",
    "정말 로그아웃 하시겠습니까?",
    [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "확인",
        onPress: async () => {
          try {
            const auth = getAuth();
            await signOut(auth);
            userClear();
            await AsyncStorage.clear();
          router.replace('/login');
          } catch (error) {
            console.error("로그아웃 실패:", error);
          }
        },
      },
    ],
    { cancelable: false }
  );
};


  return <ThemedView style={styles.container}>
    <ScrollView>
      <ThemedView style={styles.header}><ThemedText style={styles.headerText}>Jinseok Park</ThemedText>
      <TouchableOpacity onPress={handleLogoutPress}><FontAwesome name="sign-out" size={30} color="black" /></TouchableOpacity>
     </ThemedView>
      {posts.map((post,i)=> (
      <ThemedView style={styles.main} key={i}>
        <TouchableOpacity  onPress={() => {
    usePostStore.getState().setSelectedPostId(post.id); // 👈 전역 저장
    router.push("/view"); // 👈 이동
  }}>
        <ThemedView  style={styles.main_userInfo}><ThemedView style={styles.usesrInfo}><FontAwesome name="user-circle" size={25} color="#1F319D"></FontAwesome><ThemedText style={styles.userNickname}>{post?.nickname}</ThemedText></ThemedView><ThemedText style={styles.createdDate}>{post.createdAt
    ? (() => {
        const date = post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt.seconds * 1000);
        // YYYY-MM-DD 포맷 만들기
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      })()
    : ""}</ThemedText></ThemedView>
        <ThemedView style={styles.main_images}>
        <Image
  source={{ uri: post?.imageUrl }}
  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
/>
        </ThemedView>
        <ThemedText style={styles.main_text} numberOfLines={2}>{post?.text}</ThemedText>
         <ThemedView style={styles.main_footer}><ThemedView style={styles.count}><FontAwesome name="heart" size={20} color="#1F319D" />
  <ThemedText style={styles.count_text}>
    {post?.likeCount > 0 ? post.likeCount : ""}
  </ThemedText></ThemedView>
      <ThemedView style={styles.count}><FontAwesome name="comment" size={20} color="#1F319D" /><ThemedText style={styles.count_text}>{post?.reviewCount > 0 ? post?.reviewCount : ""}</ThemedText></ThemedView></ThemedView>
      </TouchableOpacity>
      </ThemedView>
     ))}
    </ScrollView>
    <FloatingButton></FloatingButton>
  </ThemedView>
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "aliceblue"
  },
  header: {
   marginTop: hp("10%"),
  marginBottom: hp("5%"),
  paddingHorizontal: wp("8%"),
  flexDirection: 'row',
  justifyContent: 'space-between', 
  alignItems: 'center',
   backgroundColor: "aliceblue"
},
  headerText:{
   color: "#1F319D",
  fontWeight: '900',
  fontSize: 32,
  lineHeight: 48,
  textAlign: 'center',
  flex: 1, 
  },
  main : {
    padding : hp("3%"),
    width : wp("80%"),
    alignSelf:'center',
    borderRadius: 20,
    borderColor: "#1F319D",
    borderWidth : 1,
    marginBottom : hp("3%"),
  },
  main_userInfo:{
     alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between', 
  width: '100%',
  },
  usesrInfo:{
 alignItems: 'center',
  flexDirection: 'row',
  gap: wp("2%"),
  },
  userNickname:{
    color: 'black',
    fontSize : 11,
    fontWeight : 700,
  },
  createdDate:{
    alignSelf: 'flex-end',
    color : 'gray',
    fontSize : 10,
  },
  main_images:{
    height: hp("22%"),
    borderWidth:1,
    borderColor:'black',
    marginTop: hp("2%"),
  },
  main_text:{
    fontSize:10,
    fontWeight : 800,
    marginTop : hp("2%"),
    color: 'black',
  },
  main_footer:{
    marginTop: hp("1%"),
    flexDirection: 'row',
    gap : wp("8%"),
  },
  count:{
    gap: wp("1.5%"),
    flexDirection:"row",
  },
   count_text:{
    color:'black',
    fontSize:15,
  }
})

export default Home;