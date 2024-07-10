import { z } from "zod";

export const create_sales_item_schema = z.object({
  price: z.coerce.number(),
});

export type CreateSalesItemDTO = z.infer<typeof create_sales_item_schema>;
