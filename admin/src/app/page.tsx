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
    <div className="space-y-8">
      <div className="container mx-auto space-y-4 p-8">
        <Dialog />
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
