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

export const CreateSemesterSchema = z.object({
  name: z.string().min(4),
  startDate: z.date(),
  endDate: z.date(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  return {
    formData
  }
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
        <Form method={"POST"} id={form.id} onSubmit={form.onSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="name">Name</label>
                <Input id="name" placeholder="Name of your project" />
                <div>{fields.name.errors}</div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="startDate">Start Date</label>
                <Input id="startDate" type="date" />
                <div>{fields.startDate.errors}</div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="endDate">End Date</label>
                <Input id="endDate" type="date" />
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