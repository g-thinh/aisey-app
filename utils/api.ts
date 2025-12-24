import { usersTable } from "../db/schema";
import { db } from "./db";

// This function runs exclusively on the server
export const getUsers = async () => {
  const data = await db.select().from(usersTable);
  return data;
};

export const createUser = async ({
  name,
  age,
  email,
}: {
  name: string;
  age: number;
  email: string;
}) => {
  const newUser = await db
    .insert(usersTable)
    .values({ name, age, email })
    .returning();
  return newUser;
};
