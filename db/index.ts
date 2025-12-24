import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

export const localDb = SQLite.openDatabaseSync("local.db");
export const db = drizzle(localDb);
