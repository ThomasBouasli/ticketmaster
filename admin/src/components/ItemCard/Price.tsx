"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Ban, LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

const { format } = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface PriceProps {
  id: string;
}

export const Price = ({ id }: PriceProps) => {
  const query = useQuery(queries.sales.find(id));

  if (query.isLoading)
    return (
      <Badge variant="secondary">
        <LoaderCircle className="animate-spin" />
      </Badge>
    );

  if (!query.data)
    return (
      <Badge variant="default">
        <Ban />
      </Badge>
    );

  return <Badge variant="outline">{format(query.data.price)}</Badge>;
};
