import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { Form, useParams } from "react-router"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { UpdateAdultsSchema } from "./schemas"
import type { Route } from "./+types/update-adults"
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server"



export async function action({ request, params }: Route.ActionArgs) {
  await requireAuth({ request });
  const formData = await request.formData();


  return { formData }
}


export default function UpdateAdults() {

  return (
    <div>
      <UpdateAdultsForm />
    </div>
  )
}

function UpdateAdultsForm() {
  const { userId } = useParams()

  const [form, fields] = useForm({
    id: "update-adults",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UpdateAdultsSchema })
    },
    defaultValue: {
      adults: 1,
    },
  })


  return (
    <Form method="post"
      {...getFormProps(form)}
      className="border mt-3"
    >

      <div className="grid gap-4 py-4 px-4">

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fields.adults.id} className="text-right">
            Number of Adults
          </Label>
          <Input
            className="col-span-3 max-w-xs"
            {...getInputProps(fields.adults, { type: "number" })}
            key={fields.adults.key}
          />
          <input hidden name="userId" value={userId} />
          <div className="text-red-500 col-start-2 col-span-3">
            {fields.adults.errors}
          </div>
        </div>

      </div>
      <div className="flex flex-row justify-center py-4" >
        <Button name="intent" value="updateAdults" type="submit">
          Update
        </Button>
      </div>
    </Form>
  )
}


