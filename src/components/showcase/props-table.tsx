"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PropDef } from "./registry/types";

export function PropsTable({ props }: { props: PropDef[] }) {
  if (props.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No documented props — this component primarily forwards native element props.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[160px] text-xs uppercase tracking-wider">Prop</TableHead>
            <TableHead className="w-[280px] text-xs uppercase tracking-wider">Type</TableHead>
            <TableHead className="w-[120px] text-xs uppercase tracking-wider">Default</TableHead>
            <TableHead className="text-xs uppercase tracking-wider">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell className="align-top">
                <code className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                  {prop.name}
                </code>
              </TableCell>
              <TableCell className="align-top">
                <code className="font-mono text-xs text-muted-foreground">{prop.type}</code>
              </TableCell>
              <TableCell className="align-top">
                {prop.default ? (
                  <code className="font-mono text-xs text-gold-foreground">{prop.default}</code>
                ) : (
                  <span className="text-xs text-muted-foreground/60">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-foreground/90">{prop.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
