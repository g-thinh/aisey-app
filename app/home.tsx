import BackButton from "@/components/BackButton";
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

export default function DefaultHomeScreen() {
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
    await createEntry.mutate({
      userId,
      categoryId: 1,
      amount,
      type,
      posted_at: new Date(),
    });
  };

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
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <Header
          title={currentDate}
          headerLeft={<BackButton />}
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
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ opacity: 0.8 }}>Projected savings this month</Text>
          <Text
            style={{
              fontSize: 24,
              color: INCOME - totalExpenses > 0 ? "green" : "red",
            }}
          >
            {formatCurrency.format(INCOME - totalExpenses)}
          </Text>
        </View>
        <View style={{ gap: 8, marginHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Income</Text>
            <Text style={{ fontWeight: "bold" }}>Expenses</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              width: "100%",
            }}
          >
            <View
              style={{
                borderRadius: 4,
                backgroundColor: "white",
                flex: 1,
                padding: 12,
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text>Expected</Text>
              <Text style={{ color: "green" }}>
                +{formatCurrency.format(INCOME)}
              </Text>
            </View>
            <View
              style={{
                borderRadius: 4,
                backgroundColor: "white",
                flex: 1,
                padding: 12,
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text>Expected</Text>
              <Text style={{ color: "red" }}>
                -{formatCurrency.format(EXPENSE)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              width: "100%",
            }}
          >
            <View
              style={{
                borderRadius: 4,
                backgroundColor: "white",
                flex: 1,
                padding: 12,
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text>Actual</Text>
              <Text>{formatCurrency.format(INCOME)}</Text>
            </View>
            <View
              style={{
                borderRadius: 4,
                backgroundColor: "white",
                flex: 1,
                padding: 12,
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text>Actual</Text>
              <Text style={{ color: "red" }}>
                -{formatCurrency.format(totalExpenses)}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 16,
            gap: 12,
          }}
        >
          <View style={{ gap: 4 }}>
            <Text style={{ fontWeight: "bold" }}>Recent Entries</Text>
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
          </View>
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
