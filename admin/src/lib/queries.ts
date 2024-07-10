import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queries = createQueryKeyStore({
  catalog: {
    all: (page: number, page_size: number) => ({
      queryKey: ["catalog", { page, page_size }],
      queryFn: () =>
        fetch("http://localhost:3001?page=0&page_size=10").then((res) =>
          res.json()
        ),
    }),
  },
  inventory: {
    count: (id: string) => ({
      queryKey: ["inventory", id],
      queryFn: async () => {
        const res = await fetch(`http://localhost:3002/${id}`);

        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error(res.statusText);
        }

        return await res.json();
      },
    }),
    reservationTimeout: () => ({
      queryKey: ["reservation-timeout"],
      queryFn: async () => {
        const res = await fetch(`http://localhost:3002/reservation-timeout`);

        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error(res.statusText);
        }

        return await res.json();
      },
    }),
  },
  sales: {
    find: (id: string) => ({
      queryKey: ["sales", id],
      queryFn: async () => {
        const res = await fetch(`http://localhost:3003/${id}`);

        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error(res.statusText);
        }

        return await res.json();
      },
    }),
  },
});
