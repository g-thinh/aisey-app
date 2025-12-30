import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddEntryScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Add Entry" />
    </SafeAreaView>
  );
}
