import EntriesList from "@/components/EntriesList";
import UsersList from "@/components/UsersList";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: "100%",
        paddingHorizontal: 32,
        paddingVertical: 16,
      }}
    >
      <View>
        <Text>Home Screen</Text>
        <Pressable
          style={{
            padding: 10,
            backgroundColor: "red",
            marginTop: 10,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => router.navigate("/add-expense")}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            Add Expense
          </Text>
        </Pressable>
        <Pressable
          style={{
            padding: 10,
            backgroundColor: "green",
            marginTop: 10,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => router.navigate("/add-income")}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>Add Income</Text>
        </Pressable>
      </View>
      {/* <UsersList /> */}
      <EntriesList />
    </SafeAreaView>
  );
}
