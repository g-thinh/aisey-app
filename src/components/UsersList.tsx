import useUsers from "@/hooks/useUsers";
import { Button, Text } from "react-native";
import { ThemedView } from "./themed-view";

export default function UsersList() {
  const { createUser, getUsers } = useUsers();

  if (getUsers.isLoading) return <Text>Loading...</Text>;
  if (getUsers.error)
    return <Text>An error occurred: {getUsers.error.message}</Text>;

  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        gap: 16,
        borderWidth: 2,
        borderColor: "red",
      }}
    >
      {getUsers.data?.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
      <Button
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        title="Add User"
        onPress={() =>
          createUser.mutate({
            name: "Jane Doe",
            age: 30,
            email: `${Math.random() * 1000}@example.com`,
          })
        }
      />
    </ThemedView>
  );
}
