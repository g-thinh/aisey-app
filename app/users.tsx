import Header from "@/components/Header";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import useUsers from "@/hooks/useUsers";
import Loading from "@/components/Loading";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function UsersScreen() {
  const router = useRouter();
  const { getUsers, createUser } = useUsers();

  const handleCreateUser = async () => {
    await createUser.mutate({
      name: "Test",
      email: "test@example.com",
      age: 30,
    });
  };

  if (getUsers.isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backdropFilter: "blur(2px)" }}>
      <Header
        title={"Users"}
        headerLeft={
          <Pressable onPress={router.back}>
            <Feather name="arrow-left" size={24} color="black" />
          </Pressable>
        }
        headerRight={
          <Pressable
            onPress={handleCreateUser}
            style={{
              borderWidth: 1,
              padding: 8,
              borderRadius: 12,
              backgroundColor: "white",
            }}
          >
            <AntDesign name="user-add" size={16} color="black" />
          </Pressable>
        }
      />
      <View style={{ margin: 20, gap: 6 }}>
        {getUsers.data?.map((user) => {
          return (
            <View
              key={user.id}
              style={{
                borderRadius: 4,
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: "white",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ fontSize: 16 }}>{user.name}</Text>
              </View>
              <AntDesign name="check" size={18} color="black" />
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
