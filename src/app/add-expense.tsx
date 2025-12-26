import useEntries from "@/hooks/useEntries";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddExpenseModal() {
  const [value, setValue] = useState("");
  const { createEntry } = useEntries();

  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    // These ensure that $5 stays $5 and doesn't force $5.00 immediately
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const handleChange = (text: string) => {
    // 1. Remove everything except numbers and one decimal point
    let clean = text.replace(/[^0-9.]/g, "");

    // 2. Prevent multiple decimals (e.g., 5.2.5 becomes 5.25)
    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts[1];
    }

    // 3. Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      clean = parts[0] + "." + parts[1].slice(0, 2);
    }

    setValue(clean);
  };

  const getDisplayValue = () => {
    if (!value) return "";

    // If the user just typed a dot (e.g., "5."), don't format it yet
    // or they won't be able to see the dot to type cents.
    if (value.endsWith(".")) {
      const parts = value.split(".");
      const formattedBeforeDot = formatter.format(Number(parts[0]));
      return `${formattedBeforeDot}.`;
    }

    // If there are decimals, we split them to ensure we don't lose trailing zeros
    // (e.g., so "$5.20" doesn't accidentally become "$5.2")
    if (value.includes(".")) {
      const [whole, decimal] = value.split(".");
      const formattedWhole = formatter.format(Number(whole));
      return `${formattedWhole}.${decimal}`;
    }

    return formatter.format(Number(value));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View>
        <View
          style={{ width: "100%", flexDirection: "row", paddingHorizontal: 32 }}
        >
          <TextInput
            keyboardType="numeric"
            value={getDisplayValue()}
            onChangeText={handleChange}
            placeholder="$0"
            returnKeyType="done"
            style={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 8,
              padding: 12,
              fontSize: 18,
              width: "100%",
              textAlign: "center",
            }}
          />
        </View>
      </View>
      <View style={{ marginBottom: 16 }}>
        <Pressable
          style={{ padding: 12, backgroundColor: "black", borderRadius: 8 }}
          onPress={() =>
            createEntry.mutate({
              userId: 33,
              amount: 100,
              type: "income",
              categoryId: 1,
            })
          }
        >
          <Text style={{ fontWeight: "500", fontSize: 18, color: "white" }}>
            Submit Expense
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
