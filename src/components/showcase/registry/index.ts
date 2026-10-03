import type { ComponentDoc, CategoryDef, FamilyDef } from "./types";

import { coreDocs } from "./core";
import { forms_1Docs } from "./forms-1";
import { forms_2Docs } from "./forms-2";
import { navigationDocs } from "./navigation";
import { layoutDocs } from "./layout";
import { overlayDocs } from "./overlay";
import { dataDocs } from "./data";
import { charts_1Docs } from "./charts-1";
import { charts_2Docs } from "./charts-2";
import { advanced_1Docs } from "./advanced-1";
import { advanced_2Docs } from "./advanced-2";
import { feedbackDocs } from "./feedback";
import { ecommerceDocs } from "./ecommerce";
import { authDocs } from "./auth";
import { dashboardDocs } from "./dashboard";
import { utilityDocs } from "./utility";
import { saptapadiDocs } from "./saptapadi";
import { FAMILIES, RESPONSIVE_DOCS } from "./families";

export * from "./types";
export { FAMILIES, RESPONSIVE_DOCS };

export const CATEGORIES: CategoryDef[] = [
  { id: "core", label: "Core", description: "Fundamental building blocks — buttons, badges, avatars, overlays." },
  { id: "forms", label: "Forms", description: "Inputs, pickers, selection controls and form layout." },
  { id: "navigation", label: "Navigation", description: "Menus, tabs, breadcrumbs, steppers and command interfaces." },
  { id: "layout", label: "Layout", description: "Structural primitives, cards, accordions, lists and media." },
  { id: "overlay", label: "Overlay", description: "Dialogs, drawers, modals, toasts and floating layers." },
  { id: "data", label: "Data Display", description: "Tables, trees, timelines, stats and key-value views." },
  { id: "charts", label: "Charts", description: "Lightweight, theme-aware visualizations built on Recharts." },
  { id: "advanced", label: "Advanced", description: "Composite productivity surfaces — kanban, editors, toolbars." },
  { id: "feedback", label: "Feedback", description: "Alerts, state views and progress communication." },
  { id: "ecommerce", label: "E-commerce", description: "Product, cart, pricing and checkout experiences." },
  { id: "auth", label: "Authentication", description: "Ready-made auth forms and verification flows." },
  { id: "dashboard", label: "Dashboard", description: "Metric cards, KPI grids and dashboard compositions." },
  { id: "utility", label: "Developer / Utility", description: "Copy, status, code and inspection utilities." },
  { id: "saptapadi", label: "Saptapadi Composites", description: "The live matrimonial app's own composites — profile cards, dossier modal, concierge and more." },
];

const allDocs: ComponentDoc[] = [
  ...coreDocs,
  ...forms_1Docs,
  ...forms_2Docs,
  ...navigationDocs,
  ...layoutDocs,
  ...overlayDocs,
  ...dataDocs,
  ...charts_1Docs,
  ...charts_2Docs,
  ...advanced_1Docs,
  ...advanced_2Docs,
  ...feedbackDocs,
  ...ecommerceDocs,
  ...authDocs,
  ...dashboardDocs,
  ...utilityDocs,
  ...saptapadiDocs,
];

/** alias doc id → the real doc id it points at */
export const ALIAS_TO_REAL: Record<string, string> = {};

/** Expand aliases into their own synthetic docs so every name in the spec is reachable */
function expandAliases(docs: ComponentDoc[]): ComponentDoc[] {
  const realIds = new Set(docs.map((d) => d.id));
  const out: ComponentDoc[] = [];
  const seenIds = new Set<string>();
  for (const doc of docs) {
    out.push(doc);
    seenIds.add(doc.id);
    for (const alias of doc.aliases ?? []) {
      const aliasId = alias.toLowerCase().replace(/\s+/g, "-");
      // skip aliases that would collide with a real doc or an already-created entry
      if (realIds.has(aliasId) || seenIds.has(aliasId)) continue;
      seenIds.add(aliasId);
      ALIAS_TO_REAL[aliasId] = doc.id;
      out.push({
        ...doc,
        id: aliasId,
        name: alias,
        description: doc.description,
        demos: doc.demos,
        props: doc.props,
      });
    }
  }
  return out;
}

export const COMPONENT_DOCS: ComponentDoc[] = expandAliases(allDocs);

// Mark full-surface demos as responsive (stage toggle in the docs preview)
for (const doc of COMPONENT_DOCS) {
  if (RESPONSIVE_DOCS.has(doc.id)) {
    for (const demo of doc.demos) demo.responsive = true;
  }
}

export function getDocsByCategory(category: string): ComponentDoc[] {
  return COMPONENT_DOCS.filter((d) => d.category === category);
}

export function getDoc(id: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((d) => d.id === id);
}

export const TOTAL_COMPONENTS = COMPONENT_DOCS.length;

/* ------------------------------ Families ------------------------------ */

export function getFamily(id: string): FamilyDef | undefined {
  return FAMILIES.find((f) => f.id === id);
}

export function getFamiliesByCategory(category: string): FamilyDef[] {
  return FAMILIES.filter((f) => f.category === category);
}

/** Resolve any doc id (real or alias) to the family page that contains it. */
export function getFamilyForDoc(docId: string): FamilyDef | undefined {
  const realId = ALIAS_TO_REAL[docId] ?? docId;
  const doc = getDoc(realId);
  if (!doc) return undefined;
  const byMembers = FAMILIES.find((f) => f.memberIds.includes(realId));
  if (byMembers) return byMembers;
  // safety net: ad-hoc single-member family for any uncovered doc
  return {
    id: `doc-${realId}`,
    name: doc.name,
    category: doc.category,
    description: doc.description,
    memberIds: [realId],
  };
}

/** Member docs of a family, resolved to real (non-alias) ComponentDocs. */
export function getFamilyMembers(family: FamilyDef): ComponentDoc[] {
  const seen = new Set<string>();
  const members: ComponentDoc[] = [];
  for (const id of family.memberIds) {
    const realId = ALIAS_TO_REAL[id] ?? id;
    if (seen.has(realId)) continue;
    seen.add(realId);
    const doc = getDoc(realId);
    if (doc) members.push(doc);
  }
  return members;
}
