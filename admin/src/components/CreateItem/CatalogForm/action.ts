import { CreateCatalogItemDTO } from "./dto";

export const createCatalogItem = (item: CreateCatalogItemDTO) => {
  return fetch("http://localhost:3001", {
    method: "POST",
    body: JSON.stringify(item),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
