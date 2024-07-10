import { z } from "zod";

export const create_catalog_item_schema = z.object({
  name: z.string(),
  description: z.string(),
});

export type CreateCatalogItemDTO = z.infer<typeof create_catalog_item_schema>;
