"use client";

import React from "react";
import { ItemCard } from "@/components/ItemCard";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Dialog } from "@/components/CreateItem";

export default function Home() {
  const query = useQuery(queries.catalog.all(0, 10));

  if (query.isLoading) return <div>Loading...</div>;

  return (
    <div className="container space-y-8 mx-auto p-8">
      <Dialog />
      <div className="grid grid-cols-3 gap-4">
        {query.data.map((item: any) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
