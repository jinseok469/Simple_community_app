import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type Props = {
  onImageSelected?: (uri: string) => void;
};

const ImageAttachButton: React.FC<Props> = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("갤러리 접근 권한이 필요합니다!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    
    // assets 배열이 비어있지 않은지 체크 후 첫번째 이미지 URI 가져오기
if (result.assets && result.assets.length > 0) {
  const uri = result.assets[0].uri;
  setSelectedImage(uri);
   if (onImageSelected) {
    onImageSelected(uri);  // 여기 추가해야 부모에 전달됩니다!
  }
}
if (result.canceled) {
  if (onImageSelected) {
    onImageSelected("");
  }
  return;
}

  };

  return (
    <TouchableOpacity style={styles.button} onPress={pickImage} activeOpacity={0.8}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <FontAwesome name="image" size={50} color="#1F319D" />
          <Text style={styles.text}>attach an image!</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height : '100%',
    width: '100%',
    borderWidth: 1,
    borderColor: '#1F319D',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 30,
    color: 'black',
    fontWeight: '700',
    fontSize: 25,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageAttachButton;
