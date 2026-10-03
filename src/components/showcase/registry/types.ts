import type { ReactNode } from "react";

/** Category ids for the component library */
export type CategoryId =
  | "core"
  | "forms"
  | "navigation"
  | "layout"
  | "overlay"
  | "data"
  | "charts"
  | "advanced"
  | "feedback"
  | "ecommerce"
  | "auth"
  | "dashboard"
  | "utility"
  | "saptapadi";

/** A single documented prop for the API table */
export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** A live demo block on a component page */
export interface DemoDef {
  id: string;
  title: string;
  description?: string;
  /** Source code shown in the code panel */
  code: string;
  /** Renders the live preview */
  render: () => ReactNode;
  /** Span 2 columns in the demo grid */
  wide?: boolean;
  /**
   * Show the Desktop / Tablet / Mobile stage toggle. The preview renders
   * inside a CSS container (`@container`), so components converted to
   * container queries respond to the constrained stage width.
   */
  responsive?: boolean;
}

export interface ComponentDoc {
  /** url-safe unique id, e.g. "button" */
  id: string;
  /** display name, e.g. "Button" */
  name: string;
  category: CategoryId;
  description: string;
  /** other exported names / alias names mapped to this doc */
  aliases?: string[];
  demos: DemoDef[];
  props: PropDef[];
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  description: string;
}

/**
 * A family page groups similar components (e.g. every text input) on ONE
 * page — like Mantine/Ant Design multi-demo pages — instead of one page
 * per component.
 */
export interface FamilyDef {
  /** url-safe unique id, e.g. "text-inputs" */
  id: string;
  /** display name, e.g. "Text Inputs" */
  name: string;
  category: CategoryId;
  description: string;
  /** ComponentDoc ids (real docs, not aliases) shown on this page, in order */
  memberIds: string[];
}
