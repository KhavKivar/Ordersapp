import z from "zod";

export const orderSchema = z.object({
  clientId: z.number(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      pricePerUnit: z.number(),
    }),
  ),
});
export type Order = z.infer<typeof orderSchema>;
