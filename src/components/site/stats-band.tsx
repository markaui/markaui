import { Card, CardContent } from "@/components/ui/card";

const STATS = [
  { value: "339+", label: "Components" },
  { value: "58", label: "Families" },
  { value: "12", label: "Luxury themes" },
  { value: "24", label: "Theme × mode combos" },
];

export function StatsBand() {
  return (
    <section aria-label="Library statistics" className="border-y border-border bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px px-4 py-10 sm:px-6 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label} className="border-none bg-transparent shadow-none">
            <CardContent className="p-4 text-center">
              <p className="bg-[linear-gradient(110deg,var(--primary),var(--gold))] bg-clip-text font-serif text-4xl font-bold text-transparent sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
