import { z } from 'zod';

export const ChangeStageSchema = z.object({
  eventId: z.string().min(14),
  stage: z.enum([
    "planning",
    "open-for-requests",
    "open-for-pickups",
    "event-finished",
  ]),
});

export const AddPickupTime = z.object({
  eventId: z.string().min(14),
  time: z.string().refine((val) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(val);
  }, {
    message: "Invalid time format. Expected HH:MM in 24-hour format."
  })
});

export const RemovePickupTime = z.object({
  eventId: z.string().min(14),
  timeId:z.string().min(3)
})

export const CreateNewEventSchema = z.object({
 name: z.string().min(3),
  type: z.enum(['pickup', 'drive-thru', 'error']),
  eventDate: z.string().transform((val) => new Date(val)),
  semesterId: z.string().min(20),
});