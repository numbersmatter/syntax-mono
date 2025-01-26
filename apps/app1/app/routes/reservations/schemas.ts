import { z } from "zod";

export const ApproveReservaitonSchema = z.object({
  reservationId: z.string().min(14),
  eventId: z.string().min(14),
});
