import { db, localDb } from "database";
import { useColorScheme } from "hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { Text } from "react-native";
import "react-native-reanimated";
import migrations from "../drizzle/migrations";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  useDrizzleStudio(localDb);
  const { error } = useMigrations(db, migrations);

  const colorScheme = useColorScheme();

  if (error) {
    console.error("Failed to run migrations", error);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
          <Suspense fallback={<Text>Loading...</Text>}>
            <SQLiteProvider useSuspense databaseName="local.db">
              <Stack
                screenOptions={{
                  headerShadowVisible: false,
                }}
              >
                <Stack.Screen
                  name="home"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="add-entry"
                  options={{
                    title: "Add Entry",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="users"
                  options={{ title: "Users", headerShown: false }}
                />
                <Stack.Screen
                  name="entries"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="add-expense"
                  options={{
                    presentation: "modal",
                    title: "Add Expense",
                    headerBackTitle: "Back",
                  }}
                />
                <Stack.Screen
                  name="add-income"
                  options={{ presentation: "modal", title: "Add Income" }}
                />
                <Stack.Screen
                  name="list-entries"
                  options={{ title: "List Entries", headerBackTitle: "Back" }}
                />
              </Stack>
              <StatusBar style="auto" />
            </SQLiteProvider>
          </Suspense>
        </GluestackUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
