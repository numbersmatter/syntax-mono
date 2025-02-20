import { z } from "zod";

export const RequestReservationSchema = z.object({
  eventId: z.string().min(15),
  time: z.coerce.number().min(1).max(2359),
  semesterId: z.string().min(15),
});
