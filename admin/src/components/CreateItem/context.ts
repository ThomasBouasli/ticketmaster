import React from "react";

export enum CreateItemStep {
  CATALOG = "catalog",
  INVENTORY = "inventory",
  SALES = "sales",
  COMPLETE = "complete",
}

export const CreateItemContext = React.createContext<{
  catalog_id: string | null;
  setCatalogId: (catalog_id: string) => void;
  step: CreateItemStep;
  setStep: (step: CreateItemStep) => void;
}>({
  catalog_id: null,
  setCatalogId: () => {},
  step: CreateItemStep.CATALOG,
  setStep: () => {},
});
