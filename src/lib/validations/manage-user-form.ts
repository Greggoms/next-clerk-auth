import * as z from "zod";

export const manageUserFormSchema = z.object({
  authId: z.string().min(1, {
    message: "Required. Find it here: https://dashboard.clerk.com/",
  }),
  name: z.string().min(3, { message: "Minimum 3 characters." }),
  email: z.string().email(),
  role: z.string().min(1, { message: "Required." }),
});
