import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { db } from "@/database";
import { entriesTable } from "@/database/schema";
import useEntries from "@/hooks/useEntries";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

export default function EditEntryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const entryId = Number(params.id);
  const { deleteEntry } = useEntries();
  const { isLoading, data } = useQuery({
    queryKey: [entryId],
    queryFn: () => {
      return db
        .select()
        .from(entriesTable)
        .where(eq(entriesTable.id, entryId))
        .limit(1)
        .all();
    },
  });

  const handleDeleteEntry = async () => {
    await deleteEntry.mutate(entryId);
    router.back();
  };

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Edit Entry"
        headerLeft={<BackButton />}
        headerRight={
          <Pressable
            onPress={handleDeleteEntry}
            style={{
              borderWidth: 1,
              padding: 8,
              borderRadius: 12,
              backgroundColor: "red",
              borderColor: "red",
            }}
          >
            <Feather name="trash-2" size={16} color="white" />
          </Pressable>
        }
      />
      <View
        style={{
          backgroundColor: "white",
          marginHorizontal: 20,
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text>{JSON.stringify(data?.[0], null, 2)}</Text>
      </View>
    </SafeAreaView>
  );
}
