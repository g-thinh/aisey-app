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
import { useState } from "react";
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
  const { getEntries, createEntry } = useEntries();

  const handleCreateEntry = async (amount: number) => {
    if (getUsers.data === undefined) return;
    const userId = getUsers.data[0].id;
    await createEntry.mutate({ userId, categoryId: 1, amount, type });
  };

  if (getUsers.isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <Header
          title={currentDate}
          headerLeft={
            <Pressable
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

        <View style={{ marginHorizontal: "auto", gap: 12 }}>
          <ScrollView
            style={{
              borderRadius: 4,
              backgroundColor: "white",
              padding: 16,
              maxHeight: 100,
              minHeight: 100,
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
          <SpendingTypeToggle type={type} setType={setType} />
          <NumpadForm
            onValueChange={(value) => {
              handleCreateEntry(value);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
