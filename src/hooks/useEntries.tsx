import { db } from "@/db";
import { categoriesTable, entriesTable, Entry, usersTable } from "@/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

type CreateEntryParams = Pick<
  Entry,
  "userId" | "categoryId" | "amount" | "type"
>;
type UpdateEntryParams = Pick<Entry, "id" | "amount">;

export default function useEntries() {
  const queryClient = useQueryClient();

  const invalidateQueries = () =>
    queryClient.invalidateQueries({ queryKey: ["entries"] });

  const getEntries = useQuery({
    queryKey: ["entries"],
    queryFn: async () => {
      const data = await db
        .select()
        .from(entriesTable)
        .leftJoin(usersTable, eq(usersTable.id, entriesTable.userId))
        .leftJoin(
          categoriesTable,
          eq(categoriesTable.id, entriesTable.categoryId)
        )
        .all();
      return data;
    },
  });

  const createEntry = useMutation({
    mutationFn: ({ userId, categoryId, amount, type }: CreateEntryParams) => {
      return db
        .insert(entriesTable)
        .values({ userId, categoryId, amount, type })
        .returning();
    },
    mutationKey: ["addEntry"],
    onError: (error) => {
      console.error("Error creating entry:", error);
    },
    onSuccess: () => {},
  });

  const updateEntry = useMutation({
    mutationFn: (entry: UpdateEntryParams) => {
      const { id, ...update } = entry;
      return db
        .update(entriesTable)
        .set({ ...update })
        .where(eq(entriesTable.id, id))
        .returning();
    },
    mutationKey: ["updateEntry"],
    onError: (error) => {
      console.error("Error updating entry:", error);
    },
    onSuccess: invalidateQueries,
  });

  const deleteEntry = useMutation({
    mutationFn: (id: Entry["id"]) => {
      return db.delete(entriesTable).where(eq(entriesTable.id, id));
    },
    mutationKey: ["deleteEntry"],
    onError: (error) => {
      console.error("Error deleting entry:", error);
    },
    onSuccess: invalidateQueries,
  });

  return { createEntry, getEntries, updateEntry, deleteEntry };
}
