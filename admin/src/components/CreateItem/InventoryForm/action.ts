import { CreateInventoryItemDTO } from "./dto";

export const createInventoryItem = (
  catalog_item_id: string,
  item: CreateInventoryItemDTO
) => {
  return fetch("http://localhost:3002", {
    method: "POST",
    body: JSON.stringify({
      ...item,
      catalog_item_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
