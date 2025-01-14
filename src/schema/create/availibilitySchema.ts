//buid me a schema for availibility for zod check
import { z } from "zod";
export const availibilitySchema = z.object({
    memberId: z.string(),
    day: z.string().regex(
        /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/,
        // /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/,
    ),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
});
export type Availibility = z.infer<typeof availibilitySchema>;
