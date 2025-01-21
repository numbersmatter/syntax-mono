import { foodPantryDb } from "~/services/firestore/firestore-connection.server";

export const listItems = async () => {
  const items = await foodPantryDb.reservations.list();

  return items;
};
