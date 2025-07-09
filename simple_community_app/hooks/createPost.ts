import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성용
import { db, storage } from '../firebaseConfig';

// 이미지 URI를 Firebase Storage에 업로드하고 다운로드 URL 반환
async function uploadImageAsync(uri: string): Promise<string> {
  // fetch로 파일 읽어서 blob 생성
  const response = await fetch(uri);
  const blob = await response.blob();
console.log('blob size:', blob.size);

  // Firebase Storage 참조 생성
  const imageRef = ref(storage, `posts/${uuidv4()}.jpg`);

  // 업로드
  await uploadBytes(imageRef, blob);

  // 다운로드 URL 얻기
  const downloadUrl = await getDownloadURL(imageRef);
  return downloadUrl;
}


export async function createPost(userId: string, text: string, imageUri: string | null,nickname : string) {
  let imageUrl = '';

  if (imageUri) {
    imageUrl = await uploadImageAsync(imageUri);
  }

  await addDoc(collection(db, 'posts'), {
    userId,
    text,
    imageUrl,
    nickname,
    reviewCount : 0,
    love : 0,
    createdAt: serverTimestamp(),
  });
}
