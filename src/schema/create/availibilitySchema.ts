//buid me a schema for availibility for zod check
import { z } from "zod";
export const availibilitySchema = z.object({
    memberId: z.string(),
    day: z.string().refine((data) => {
        if (
            ![
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ].includes(data)
        ) {
            throw new Error("Invalid day");
        }
        return true;
    }),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
});
export type Availibility = z.infer<typeof availibilitySchema>;
