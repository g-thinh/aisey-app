import { createUser, getUsers } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Text } from "react-native";
import { ThemedView } from "./themed-view";

export default function UsersList() {
  const queryClient = useQueryClient();
  // fetch users from the database and display them
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // mutation to create a new user
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>An error occurred: {error.message}</Text>;

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
      {users?.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
      <Button
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        title="Add User"
        onPress={() =>
          mutation.mutate({
            name: "Jane Doe",
            age: 30,
            email: "jane.doe@example.com",
          })
        }
      />
    </ThemedView>
  );
}
