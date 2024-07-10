"use client";

import React from "react";

import {
  Dialog as DialogComponent,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tabs from "../Tabs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DialogContext = React.createContext<{
  close: () => void;
}>({
  close: () => {},
});

export const Dialog = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogContext.Provider value={{ close: () => setOpen(false) }}>
      <DialogComponent open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar item</DialogTitle>
          </DialogHeader>
          <Tabs />
        </DialogContent>
      </DialogComponent>
    </DialogContext.Provider>
  );
};
