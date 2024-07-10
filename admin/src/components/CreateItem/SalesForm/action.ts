import { CreateSalesItemDTO } from "./dto";

export const createSalesItem = (
  catalog_item_id: string,
  item: CreateSalesItemDTO
) => {
  return fetch("http://localhost:3003", {
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
