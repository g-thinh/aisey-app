import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
          <Text style={{ fontSize: 32 }}>{formatter.format(new Date())}</Text>
          <Text style={{ fontSize: 18, color: "gray" }}>
            Savings this month:{" "}
            <Text style={{ fontSize: 18, color: "green" }}>$50.00</Text>
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
        {/* <View style={{ backgroundColor: "red" }}>
          <Text>Home Screen</Text>
        </View> */}
      </View>
      {/* <View>
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
      </View> */}
      {/* <UsersList /> */}
      {/* <EntriesList /> */}
    </View>
  );
}
