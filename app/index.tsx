import Header from "@/components/Header";
import Loading from "@/components/Loading";
import NumpadForm from "@/components/NumpadForm";
import {
  SpendingType,
  SpendingTypeToggle,
} from "@/components/SpendingTypeToggle";
import useEntries from "@/hooks/useEntries";
import useUsers from "@/hooks/useUsers";
import { formatCurrency } from "@/utils/formatCurrency";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [type, setType] = useState(SpendingType.EXPENSE);
  const format = new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric",
  });

  const currentDate = format.format(new Date());

  const { getUsers } = useUsers();
  const { getEntries } = useEntries();

  const totalExpenses = useMemo(() => {
    if (getEntries.data === undefined) return 0;

    // TODO: get sum by DB
    const amounts = getEntries.data
      .filter((view) => view.entries.type === SpendingType.EXPENSE)
      .map((view) => view.entries.amount);

    const expenses = amounts.reduce(
      (sumSoFar, currentValue) => sumSoFar + currentValue,
      0,
    );

    return expenses;
  }, [getEntries.data]);

  if (getUsers.isLoading) {
    return <Loading />;
  }

  // TODO: Create entries
  const INCOME = 1500;
  const EXPENSE = 500;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header
        title={"Home"}
        headerLeft={
          <Pressable
            onPress={() => alert("does nothing")}
            style={{
              borderWidth: 1,
              padding: 8,
              borderRadius: 12,
              backgroundColor: "white",
            }}
          >
            <Feather name="settings" size={16} color="black" />
          </Pressable>
        }
        headerRight={
          <Pressable
            onPress={() => router.navigate("/users")}
            style={{
              borderWidth: 1,
              padding: 8,
              borderRadius: 12,
              backgroundColor: "black",
            }}
          >
            <Feather name="users" size={16} color="white" />
          </Pressable>
        }
      />
      <View
        style={{
          justifyContent: "space-between",
          flex: 1,
          marginHorizontal: 20,
        }}
      >
        <View style={{ gap: 24 }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                {currentDate}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                color: INCOME - totalExpenses > 0 ? "green" : "red",
              }}
            >
              {formatCurrency.format(INCOME - totalExpenses)}
            </Text>
            <Text style={{ opacity: 0.8 }}>Projected savings this month</Text>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={{ fontWeight: "bold" }}>Recent Entries</Text>
            <ScrollView
              style={{
                borderRadius: 4,
                backgroundColor: "white",
                padding: 16,
                minHeight: 100,
                maxHeight: 300,
              }}
              contentContainerStyle={{ gap: 12 }}
            >
              {getEntries.data?.map((view) => {
                return (
                  <View key={view.entries.id} style={{ width: "100%" }}>
                    <Text>
                      <Text
                        style={{
                          color:
                            view.entries.type === SpendingType.EXPENSE
                              ? "red"
                              : "green",
                        }}
                      >
                        {formatCurrency.format(view.entries.amount)}
                      </Text>{" "}
                      added by{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {view.users?.name}
                      </Text>{" "}
                      on{" "}
                      {view.entries.posted_at.toLocaleDateString("en-CA", {
                        dateStyle: "full",
                      })}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
        <View style={{ width: "50%", alignSelf: "center" }}>
          <Pressable
            onPress={() => router.navigate("/add-entry")}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              borderWidth: 2,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: "black",
            }}
          >
            <Feather name="plus" size={24} color="white" />
            <Text style={{ fontSize: 18, color: "white" }}>Add new entry</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
