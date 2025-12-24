import useEntries from "@/hooks/useEntries";
import { Text } from "react-native";
import { ThemedView } from "./themed-view";

export default function EntriesList() {
  const { getEntries } = useEntries();

  if (getEntries.isLoading) return <Text>Loading...</Text>;
  if (getEntries.error)
    return <Text>An error occurred: {getEntries.error.message}</Text>;

  return (
    <ThemedView>
      <Text>Entries List Component</Text>
      <ThemedView>
        {getEntries.data?.map((entry) => (
          <Text key={entry.entries.id}>
            {entry.entries.amount} by {entry.users?.name} on{" "}
            {new Date(entry.entries.posted_at).toLocaleDateString()} from{" "}
            {entry.categories?.name}
          </Text>
        ))}
      </ThemedView>
    </ThemedView>
  );
}
