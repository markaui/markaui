import {
  Accessibility,
  Braces,
  Container,
  Gauge,
  Paintbrush,
  Package,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Paintbrush,
    title: "12 luxury themes",
    body: "Signature, Heritage and Modern preset groups — each a complete token set with a gold accent system, tuned for light and dark.",
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    body: "Built on Radix primitives with keyboard navigation, focus management, ARIA wiring and visible focus rings everywhere.",
  },
  {
    icon: Braces,
    title: "TypeScript-first",
    body: "Strict types, variant unions and inference-friendly props ship in the box — JavaScript projects work just as well.",
  },
  {
    icon: Package,
    title: "One install, any stack",
    body: "ESM + CJS builds with types. Drop it into Next.js, Vite, Remix or a plain React app — client components are pre-marked.",
  },
  {
    icon: Container,
    title: "Responsive stages",
    body: "Surface components adapt with container queries, so a navbar collapses inside a 390px preview — not just at viewport breakpoints.",
  },
  {
    icon: Gauge,
    title: "Optimized by design",
    body: "Zero runtime CSS-in-JS, tree-shakeable barrels, Tailwind v4 tokens and WCAG-AA contrast verified across all 24 combinations.",
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <Badge variant="gold" className="mb-4 gap-1.5">
            Why MarkaUI
          </Badge>
          <h2
            id="features-heading"
            className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Engineered like a product, styled like jewelry
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            The ergonomics of shadcn/ui, the polish of a boutique design agency, and a
            theming system that never makes you choose between pretty and accessible.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="group transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-gold/12 text-gold-foreground transition-colors dark:text-gold">
                  <f.icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-serif text-base font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
