import { db, localDb } from "@/db";
import { useColorScheme } from "@/hooks/use-color-scheme";
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

export const unstable_settings = {
  anchor: "(tabs)",
};
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
        <Suspense fallback={<Text>Loading...</Text>}>
          <SQLiteProvider useSuspense databaseName="local.db">
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar style="auto" />
          </SQLiteProvider>
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
