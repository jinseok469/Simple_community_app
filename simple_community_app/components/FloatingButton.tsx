import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function FloatingButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push("/create")} // 🔗 게시물 작성 화면으로 이동
    >
      <FontAwesome name="plus" size={35} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 30,
    bottom: 40,
    backgroundColor: "#1F319D",
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // 안드로이드 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
