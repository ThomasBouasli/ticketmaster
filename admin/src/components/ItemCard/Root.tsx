import React from "react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Price } from "./Price";
import { Quantity } from "./Quantity";
import Reserve from "./Reserve";

interface RootProps {
  id: string;
  name: string;
  description: string;
}

export const Root = ({ id, name, description }: RootProps) => {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <Reserve id={id} />
      </CardHeader>
      <CardFooter className="gap-4">
        <Price id={id} />
        <Quantity id={id} />
      </CardFooter>
    </Card>
  );
};
