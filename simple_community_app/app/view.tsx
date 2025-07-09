import { FontAwesome } from "@expo/vector-icons";
import { collection, doc, getDoc, getDocs, orderBy, query, runTransaction, Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FloatingButton from "../components/FloatingButton";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { db } from "../firebaseConfig";
import { usePostStore } from "./store/usePostStore";
import { useUserStore } from "./store/useUserStore";
const View = () =>{
   const { selectedPostId } = usePostStore();
  const [post, setPost] = useState<any>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const user = useUserStore((state)=> state.user);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewCount,setReviewCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!selectedPostId) return;
      const docRef = doc(db, "posts", selectedPostId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      }
      if (docSnap.exists()) {
  const data = docSnap.data();
  setPost({ id: docSnap.id, ...data });
  setLikeCount(data.likeCount ?? 0);
  setReviewCount(data.reviewCount ?? 0);
}
    };
    fetchPost();
  }, [selectedPostId]);
  
   const fetchReviews = useCallback(async () => {
  if (!selectedPostId) return;
  const reviewsRef = collection(db, "posts", selectedPostId, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setReviews(list);
  
}, [selectedPostId]);


 useEffect(() => {
  fetchReviews();
}, [fetchReviews]);

useEffect(() => {
  if (!selectedPostId || !user?.uid) return;

  const checkLikeStatus = async () => {
    const likeRef = doc(db, "posts", selectedPostId, "likes", user.uid);
    const likeSnap = await getDoc(likeRef);
    setHasLiked(likeSnap.exists());
  };

  checkLikeStatus();
}, [selectedPostId, user?.uid]);
const toggleLike = async () => {
  if (!selectedPostId || !user?.uid) return;

  const postRef = doc(db, "posts", selectedPostId);
  const likeRef = doc(postRef, "likes", user.uid);

  try {
    await runTransaction(db, async (transaction) => {
      const postSnap = await transaction.get(postRef);
      if (!postSnap.exists()) throw new Error("게시글이 존재하지 않습니다.");

      const postData = postSnap.data();
      const currentCount = postData?.likeCount ?? 0;

      const likeSnap = await transaction.get(likeRef);

      if (likeSnap.exists()) {
        // 좋아요 취소
        transaction.delete(likeRef);
        transaction.update(postRef, { likeCount: Math.max(currentCount - 1, 0) });
        setHasLiked(false);
        setLikeCount(currentCount - 1);
      } else {
        // 좋아요 등록
        transaction.set(likeRef, {
          likedAt: Timestamp.now(),
          nickname: user.nickname,
        });
        transaction.update(postRef, { likeCount: currentCount + 1 });
        setHasLiked(true);
        setLikeCount(currentCount + 1);
      }
    });
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    Alert.alert("좋아요 처리에 실패했습니다.");
  }
};


const addReview = async (postId: string, text: string, nickname: string) => {
  if (reviewText.trim() === "") {
    Alert.alert("내용을 입력해주세요");
    return;
  }

  try {
    const postDocRef = doc(db, "posts", postId);
    const reviewsColRef = collection(postDocRef, "reviews");

    await runTransaction(db, async (transaction) => {
      const postSnap = await transaction.get(postDocRef);
      if (!postSnap.exists()) {
        throw new Error("게시글이 존재하지 않습니다.");
      }

      // 댓글 추가
      const newReviewRef = doc(reviewsColRef);
      const newReview = {
        text,
        nickname,
        createdAt: Timestamp.now(),
      };
      transaction.set(newReviewRef, newReview);

      // reviewCount 증가
      const currentCount = postSnap.data().reviewCount ?? 0;
      transaction.update(postDocRef, {
        reviewCount: currentCount + 1,
      });
    });

    // 댓글 목록 리프레시
    fetchReviews();
    setReviewText("");
    setReviewCount(reviewCount+1);
    Alert.alert("댓글이 등록되었습니다.");
  } catch (error) {
    console.error("댓글 등록 실패:", error);
    Alert.alert("댓글 등록에 실패했습니다.");
  }
};

  return <ThemedView style={styles.container}>
    <KeyboardAvoidingView
  style={{ flex: 1 }} 
  behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag">
      <ThemedView style={styles.header}><ThemedText style={styles.headerText}>Jinseok Park</ThemedText>
     </ThemedView>
      <ThemedView style={styles.main}>
        <ThemedView  style={styles.main_userInfo}><ThemedView style={styles.usesrInfo}><FontAwesome name="user-circle" size={25} color="#1F319D"></FontAwesome><ThemedText style={styles.userNickname}>
          {post?.nickname}</ThemedText></ThemedView><ThemedText style={styles.createdDate}>
    </ThemedText></ThemedView>
        <ThemedView style={styles.main_images}>
        <Image source={{uri : post?.imageUrl}}  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}></Image>
        </ThemedView>
        <ThemedText style={styles.main_text}>{post?.text}</ThemedText>
         <ThemedView style={styles.main_footer}>
          <ThemedView style={styles.count}>
           <TouchableOpacity onPress={toggleLike}>
          <FontAwesome name="heart" size={20} color={hasLiked ? "red" : "#1F319D"} /></TouchableOpacity>
          <ThemedText style={styles.count_text}>{likeCount > 0 ? likeCount : ""}</ThemedText></ThemedView>
      <ThemedView style={styles.count}><FontAwesome name="comment" size={20} color="#1F319D" /><ThemedText style={styles.count_text}>{reviewCount > 0 ? reviewCount : ""}</ThemedText></ThemedView></ThemedView>
      </ThemedView>
    <ThemedView style={styles.review}><TextInput  style={styles.reviewInput} value={reviewText} onChangeText={(text)=>setReviewText(text)}></TextInput><TouchableOpacity style={styles.reviewButton}><ThemedText style={styles.reviewButton_text} onPress={()=>addReview(selectedPostId,reviewText,user.nickname)}>등록</ThemedText></TouchableOpacity></ThemedView>
    {reviews.length === 0 ?
    <ThemedText style={styles.reviewNotice}>댓글을 등록해보세요 !</ThemedText>
   :reviews.map((review,i)=> <ThemedView style={styles.reviewBox} key={i}>
      <ThemedText style={styles.reviewDate}>{review?.createdAt
    ? (() => {
        const date = review?.createdAt.toDate ? review?.createdAt.toDate() : new Date(review?.createdAt.seconds * 1000);
        // YYYY-MM-DD 포맷 만들기
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      })(): ""} @{review?.nickname}</ThemedText>
      <ThemedText style={styles.reviewMain}>{review?.text}</ThemedText>
    </ThemedView>)
}
    </ScrollView>
    </KeyboardAvoidingView>
    <FloatingButton></FloatingButton>
  </ThemedView>
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "aliceblue",
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
  review:{
    flexDirection:'row',
      width : wp("80%"),
      height: hp("6%"),
      alignSelf:'center',
       marginTop: hp("3%"),
        borderWidth : 1,
   borderColor: '#1F319D',
   borderRadius:15,
  },
  count:{
    gap: wp("1.5%"),
    flexDirection:"row",
  },
  reviewInput:{
   padding: hp("2%"),
  
  width:'77%',
  },
  trash:{
    flexDirection:'row',
    justifyContent : 'space-between',
  },
  reviewButton:{
    backgroundColor: '#1F319D',
    width : '23%',
    borderRadius:13,
     justifyContent: 'center',   
  alignItems: 'center',   
  },
  reviewButton_text:{
    color: 'white',            
  fontWeight: '600',
    fontSize: 16,
  },
  reviewNotice:{
    textAlign:'center',
    marginTop: hp("5%"),
    color: 'gray',
  },
  reviewBox:{
    marginTop : hp("4%"),
    padding:hp("1%"),
    width: wp("80%"),
    alignSelf:'center',
    borderWidth:1,
    borderRadius:5,
    borderColor:'#1F319D',
  },
  reviewDate:{
    color : 'gray',
    fontSize: 8,
    textAlign:'right',
  },
  reviewMain :{
    color: 'black',
    fontWeight : 800,
    fontSize:13,
    paddingHorizontal:5
  },
  count_text:{
    color:'black',
    fontSize:15,
  }
})

export default View;