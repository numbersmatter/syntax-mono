import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { useState } from "react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { DropdownMenuRadioGroup } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import type { Route } from "./+types/update-students";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { addStudent } from "./data.server";
import { parseWithZod } from "@conform-to/zod";
import { AddStudentSchema } from "./schemas";



export async function action({ request, params }: Route.ActionArgs) {
  const { user } = await requireAuth({ request });
  const formData = await request.formData();

  return await addStudent({ formData, userId: params.userId })

}



export default function UpdateStudents() {

  return (
    <div>
      <CreateStudentForm formId="add-student" />
    </div>
  );
}


function CreateStudentForm({ formId }: { formId: string }) {
  const [school, setSchool] = useState("");




  const [form, fields] = useForm({
    id: formId,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AddStudentSchema })
    },
    defaultValue: {
      fname: "",
      lname: "",
      school: "",
    },
  })



  return (
    <Form method="post"
      {...getFormProps(form)}
      className="border mt-3"
    >

      <div className="grid gap-4 py-4">
        <h2 className="text-lg font-semibold text-center">Add Student Form</h2>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fields.fname.id} className="text-right">
            First Name
          </Label>
          <Input
            className="col-span-3"
            {...getInputProps(fields.fname, { type: "text" })}
            key={fields.fname.key}
          />
          <div className="text-red-500 col-start-2 col-span-3">
            {fields.fname.errors}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fields.lname.id} className="text-right">
            Last Name
          </Label>
          <Input

            className="col-span-3"
            {...getInputProps(fields.lname, { type: "text" })}
          />
          <div className="text-red-500 col-start-2 col-span-3">
            {fields.lname.errors}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            School
          </Label>
          <div className="col-span-3">
            <RadioGroup value={school} onValueChange={setSchool}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tps" id="tps" />
                <Label htmlFor="tps">Thomasville Primary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lde" id="lde" />
                <Label htmlFor="lde">Liberty Drive Elementary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tms" id="tms" />
                <Label htmlFor="tms">Thomasville Middle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ths" id="ths" />
                <Label htmlFor="tms">Thomasville High</Label>
              </div>
            </RadioGroup>
            <input type="hidden" name="school" value={school} readOnly />
          </div>
          <div className="text-red-500 col-span-3 col-start-2">
            {fields.school.errors}
          </div>
        </div>

      </div>
      <div className="flex flex-row justify-center py-4" >
        <Button name="intent" value="addStudent" type="submit">
          Add Student
        </Button>
      </div>
    </Form>
  )
}
