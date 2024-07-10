"use client";

import React from "react";
import CircularProgressBar from "../ProgressCircle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { queries } from "@/lib/queries";

interface ReserveProps {
  id: string;
}

const Reserve = ({ id }: ReserveProps) => {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["inventory", "reserve"],
    mutationFn: async () => {
      await fetch(`http://localhost:3002/${id}/reserve`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      client.invalidateQueries(queries.inventory.count(id));
    },
  });

  const onCompleted = () => {
    client.invalidateQueries(queries.inventory.count(id));
  };

  return (
    <div className="flex gap-4">
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Reserving..." : "Reserve"}
      </Button>
      {mutation.isSuccess && <CircularProgressBar onCompleted={onCompleted} />}
    </div>
  );
};

export default Reserve;
