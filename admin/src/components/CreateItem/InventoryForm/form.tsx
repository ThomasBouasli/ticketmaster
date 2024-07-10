import React, { useContext } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { create_inventory_item_schema, CreateInventoryItemDTO } from "./dto";
import { SendHorizontal } from "lucide-react";
import { createInventoryItem } from "./action";
import { CreateItemContext, CreateItemStep } from "../context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

const InventoryForm = () => {
  const { catalog_id, setStep } = useContext(CreateItemContext);
  const { toast } = useToast();
  const client = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["createInventoryItem"],
    mutationFn: (data: CreateInventoryItemDTO) =>
      createInventoryItem(catalog_id!, data),
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o item",
      });
    },
    onSuccess: () => {
      setStep(CreateItemStep.SALES);
      client.invalidateQueries({
        queryKey: queries.inventory.count._def,
      });
    },
  });

  const form = useForm<CreateInventoryItemDTO>({
    resolver: zodResolver(create_inventory_item_schema),
  });

  const onSubmit = async (data: CreateInventoryItemDTO) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                  placeholder="Quantidade de Itens"
                  {...field}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="space-x-4">
          <SendHorizontal />
          <span>Enviar</span>
        </Button>
      </form>
    </Form>
  );
};

export default InventoryForm;
