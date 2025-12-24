import UsersList from "@/components/UsersList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, height: "100%" }}>
      <UsersList />
    </SafeAreaView>
  );
}
