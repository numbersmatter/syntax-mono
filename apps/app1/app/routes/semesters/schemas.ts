// import { schemas } from '@food-mono/firedb';

import { z } from "zod";

// const semesterschemas = schemas.semesters;

// export { semesterschemas };

export const CreateSemesterSchema = z.object({
  name: z.string().min(4),
  startDate: z.date(),
  endDate: z.date(),
});
