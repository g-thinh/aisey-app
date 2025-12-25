import AddEntry from "@/components/AddEntry";
import EntriesList from "@/components/EntriesList";
import UsersList from "@/components/UsersList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: "100%",
        paddingHorizontal: 32,
        paddingVertical: 16,
      }}
    >
      <UsersList />
      <AddEntry />
      <EntriesList />
    </SafeAreaView>
  );
}
