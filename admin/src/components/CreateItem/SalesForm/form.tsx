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

import { create_sales_item_schema, CreateSalesItemDTO } from "./dto";
import { SendHorizontal } from "lucide-react";
import { createSalesItem } from "./action";
import { CreateItemContext, CreateItemStep } from "../context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

const SalesForm = () => {
  const { catalog_id, setStep } = useContext(CreateItemContext);
  const { toast } = useToast();
  const client = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["createSalesItem"],
    mutationFn: (data: CreateSalesItemDTO) =>
      createSalesItem(catalog_id!, data),
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o item",
      });
    },
    onSuccess: () => {
      setStep(CreateItemStep.COMPLETE);
      client.invalidateQueries({
        queryKey: queries.sales.find._def,
      });
    },
  });

  const form = useForm<CreateSalesItemDTO>({
    resolver: zodResolver(create_sales_item_schema),
  });

  const onSubmit = async (data: CreateSalesItemDTO) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input placeholder="Preço" {...field} type="number" />
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

export default SalesForm;
