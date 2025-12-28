import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import NumpadForm from "@/components/NumpadForm";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric",
  });

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        paddingTop: insets.top,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Heading size="2xl">{formatter.format(new Date())}</Heading>
          <Text>
            Savings this month: <Text>$50.00</Text>
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 24,
            paddingHorizontal: 16,
            flexDirection: "row",
            gap: 24,
            justifyContent: "center",
          }}
        >
          <Pressable
            style={{
              padding: 10,
              backgroundColor: "red",

              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => router.navigate("/add-expense")}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>
              + Expense
            </Text>
          </Pressable>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: "green",

              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => router.navigate("/add-income")}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>+ Income</Text>
          </Pressable>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: "blue",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => router.navigate("/list-entries")}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>
              See Entries
            </Text>
          </Pressable>
        </View>

        <NumpadForm
          onValueChange={(value) => console.log("[NumpadForm]: value", value)}
        />
      </View>
    </View>
  );
}
