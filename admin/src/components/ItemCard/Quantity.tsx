"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Ban, LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

interface QuantityProps {
  id: string;
}

export const Quantity = ({ id }: QuantityProps) => {
  const query = useQuery(queries.inventory.count(id));

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

  return <Badge variant="outline">{query.data.count} Unds.</Badge>;
};
