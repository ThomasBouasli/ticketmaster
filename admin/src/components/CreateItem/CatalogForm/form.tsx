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

import { create_catalog_item_schema, CreateCatalogItemDTO } from "./dto";
import { SendHorizontal } from "lucide-react";
import { createCatalogItem } from "./action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateItemContext, CreateItemStep } from "../context";
import { queries } from "@/lib/queries";

const CatalogForm = () => {
  const { setCatalogId, setStep } = useContext(CreateItemContext);
  const { toast } = useToast();

  const client = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["createCatalogItem"],
    mutationFn: (data: CreateCatalogItemDTO) => createCatalogItem(data),
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o item",
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setCatalogId(data.id);
      setStep(CreateItemStep.INVENTORY);

      client.invalidateQueries({
        queryKey: queries.catalog.all._def,
      });
    },
  });

  const form = useForm<CreateCatalogItemDTO>({
    resolver: zodResolver(create_catalog_item_schema),
  });
  const onSubmit = async (data: CreateCatalogItemDTO) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição" {...field} />
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

export default CatalogForm;
