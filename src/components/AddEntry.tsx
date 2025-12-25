import useEntries from "@/hooks/useEntries";
import { Pressable, Text, View } from "react-native";

export default function AddEntry() {
  const { createEntry } = useEntries();
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ textAlign: "center" }}>Add Entry Component</Text>
      <Pressable
        onPress={() =>
          createEntry.mutate({
            userId: 33,
            amount: 100,
            type: "income",
            categoryId: 1,
          })
        }
      >
        <Text style={{ fontWeight: "500", fontSize: 16 }}>Add </Text>
      </Pressable>
    </View>
  );
}
