import { z } from "zod";

export const create_inventory_item_schema = z.object({
  quantity: z.coerce.number(),
});

export type CreateInventoryItemDTO = z.infer<
  typeof create_inventory_item_schema
>;
