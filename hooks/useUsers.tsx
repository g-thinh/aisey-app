import { User, usersTable } from "@/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "../db";

type CreateUserParams = Pick<User, "name" | "age" | "email">;
type UpdateUserParams = Pick<User, "id" | "name" | "age" | "email">;

export default function useUsers() {
  const queryClient = useQueryClient();

  const invalidateQueries = () =>
    queryClient.invalidateQueries({ queryKey: ["users"] });

  const getUsers = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return db.select().from(usersTable).all();
    },
  });

  const createUser = useMutation({
    mutationFn: ({ name, age, email }: CreateUserParams) => {
      return db.insert(usersTable).values({ name, age, email }).returning();
    },
    mutationKey: ["createUser"],
    onError: (error) => {
      console.error("Error creating user:", error);
    },
    onSuccess: invalidateQueries,
  });

  const updateUser = useMutation({
    mutationFn: (user: UpdateUserParams) => {
      const { id, ...update } = user;
      return db
        .update(usersTable)
        .set({ ...update })
        .where(eq(usersTable.id, id))
        .returning();
    },
    mutationKey: ["updateUser"],
    onError: (error) => {
      console.error("Error updating user:", error);
    },
    onSuccess: invalidateQueries,
  });

  const deleteUser = useMutation({
    mutationFn: (id: User["id"]) => {
      return db.delete(usersTable).where(eq(usersTable.id, id));
    },
    mutationKey: ["deleteUser"],
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
    onSuccess: invalidateQueries,
  });
  return { createUser, getUsers, updateUser, deleteUser };
}
