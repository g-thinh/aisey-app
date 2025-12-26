import useEntries from "@/hooks/useEntries";
import { ScrollView, Text, View } from "react-native";

export default function EntriesList() {
  const { getEntries } = useEntries();

  if (getEntries.isLoading) return <Text>Loading...</Text>;
  if (getEntries.error)
    return <Text>An error occurred: {getEntries.error.message}</Text>;

  return (
    <ScrollView
      style={{ borderWidth: 2, borderColor: "red", flex: 1, height: "100%" }}
      contentContainerStyle={{
        backgroundColor: "red",
      }}
    >
      {getEntries.data?.map((entry) => (
        <View key={entry.entries.id} style={{ margin: 10 }}>
          <Text>
            {entry.entries.id}
            {entry.entries.amount} by {entry.users?.name} on{" "}
            {new Date(entry.entries.posted_at).toLocaleDateString()} from{" "}
            {entry.categories?.name}
            {entry.entries.type === "income" ? " (Income)" : " (Expense)"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
