import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable onPress={router.back}>
      <Feather name="arrow-left" size={24} color="black" />
    </Pressable>
  );
}
