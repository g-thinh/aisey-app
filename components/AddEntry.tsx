import useEntries from "@/hooks/useEntries";
import { Button, Text } from "react-native";
import { ThemedView } from "./themed-view";

export default function AddEntry() {
  const { createEntry } = useEntries();
  return (
    <ThemedView>
      <Text>Add Entry Component</Text>
      <Button
        title="Add Entry"
        onPress={() =>
          createEntry.mutate({
            userId: 33,
            amount: 100,
            type: "income",
            categoryId: 1,
          })
        }
      />
    </ThemedView>
  );
}
