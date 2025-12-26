import { useSafeAreaInsets } from "react-native-safe-area-context";
import useEntries from "@/hooks/useEntries";
import { ScrollView, Text, View } from "react-native";

export default function ListEntriesScreen() {
  const { getEntries } = useEntries();
  const insets = useSafeAreaInsets();

  if (getEntries.isLoading) return <Text>Loading...</Text>;
  if (getEntries.error)
    return <Text>An error occurred: {getEntries.error.message}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ borderWidth: 2, flex: 1, height: "100%" }}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        {getEntries.data?.map((entry, index) => (
          <View key={entry.entries.id}>
            <Text>
              {index + 1} {entry.entries.amount} by {entry.users?.name} on{" "}
              {new Date(entry.entries.posted_at).toLocaleDateString()} from{" "}
              {entry.categories?.name}
              {entry.entries.type === "income" ? " (Income)" : " (Expense)"}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
