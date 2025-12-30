import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { SpendingType } from "@/components/SpendingTypeToggle";
import { db } from "@/database";
import { categoriesTable, entriesTable, usersTable } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import useUsers from "@/hooks/useUsers";
import { formatCurrency } from "@/utils/formatCurrency";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const format = new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric",
  });

  const currentDate = format.format(new Date());

  const { getUsers } = useUsers();
  const getEntries = useQuery({
    queryKey: ["recent-entries"],
    queryFn: async () => {
      const data = await db
        .select()
        .from(entriesTable)
        .leftJoin(usersTable, eq(usersTable.id, entriesTable.userId))
        .leftJoin(
          categoriesTable,
          eq(categoriesTable.id, entriesTable.categoryId),
        )
        .orderBy(desc(entriesTable.posted_at))
        .limit(5)
        .all();
      return data;
    },
  });

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

  const totalIncome = useMemo(() => {
    if (getEntries.data === undefined) return 0;

    // TODO: get sum by DB
    const amounts = getEntries.data
      .filter((view) => view.entries.type === SpendingType.INCOME)
      .map((view) => view.entries.amount);

    const income = amounts.reduce(
      (sumSoFar, currentValue) => sumSoFar + currentValue,
      0,
    );

    return income;
  }, [getEntries.data]);

  const pendingCount = useMemo(() => {
    if (getEntries.data === undefined) return 0;

    // TODO: get sum by DB
    const pending = getEntries.data.filter(
      (view) => view.entries.posted_at >= new Date(),
    );

    return pending.length;
  }, [getEntries.data]);

  const postedCount = useMemo(() => {
    if (getEntries.data === undefined) return 0;

    // TODO: get sum by DB
    const pending = getEntries.data.filter(
      (view) => view.entries.posted_at <= new Date(),
    );

    return pending.length;
  }, [getEntries.data]);

  if (getUsers.isLoading) {
    return <Loading />;
  }

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
            onPress={() => router.navigate("/home")}
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
                color: totalIncome - totalExpenses > 0 ? "green" : "red",
              }}
            >
              {formatCurrency.format(totalIncome - totalExpenses)}
            </Text>
            <Text style={{ opacity: 0.8 }}>Projected savings this month</Text>
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
              <Text>Pending</Text>
              <Text>{pendingCount}</Text>
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
              <Text>Posted</Text>
              <Text>{postedCount}</Text>
            </View>
          </View>
          <View style={{ gap: 4 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Recent Entries</Text>
              <Pressable
                onPress={() => router.navigate("/entries")}
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 12,
                  backgroundColor: "white",
                }}
              >
                <Feather name="list" size={16} color="black" />
              </Pressable>
            </View>

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
                      {view.entries.created_at.toLocaleDateString("en-CA", {
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
