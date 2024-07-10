"use client";

import {
  Tabs as TabsComponent,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { CreateItemContext, CreateItemStep } from "../context";

import React, { useContext } from "react";
import CatalogForm from "../CatalogForm/form";
import InventoryForm from "../InventoryForm/form";
import SalesForm from "../SalesForm/form";
import { DialogContext } from "../Dialog";

const Tabs = () => {
  const { close } = useContext(DialogContext);
  const [catalog_id, setCatalogId] = React.useState<string | null>(null);
  const [step, setStep] = React.useState(CreateItemStep.CATALOG);

  if (step === CreateItemStep.COMPLETE) {
    close();
  }

  return (
    <TabsComponent defaultValue="account" value={step}>
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="catalog">
          Catalogo
        </TabsTrigger>
        <TabsTrigger className="w-full" value="inventory">
          Estoque
        </TabsTrigger>
        <TabsTrigger className="w-full" value="sales">
          Vendas
        </TabsTrigger>
      </TabsList>
      <CreateItemContext.Provider
        value={{ catalog_id, setCatalogId, step, setStep }}
      >
        <TabsContent value="catalog">
          <CatalogForm />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryForm />
        </TabsContent>
        <TabsContent value="sales">
          <SalesForm />
        </TabsContent>
      </CreateItemContext.Provider>
    </TabsComponent>
  );
};

export default Tabs;
