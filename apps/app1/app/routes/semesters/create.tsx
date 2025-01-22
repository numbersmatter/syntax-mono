import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Input } from "~/components/ui/input";
import { Form, useActionData } from "react-router";
// import { semesterschemas } from "./schemas";
import type { Route } from "./+types/create";
import { z } from 'zod';
import { CreateSemesterSchema } from "./schemas";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { createSemester } from "./db.server";



export const action = async ({ request }: Route.ActionArgs) => {
  await requireAuth({ request });
  const formData = await request.formData();

  return createSemester(formData);
}


export default function CreateSemesterPage() {
  const lastResult = useActionData();
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(
        formData,
        {
          schema: CreateSemesterSchema
        }
      );
    },

    // Validate the form on blur event triggered
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Create Semester
          </CardTitle>
          <CardDescription>
            Make a new semester
          </CardDescription>
        </CardHeader>
        <Form method={"POST"} id={form.id} onSubmit={form.onSubmit} >
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="name">Name</label>
                <Input name={"name"} id="name" placeholder="Name of your project" />
                <div>{fields.name.errors}</div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="startDate">Start Date</label>
                <Input name={fields.startDate.name} id={fields.startDate.id} type="date" />
                <div>{fields.startDate.errors}</div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="endDate">End Date</label>
                <Input name={fields.endDate.name} id="endDate" type="date" />
                <div>{fields.endDate.errors}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Deploy</Button>
          </CardFooter>
        </Form>
      </Card>
    </>
  )

}