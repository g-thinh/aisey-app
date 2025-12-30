import Header from "@/components/Header";
import {
  SpendingType,
  SpendingTypeToggle,
} from "@/components/SpendingTypeToggle";
import useEntries from "@/hooks/useEntries";
import useUsers from "@/hooks/useUsers";
import { formatCurrency } from "@/utils/formatCurrency";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import NumpadForm from "@/components/NumpadForm";

export default function AddEntryScreen() {
  const router = useRouter();
  const [type, setType] = useState<SpendingType>(SpendingType.EXPENSE);
  const [amount, setAmount] = useState("");
  const { getUsers } = useUsers();
  const { createEntry } = useEntries();
  const [date, setDate] = useState(new Date());

  const handleCreateEntry = async (value?: number) => {
    if (getUsers.data === undefined) return;

    const enteredAmount = value ? value : parseFloat(amount);

    const userId = getUsers.data[0].id;
    await createEntry.mutate({
      userId,
      categoryId: 1,
      amount: enteredAmount,
      type,
      posted_at: date,
    });
    router.back();
  };

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

    setAmount(clean);
  };

  const getDisplayValue = () => {
    if (!amount) return "";

    // If the user just typed a dot (e.g., "5."), don't format it yet
    // or they won't be able to see the dot to type cents.
    if (amount.endsWith(".")) {
      const parts = amount.split(".");
      const formattedBeforeDot = formatCurrency.format(Number(parts[0]));
      return `${formattedBeforeDot}.`;
    }

    // If there are decimals, we split them to ensure we don't lose trailing zeros
    // (e.g., so "$5.20" doesn't accidentally become "$5.2")
    if (amount.includes(".")) {
      const [whole, decimal] = amount.split(".");
      const formattedWhole = formatCurrency.format(Number(whole));
      return `${formattedWhole}.${decimal}`;
    }

    return formatCurrency.format(Number(amount));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Add Entry"
        headerLeft={
          <Pressable onPress={router.back}>
            <Feather name="arrow-left" size={24} color="black" />
          </Pressable>
        }
        headerRight={
          <Pressable
            onPress={() => handleCreateEntry()}
            disabled={isNaN(parseFloat(amount))}
          >
            <Feather
              name="check"
              size={24}
              color={isNaN(parseFloat(amount)) ? "grey" : "black"}
            />
          </Pressable>
        }
      />
      <View style={{ marginHorizontal: 16, gap: 12 }}>
        <SpendingTypeToggle type={type} setType={setType} />
        <NumpadForm onValueChange={(value) => handleCreateEntry(value)} />
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 12,
            paddingHorizontal: 16,
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 60,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Amount</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "gray",
              minWidth: 100,
              fontSize: 16,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 4,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
            placeholder="$0"
            keyboardType="numeric"
            returnKeyType="next"
            value={getDisplayValue()}
            onChangeText={handleChange}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 12,
            paddingHorizontal: 16,
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 60,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Category</Text>
          <Pressable onPress={() => alert("do nothing")}>
            <Feather name="chevron-right" size={24} color="black" />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 12,
            paddingHorizontal: 16,
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 60,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>User</Text>
          <Pressable
            onPress={() => alert("implement change user")}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            {getUsers.data && (
              <Text style={{ color: "grey", fontSize: 16 }}>
                {getUsers.data[0].name}
              </Text>
            )}
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 12,
            paddingHorizontal: 16,
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 60,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Date</Text>

          <DateTimePicker
            value={date}
            mode={"date"}
            onChange={(_event, selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 12,
            paddingHorizontal: 16,
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 60,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Frequency</Text>
          <Pressable onPress={() => alert("do nothing")}>
            <Feather name="chevron-right" size={24} color="black" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
