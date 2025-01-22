import { parseWithZod } from "@conform-to/zod";
import { foodPantryDb } from "~/services/firestore/firestore-connection.server";
import { CreateSemesterSchema } from "./schemas";
import { data, redirect } from "react-router";

export const listItems = async () => {
  const items = await foodPantryDb.reservations.list();

  return items;
};

export const getSemesters = async () => {
  const allSemesters = await foodPantryDb.semesters.list();

  return allSemesters;
};

export const createSemester = async (formData: FormData) => {
  const submission = parseWithZod(formData, { schema: CreateSemesterSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const newSemesterData = submission.value;
  const newSemesterId = await foodPantryDb.semesters.create(newSemesterData);

  return redirect(`/semesters/${newSemesterId}`);
};

export const getSemester = async ({ id }: { id: string }) => {
  const semester = await foodPantryDb.semesters.read({ id });
  if (!semester) {
    throw data("Semester Not Found", { status: 404 });
  }

  return { semester };
};
