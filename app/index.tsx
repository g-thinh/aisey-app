import Header from "@/components/Header";
import { SpendingType } from "@/components/SpendingTypeToggle";
import { db } from "@/database";
import * as schema from "@/database/schema";
import { formatCurrency } from "@/utils/formatCurrency";
import Feather from "@expo/vector-icons/Feather";
import { and, desc, eq, gte, lt, lte, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getMonthBounds = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    start: new Date(year, month, 1, 0, 0, 0, 0),
    end: new Date(year, month + 1, 0, 23, 59, 59, 999),
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const format = new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric",
  });
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const monthRange = useMemo(
    () => getMonthBounds(currentMonth),
    [currentMonth],
  );

  const { data: entries } = useLiveQuery(
    db
      .select({
        id: schema.entriesTable.id,
        type: schema.entriesTable.type,
        amount: schema.entriesTable.amount,
        posted_at: schema.entriesTable.posted_at,
        user_name: schema.usersTable.name,
      })
      .from(schema.entriesTable)
      .leftJoin(
        schema.usersTable,
        eq(schema.usersTable.id, schema.entriesTable.userId),
      )
      .leftJoin(
        schema.categoriesTable,
        eq(schema.categoriesTable.id, schema.entriesTable.categoryId),
      )
      .orderBy(desc(schema.entriesTable.posted_at))
      .where(
        and(
          gte(schema.entriesTable.posted_at, monthRange.start),
          lt(schema.entriesTable.posted_at, monthRange.end),
        ),
      )
      .limit(5),
    [monthRange],
  );

  const { data: summary } = useLiveQuery(
    db
      .select({
        totalIncome:
          sql<number>`COALESCE(SUM(CASE WHEN ${schema.entriesTable.type} = ${SpendingType.INCOME} THEN ${schema.entriesTable.amount} ELSE 0 END),0)`.mapWith(
            Number,
          ),
        totalExpenses:
          sql<number>`COALESCE(SUM(CASE WHEN ${schema.entriesTable.type} = ${SpendingType.EXPENSE} THEN ${schema.entriesTable.amount} ELSE 0 END),0)`.mapWith(
            Number,
          ),
      })
      .from(schema.entriesTable)
      .where(
        and(
          gte(schema.entriesTable.posted_at, monthRange.start),
          lte(schema.entriesTable.posted_at, monthRange.end),
        ),
      ),
    [monthRange],
  );
  const savingsSummary = summary?.[0];
  const totalSavings =
    savingsSummary?.totalIncome - savingsSummary?.totalExpenses;

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header
        title={format.format(currentMonth)}
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
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Pressable onPress={prevMonth}>
              <Feather name="chevrons-left" size={24} color="black" />
            </Pressable>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: totalSavings > 0 ? "green" : "red",
                }}
              >
                {formatCurrency.format(totalSavings)}
              </Text>
              <Text style={{ opacity: 0.8 }}>Projected savings this month</Text>
            </View>
            <Pressable onPress={nextMonth}>
              <Feather name="chevrons-right" size={24} color="black" />
            </Pressable>
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
              <Text style={{ fontWeight: "bold" }}>Entries</Text>
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
              {entries?.map((entry) => {
                return (
                  <View key={entry.id} style={{ width: "100%" }}>
                    <Text>
                      <Text
                        style={{
                          color:
                            entry.type === SpendingType.EXPENSE
                              ? "red"
                              : "green",
                        }}
                      >
                        {formatCurrency.format(entry.amount)}
                      </Text>{" "}
                      added by{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {entry.user_name}
                      </Text>{" "}
                      on{" "}
                      {entry.posted_at.toLocaleDateString("en-CA", {
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
