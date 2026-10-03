import {
  Bell,
  CalendarDays,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  Search,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react"

import type { ComponentDoc } from "./types"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Announcement } from "@/components/ui/announcement"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Callout } from "@/components/ui/callout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { CodeBlock } from "@/components/ui/code-block"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { EmptyState } from "@/components/ui/empty-state"
import { Audio as MediaAudio, Image as MediaImage, Video as MediaVideo } from "@/components/ui/media"
import { Markdown } from "@/components/ui/markdown"
import {
  Box,
  Container,
  Content,
  Flex,
  Grid,
  HStack,
  List,
  ListItem,
  Section,
  Spacer,
  Stack,
  VStack,
} from "@/components/ui/primitives"
import { Quote } from "@/components/ui/quote"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { RichText, RichTextClamped } from "@/components/ui/rich-text"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SplitPane } from "@/components/ui/split-pane"

/* ------------------------------------------------------------------ */
/* Fixed seed data (module scope — no randomness, hydration-safe)      */
/* ------------------------------------------------------------------ */

const PENDING_INTERESTS = [
  { name: "Leo Parker", city: "Mumbai" },
  { name: "Zoe Perry", city: "Delhi" },
  { name: "James Carter", city: "Bengaluru" },
  { name: "Lily Adams", city: "Kochi" },
  { name: "Alex Stone", city: "Chandigarh" },
  { name: "Ava Thompson", city: "Ahmedabad" },
  { name: "Daniel Reed", city: "Hyderabad" },
  { name: "Grace Hall", city: "Pune" },
  { name: "Thomas Grey", city: "Indore" },
  { name: "Chloe Foster", city: "Kolkata" },
]

const SAMPLE_CODE = `import { createProfile } from "@saptapadi/api"

export async function createMatchProfile(input: ProfileInput) {
  const profile = await createProfile({
    name: input.name,
    age: input.age,
    city: "Jaipur",
    verified: true,
  })

  return profile.id
}
`

const SAMPLE_MARKDOWN = `# Saptapadi

Where **two souls** meet with the blessings of *seven vows*.

## Why families trust us

- Verified profiles
- Kundli matching
- Family-first privacy

Read the [rituals guide](https://example.com/rituals) to learn more.

> A wedding is a memory that outlives a lifetime.
`

const SAMPLE_HTML =
  "<h3>The Seven Vows</h3><p>The <strong>Saptapadi</strong> is the most sacred ritual of a Hindu wedding — seven steps taken together around the <em>sacred fire</em>, each one a promise for the life ahead.</p><ul><li>Ganesh Puja opens every ceremony</li><li>Kanyadaan is the gift of trust</li><li>Mangalsutra seals the bond</li></ul><blockquote>A wedding blessed by families lasts a lifetime.</blockquote>"

const SAMPLE_HTML_LONG =
  "<p>Emma and John met through their families on Saptapadi in October. Their first conversation lasted three hours — about music, mountains and their grandmothers' recipes.</p><p>After six months of conversations, both families met at a small temple in Jaipur. The kundli matched 32 of 36 gunas, and a wedding date was fixed for the first week of February.</p><p>Today they credit the platform's careful, family-first process for a match that felt less like an algorithm and more like destiny.</p><p>They still walk the same temple path every Sunday — their own eighth vow.</p>"

const CAROUSEL_SLIDES = [
  { src: "/images/story-1.png", title: "Noah & Jane", place: "Udaipur" },
  { src: "/images/story-2.png", title: "David & Ava", place: "Jaipur" },
  { src: "/images/story-3.png", title: "Alex & Sana", place: "Jodhpur" },
  { src: "https://picsum.photos/seed/markaui-couple/600/800", title: "John & Emma", place: "Jaipur" },
  { src: "https://picsum.photos/seed/markaui-bride/600/800", title: "Hannah's Mehndi", place: "Delhi" },
]

/* ------------------------------------------------------------------ */
/* Layout registry                                                     */
/* ------------------------------------------------------------------ */

export const layoutDocs: ComponentDoc[] = [
  {
    id: "container",
    name: "Container",
    category: "layout",
    description: "Responsive page-width wrapper — max-w-7xl centered with adaptive horizontal padding.",
    demos: [
      {
        id: "basic",
        title: "Page container",
        description: "Content stays centered with px-4 → sm:px-6 → lg:px-8 gutters.",
        code: `import { Container } from "@/components/ui/primitives"

<Container>
  <div className="rounded-xl border border-dashed bg-muted/30 py-8 text-center text-sm text-muted-foreground">
    Max-width 7xl, responsive padding
  </div>
</Container>`,
        render: () => (
          <Container>
            <div className="rounded-xl border border-dashed border-gold/40 bg-muted/30 py-8 text-center text-sm text-muted-foreground">
              Max-width 7xl, responsive padding
            </div>
          </Container>
        ),
      },
    ],
    props: [
      { name: "className", type: "string", description: "Merge extra classes — narrow with max-w-5xl if needed." },
      { name: "children", type: "ReactNode", description: "Page content." },
      { name: "id", type: "string", description: "Anchor id for scroll navigation." },
      { name: "(div)", type: "DivProps", description: "Forwards all native div attributes." },
    ],
  },
  {
    id: "stack",
    name: "Stack",
    category: "layout",
    description: "Flexbox stack with preset gaps — the workhorse for vertical and horizontal grouping.",
    aliases: ["HStack", "VStack"],
    demos: [
      {
        id: "vertical",
        title: "Vertical stack",
        description: "Stack defaults to flex-col with a default gap.",
        code: `import { Stack, HStack } from "@/components/ui/primitives"
import { Badge } from "@/components/ui/badge"

<Stack gap="lg" className="w-full rounded-xl border bg-muted/20 p-4">
  <p className="font-serif text-lg font-semibold">Saptapadi</p>
  <p className="text-sm text-muted-foreground">Seven sacred steps toward a lifetime of togetherness.</p>
  <HStack gap="sm">
    <Badge variant="gold">Kundli matched</Badge>
    <Badge variant="soft">Verified</Badge>
  </HStack>
</Stack>`,
        render: () => (
          <Stack gap="lg" className="w-full rounded-xl border bg-muted/20 p-4">
            <p className="font-serif text-lg font-semibold">Saptapadi</p>
            <p className="text-sm text-muted-foreground">Seven sacred steps toward a lifetime of togetherness.</p>
            <HStack gap="sm">
              <Badge variant="gold">Kundli matched</Badge>
              <Badge variant="soft">Verified</Badge>
            </HStack>
          </Stack>
        ),
      },
      {
        id: "aliases",
        title: "HStack / VStack aliases",
        description: "Direction-fixed aliases for quick horizontal or vertical grouping.",
        code: `import { VStack, HStack, Spacer } from "@/components/ui/primitives"
import { Badge } from "@/components/ui/badge"

<HStack gap="lg" align="center" className="w-full rounded-xl border bg-muted/20 p-4">
  <VStack gap="none">
    <span className="font-serif text-base font-semibold">Noah & Jane</span>
    <span className="text-xs text-muted-foreground">Married 12 March 2024</span>
  </VStack>
  <Spacer />
  <Badge variant="success" dot>Just engaged</Badge>
</HStack>`,
        render: () => (
          <HStack gap="lg" align="center" className="w-full rounded-xl border bg-muted/20 p-4">
            <VStack gap="none">
              <span className="font-serif text-base font-semibold">Noah & Jane</span>
              <span className="text-xs text-muted-foreground">Married 12 March 2024</span>
            </VStack>
            <Spacer />
            <Badge variant="success" dot>
              Just engaged
            </Badge>
          </HStack>
        ),
      },
    ],
    props: [
      { name: "direction", type: '"row" | "col"', default: '"col"', description: "HStack fixes row, VStack fixes col." },
      { name: "gap", type: '"none" | "sm" | "default" | "lg" | "xl"', default: '"default"', description: "Preset gap scale." },
      { name: "align", type: '"start" | "center" | "end" | "stretch" | "baseline"', description: "items-* alignment." },
      { name: "justify", type: '"start" | "center" | "end" | "between" | "around" | "evenly"', description: "justify-* distribution." },
      { name: "wrap", type: "boolean", default: "false", description: "Allow wrapping with flex-wrap." },
      { name: "className", type: "string", description: "Extra classes." },
    ],
  },
  {
    id: "grid",
    name: "Grid",
    category: "layout",
    description: "CSS grid with 1–6 column presets and responsive sm / md / lg breakpoints.",
    demos: [
      {
        id: "responsive",
        title: "Responsive grid",
        description: "One column on mobile, two on small screens, three on large.",
        code: `import { Grid } from "@/components/ui/primitives"

<Grid cols={1} smCols={2} lgCols={3} gap="sm" className="w-full">
  {names.map((label) => (
    <div key={label} className="flex h-16 items-center justify-center rounded-lg border bg-muted/30 text-sm">
      {label}
    </div>
  ))}
</Grid>`,
        render: () => (
          <Grid cols={1} smCols={2} lgCols={3} gap="sm" className="w-full">
            {["Emma, 27", "Liam, 31", "Hannah, 29", "John, 28", "Jane, 26", "Alex, 30"].map((label) => (
              <div
                key={label}
                className="flex h-16 items-center justify-center rounded-lg border bg-muted/30 text-sm"
              >
                {label}
              </div>
            ))}
          </Grid>
        ),
      },
    ],
    props: [
      { name: "cols", type: "1 | 2 | 3 | 4 | 5 | 6", default: "1", description: "Base column count." },
      { name: "smCols", type: "1 | 2 | 3 | 4 | 5 | 6", description: "Columns from the sm breakpoint." },
      { name: "mdCols", type: "1 | 2 | 3 | 4 | 5 | 6", description: "Columns from the md breakpoint." },
      { name: "lgCols", type: "1 | 2 | 3 | 4 | 5 | 6", description: "Columns from the lg breakpoint." },
      { name: "gap", type: '"none" | "sm" | "default" | "lg" | "xl"', default: '"default"', description: "Preset gap scale." },
      { name: "className", type: "string", description: "Extra classes." },
    ],
  },
  {
    id: "flex",
    name: "Flex",
    category: "layout",
    description: "One-line flexbox with explicit direction, alignment, justification and gap props.",
    demos: [
      {
        id: "toolbar",
        title: "Flex toolbar",
        description: "justify-between with nested flex groups and wrapping.",
        code: `import { Flex } from "@/components/ui/primitives"
import { Button } from "@/components/ui/button"

<Flex justify="between" align="center" gap="sm" wrap className="w-full rounded-xl border bg-muted/20 p-4">
  <span className="font-serif text-base font-semibold">Saptapadi</span>
  <Flex gap="lg" align="center" className="text-sm text-muted-foreground">
    <span>Profiles</span>
    <span>Rituals</span>
    <span>Stories</span>
  </Flex>
  <Button size="sm" variant="gold">Join now</Button>
</Flex>`,
        render: () => (
          <Flex justify="between" align="center" gap="sm" wrap className="w-full rounded-xl border bg-muted/20 p-4">
            <span className="font-serif text-base font-semibold">Saptapadi</span>
            <Flex gap="lg" align="center" className="text-sm text-muted-foreground">
              <span>Profiles</span>
              <span>Rituals</span>
              <span>Stories</span>
            </Flex>
            <Button size="sm" variant="gold">
              Join now
            </Button>
          </Flex>
        ),
      },
    ],
    props: [
      { name: "direction", type: '"row" | "col" | "row-reverse" | "col-reverse"', default: '"row"', description: "flex-direction." },
      { name: "align", type: '"start" | "center" | "end" | "stretch" | "baseline"', description: "items-* alignment." },
      { name: "justify", type: '"start" | "center" | "end" | "between" | "around" | "evenly"', description: "justify-* distribution." },
      { name: "wrap", type: "boolean", default: "false", description: "Allow wrapping." },
      { name: "gap", type: '"none" | "sm" | "default" | "lg" | "xl"', default: '"default"', description: "Preset gap scale." },
      { name: "className", type: "string", description: "Extra classes." },
    ],
  },
  {
    id: "box",
    name: "Box",
    category: "layout",
    description: "Minimal div wrapper for padding, borders and grouping anything.",
    demos: [
      {
        id: "basic",
        title: "Nested boxes",
        code: `import { Box } from "@/components/ui/primitives"

<Box className="rounded-xl border border-dashed bg-muted/20 p-6">
  <Box className="rounded-lg border bg-card p-4 text-sm shadow-sm">
    A Box is the simplest wrapper — group, pad and frame anything.
  </Box>
</Box>`,
        render: () => (
          <Box className="w-full rounded-xl border border-dashed border-gold/40 bg-muted/20 p-6">
            <Box className="rounded-lg border bg-card p-4 text-sm shadow-sm">
              A Box is the simplest wrapper — group, pad and frame anything.
            </Box>
          </Box>
        ),
      },
    ],
    props: [
      { name: "className", type: "string", description: "All styling via className." },
      { name: "children", type: "ReactNode", description: "Anything." },
      { name: "id", type: "string", description: "Anchor id." },
      { name: "(div)", type: "DivProps", description: "Forwards all native div attributes." },
    ],
  },
  {
    id: "aspect-ratio",
    name: "AspectRatio",
    category: "layout",
    description: "Radix aspect-ratio box — keeps media perfectly proportioned at any width.",
    demos: [
      {
        id: "ratios",
        title: "16 / 9 and 1 / 1",
        code: `import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl border">
  <img src="/images/story-1.png" alt="Newlywed couple" className="size-full object-cover" />
</AspectRatio>`,
        render: () => (
          <Grid cols={1} smCols={2} gap="sm" className="w-full">
            <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl border">
              <img src="/images/story-1.png" alt="Newlywed couple laughing in a garden" className="size-full object-cover" />
            </AspectRatio>
            <AspectRatio ratio={1} className="overflow-hidden rounded-xl border">
              <img src="https://picsum.photos/seed/markaui-face-1/400/400" alt="Portrait of a bride" className="size-full object-cover" />
            </AspectRatio>
          </Grid>
        ),
      },
    ],
    props: [
      { name: "ratio", type: "number", default: "1", description: "Width ÷ height, e.g. 16 / 9." },
      { name: "className", type: "string", description: "Style the box; add overflow-hidden + rounding for media." },
      { name: "children", type: "ReactNode", description: "Usually an absolutely-filled img or video." },
      { name: "(div)", type: "DivProps", description: "Forwards all native div attributes." },
    ],
  },
  {
    id: "scroll-area",
    name: "ScrollArea",
    category: "layout",
    description: "Radix scroll container with an elegant custom scrollbar — constrain with a height class.",
    demos: [
      {
        id: "list",
        title: "Scrolling list",
        description: "h-40 box with a long list inside — thin themed scrollbar on the right.",
        code: `import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-40 w-full rounded-xl border">
  <div className="p-2">
    {interests.map((interest) => (
      <div key={interest.name} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent/50 transition-colors">
        <span className="font-medium">{interest.name}</span>
        <span className="text-xs text-muted-foreground">{interest.city}</span>
      </div>
    ))}
  </div>
</ScrollArea>`,
        render: () => (
          <ScrollArea className="h-40 w-full rounded-xl border">
            <div className="p-2">
              {PENDING_INTERESTS.map((interest) => (
                <div
                  key={interest.name}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/50"
                >
                  <span className="font-medium">{interest.name}</span>
                  <span className="text-xs text-muted-foreground">{interest.city}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        ),
      },
    ],
    props: [
      { name: "className", type: "string", description: "Set a height (h-40, max-h-64…) to make it scroll." },
      { name: "type", type: '"auto" | "always" | "scroll" | "hover"', default: '"hover"', description: "Radix scrollbar visibility mode." },
      { name: "scrollHideDelay", type: "number", default: "600", description: "Delay before the scrollbar hides." },
      { name: "children", type: "ReactNode", description: "Scrollable content." },
    ],
  },
  {
    id: "resizable",
    name: "Resizable",
    category: "layout",
    description: "react-resizable-panels group — draggable dividers between percentage-sized panels.",
    aliases: ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"],
    demos: [
      {
        id: "two-panes",
        title: "Two resizable panes",
        description: "Drag the handle to redistribute space.",
        code: `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

// A stable id keeps panel registration deterministic across re-renders
<ResizablePanelGroup id="wedding-panes" direction="horizontal" className="h-56 w-full rounded-xl border bg-muted/20">
  <ResizablePanel defaultSize={40} minSize={20}>
    <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
      <p className="font-serif text-base font-semibold">Bride's family</p>
      <p className="text-xs text-muted-foreground">Wilson Niwas, Jaipur</p>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={60}>
    <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
      <p className="font-serif text-base font-semibold">Groom's family</p>
      <p className="text-xs text-muted-foreground">Sanders Villa, Delhi</p>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`,
        wide: true,
        render: () => (
          <ResizablePanelGroup id="wedding-panes" direction="horizontal" className="h-56 w-full rounded-xl border bg-muted/20">
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
                <p className="font-serif text-base font-semibold">Bride's family</p>
                <p className="text-xs text-muted-foreground">Wilson Niwas, Jaipur</p>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
                <p className="font-serif text-base font-semibold">Groom's family</p>
                <p className="text-xs text-muted-foreground">Sanders Villa, Delhi</p>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ),
      },
    ],
    props: [
      { name: "direction", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "On ResizablePanelGroup." },
      { name: "defaultSize", type: "number", description: "Panel size in percent of the group." },
      { name: "minSize", type: "number", description: "Panel minimum percent." },
      { name: "maxSize", type: "number", description: "Panel maximum percent." },
      { name: "withHandle", type: "boolean", default: "false", description: "On ResizableHandle — show a grip pill." },
      { name: "className", type: "string", description: "Give the group an explicit height." },
    ],
  },
  {
    id: "split-pane",
    name: "SplitPane",
    category: "layout",
    description: "Self-contained two-panel split with a draggable, keyboard-accessible divider (arrow keys adjust).",
    demos: [
      {
        id: "master-detail",
        title: "Master–detail split",
        description: "Drag the divider, or focus it and use the left / right arrow keys (Shift = bigger steps).",
        code: `import { SplitPane } from "@/components/ui/split-pane"

<SplitPane
  className="h-64 w-full rounded-xl border bg-muted/10"
  defaultPercent={42}
  minPercent={25}
  maxPercent={75}
  left={
    <div className="h-full p-3">
      <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Shortlisted</p>
      {/* List of profiles */}
    </div>
  }
  right={
    <div className="flex h-full flex-col justify-center gap-2 p-6">
      <p className="font-serif text-xl font-semibold">Emma Wilson</p>
      <p className="text-sm text-muted-foreground">Drag the divider to rebalance the panes.</p>
    </div>
  }
/>`,
        wide: true,
        render: () => (
          <SplitPane
            className="h-64 w-full rounded-xl border bg-muted/10"
            defaultPercent={42}
            minPercent={25}
            maxPercent={75}
            left={
              <div className="h-full p-3">
                <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Shortlisted
                </p>
                <List variant="divide">
                  <ListItem title="Emma Wilson" description="27 · Jaipur" />
                  <ListItem title="Zoe Perry" description="29 · Delhi" />
                  <ListItem title="Jane Smith" description="26 · Chennai" />
                </List>
              </div>
            }
            right={
              <div className="flex h-full flex-col justify-center gap-2 p-6">
                <p className="font-serif text-xl font-semibold">Emma Wilson</p>
                <p className="text-sm text-muted-foreground">
                  Drag the divider, or focus it and use the arrow keys.
                </p>
                <HStack gap="sm">
                  <Badge variant="gold">92% match</Badge>
                  <Badge variant="soft">Verified</Badge>
                </HStack>
              </div>
            }
          />
        ),
      },
    ],
    props: [
      { name: "left", type: "ReactNode", description: "Left panel content." },
      { name: "right", type: "ReactNode", description: "Right panel content." },
      { name: "percent", type: "number", description: "Controlled left-panel width in percent." },
      { name: "defaultPercent", type: "number", default: "50", description: "Uncontrolled initial split." },
      { name: "minPercent", type: "number", default: "20", description: "Lower clamp for the divider." },
      { name: "maxPercent", type: "number", default: "80", description: "Upper clamp for the divider." },
      { name: "onPercentChange", type: "(percent: number) => void", description: "Fires while dragging or arrow-keying." },
    ],
  },
  {
    id: "spacer",
    name: "Spacer",
    category: "layout",
    description: "Invisible spacing tool — flex-grow by default, or a fixed flex-basis with the size prop.",
    demos: [
      {
        id: "grow-and-fixed",
        title: "Grow and fixed spacers",
        description: "The grow spacer pushes the badge to the end; the fixed spacer adds an exact 24px band.",
        code: `import { HStack, VStack, Spacer } from "@/components/ui/primitives"
import { Badge } from "@/components/ui/badge"

<HStack align="center" className="rounded-xl border bg-muted/20 p-4">
  <span className="font-serif text-sm font-semibold">Saptapadi</span>
  <Spacer />
  <Badge variant="gold">Premium</Badge>
</HStack>

<VStack className="h-32 rounded-xl border border-dashed bg-muted/20 p-4">
  <span className="text-xs text-muted-foreground">Top</span>
  <Spacer size={24} />
  <span className="text-xs text-muted-foreground">After a fixed 24px spacer</span>
  <Spacer />
  <span className="text-xs text-muted-foreground">Bottom</span>
</VStack>`,
        render: () => (
          <Stack gap="sm" className="w-full">
            <HStack align="center" className="w-full rounded-xl border bg-muted/20 p-4">
              <span className="font-serif text-sm font-semibold">Saptapadi</span>
              <Spacer />
              <Badge variant="gold">Premium</Badge>
            </HStack>
            <VStack className="h-32 rounded-xl border border-dashed border-gold/40 bg-muted/20 p-4">
              <span className="text-xs text-muted-foreground">Top</span>
              <Spacer size={24} />
              <span className="text-xs text-muted-foreground">After a fixed 24px spacer</span>
              <Spacer />
              <span className="text-xs text-muted-foreground">Bottom</span>
            </VStack>
          </Stack>
        ),
      },
    ],
    props: [
      { name: "size", type: "number | string", description: "Fixed flex-basis along the main axis; omit to flex-grow." },
      { name: "className", type: "string", description: "Extra classes." },
      { name: "id", type: "string", description: " rarely needed — element is aria-hidden." },
      { name: "(div)", type: "DivProps", description: "Forwards all native div attributes." },
    ],
  },
  {
    id: "section",
    name: "Section",
    category: "layout",
    description: "Semantic <section> with vertical rhythm and an optional centered serif title + subtitle.",
    demos: [
      {
        id: "titled",
        title: "Titled section",
        description: "padding='sm' keeps the demo compact — use default or lg for real pages.",
        code: `import { Section, Grid } from "@/components/ui/primitives"

<Section title="Featured Profiles" subtitle="Hand-picked matches, verified by our team every week.">
  <Grid cols={1} smCols={3} gap="sm">
    {/* profile cards */}
  </Grid>
</Section>`,
        wide: true,
        render: () => (
          <Section
            title="Featured Profiles"
            subtitle="Hand-picked matches, verified by our team every week."
            padding="sm"
            className="w-full rounded-xl border border-dashed border-gold/40"
          >
            <Grid cols={1} smCols={3} gap="sm">
              {["Emma, 27 — Jaipur", "Liam, 31 — Pune", "Hannah, 29 — Delhi"].map((label) => (
                <div key={label} className="rounded-lg bg-muted/30 p-4 text-center text-sm">
                  {label}
                </div>
              ))}
            </Grid>
          </Section>
        ),
      },
    ],
    props: [
      { name: "title", type: "ReactNode", description: "Centered serif section heading." },
      { name: "subtitle", type: "ReactNode", description: "Muted line under the title." },
      { name: "padding", type: '"none" | "sm" | "default" | "lg"', default: '"default"', description: "Vertical rhythm scale." },
      { name: "id", type: "string", description: "Anchor target for in-page navigation." },
      { name: "className", type: "string", description: "Extra classes." },
    ],
  },
  {
    id: "content",
    name: "Content",
    category: "layout",
    description: "max-w-3xl centered reading column for prose, stories and long-form pages.",
    demos: [
      {
        id: "reading-column",
        title: "Reading column",
        code: `import { Content } from "@/components/ui/primitives"

<div className="rounded-xl border border-dashed p-4">
  <Content>
    <p className="rounded-lg bg-muted/30 p-4 text-center text-sm text-muted-foreground">
      max-w-3xl centered reading column
    </p>
  </Content>
</div>`,
        wide: true,
        render: () => (
          <div className="w-full rounded-xl border border-dashed border-gold/40 p-4">
            <Content>
              <p className="rounded-lg bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                max-w-3xl centered reading column — long-form wedding stories and ritual guides live here.
              </p>
            </Content>
          </div>
        ),
      },
    ],
    props: [
      { name: "className", type: "string", description: "Narrow further with max-w-xl, or pad with px-4." },
      { name: "children", type: "ReactNode", description: "Prose content." },
      { name: "id", type: "string", description: "Anchor id." },
      { name: "(div)", type: "DivProps", description: "Forwards all native div attributes." },
    ],
  },
  {
    id: "card",
    name: "Card",
    category: "layout",
    description: "The premium surface — bg-card, rounded-xl border and shadow-sm, with header / content / footer parts.",
    aliases: ["CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter", "CardAction"],
    demos: [
      {
        id: "profile",
        title: "Premium profile card",
        description: "Media top + header + details + actions, composed from the Card family.",
        code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin } from "lucide-react"

<Card className="w-full max-w-sm gap-0 overflow-hidden py-0">
  <div className="relative">
    <img src="https://picsum.photos/seed/markaui-face-1/400/400" alt="Emma Wilson" className="h-52 w-full object-cover" />
    <Badge variant="gold" className="absolute top-3 left-3">Premium</Badge>
  </div>
  <CardHeader className="pt-5">
    <CardTitle className="font-serif text-lg">Emma Wilson, 27</CardTitle>
    <CardDescription className="flex items-center gap-1">
      <MapPin className="size-3.5" /> Jaipur, Rajasthan
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-3">
    <p className="text-sm text-muted-foreground">Classical dancer and music teacher.</p>
    <HStack gap="sm" wrap>
      <Badge variant="soft">M.A. Music</Badge>
      <Badge variant="success">Vegetarian</Badge>
    </HStack>
  </CardContent>
  <CardFooter className="justify-between border-t py-4">
    <Button variant="gold" size="sm" leftIcon={<Heart />}>Send Interest</Button>
    <Button variant="outline" size="sm">View Profile</Button>
  </CardFooter>
</Card>`,
        wide: true,
        render: () => (
          <div className="flex w-full justify-center">
            <Card className="w-full max-w-sm gap-0 overflow-hidden py-0">
              <div className="relative">
                <img src="https://picsum.photos/seed/markaui-face-1/400/400" alt="Emma Wilson" className="h-52 w-full object-cover" />
                <Badge variant="gold" className="absolute top-3 left-3">
                  Premium
                </Badge>
              </div>
              <CardHeader className="pt-5">
                <CardTitle className="font-serif text-lg">Emma Wilson, 27</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> Jaipur, Rajasthan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Classical dancer and music teacher. Looking for a kind, family-oriented partner.
                </p>
                <HStack gap="sm" wrap>
                  <Badge variant="soft">M.A. Music</Badge>
                  <Badge variant="success">Vegetarian</Badge>
                  <Badge variant="outline">Never Married</Badge>
                </HStack>
              </CardContent>
              <CardFooter className="justify-between border-t py-4">
                <Button variant="gold" size="sm" leftIcon={<Heart />}>
                  Send Interest
                </Button>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        ),
      },
    ],
    props: [
      { name: "className", type: "string", description: "All parts merge className — use gap-0 py-0 on Card for media tops." },
      { name: "CardHeader", type: "component", description: "Grid header with a CardAction slot (top-right)." },
      { name: "CardTitle", type: "component", description: "Semibold leading-none title div." },
      { name: "CardDescription", type: "component", description: "Muted text-sm description." },
      { name: "CardContent", type: "component", description: "Horizontal padding only (px-6)." },
      { name: "CardFooter", type: "component", description: "Flex row; add border-t and it auto-pads (pt-6)." },
    ],
  },
  {
    id: "accordion",
    name: "Accordion",
    category: "layout",
    description: "Radix accordion with animated chevron — ideal for FAQs and details.",
    demos: [
      {
        id: "single",
        title: "Single collapsible",
        code: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion type="single" collapsible defaultValue="item-1" className="w-full rounded-xl border px-4">
  <AccordionItem value="item-1">
    <AccordionTrigger>How are profiles verified?</AccordionTrigger>
    <AccordionContent>Every profile is reviewed by our team.</AccordionContent>
  </AccordionItem>
</Accordion>`,
        render: () => (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full rounded-xl border px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>How are profiles verified?</AccordionTrigger>
              <AccordionContent>
                Every profile is manually reviewed by our moderation team, and phone numbers are verified by OTP
                before families can connect.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can families manage the conversation?</AccordionTrigger>
              <AccordionContent>
                Yes — parents can be added as co-managers of a profile and receive every interest notification
                alongside their child.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my horoscope shared publicly?</AccordionTrigger>
              <AccordionContent>
                Never. Kundli details are shared only with members you accept, and only after you approve the
                request.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
    ],
    props: [
      { name: "type", type: '"single" | "multiple"', description: "One open item at a time, or many." },
      { name: "collapsible", type: "boolean", default: "false", description: "Allow closing the open item (type=single)." },
      { name: "defaultValue", type: "string | string[]", description: "Initially open item value(s)." },
      { name: "value / onValueChange", type: "controlled", description: "Control the open state." },
      { name: "className", type: "string", description: "Style the root; AccordionItem already has border-b dividers." },
    ],
  },
  {
    id: "collapsible",
    name: "Collapsible",
    category: "layout",
    description: "Radix show/hide region — pair the trigger with any button, no state wiring needed.",
    demos: [
      {
        id: "details",
        title: "Reveal details",
        code: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

<Collapsible className="w-full max-w-md rounded-xl border">
  <div className="flex items-center justify-between gap-3 p-4">
    <div>
      <p className="text-sm font-medium">Family details</p>
      <p className="text-xs text-muted-foreground">Shared with accepted interests only</p>
    </div>
    <CollapsibleTrigger asChild>
      <Button variant="outline" size="sm">Toggle</Button>
    </CollapsibleTrigger>
  </div>
  <CollapsibleContent>
    <div className="border-t px-4 py-3 text-sm text-muted-foreground">
      Father — businessman · Mother — homemaker
    </div>
  </CollapsibleContent>
</Collapsible>`,
        render: () => (
          <Collapsible className="w-full max-w-md rounded-xl border">
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium">Family details</p>
                <p className="text-xs text-muted-foreground">Shared with accepted interests only</p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  Toggle
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-1 border-t px-4 py-3 text-sm text-muted-foreground">
                <p>Father — businessman · Mother — homemaker</p>
                <p>One elder sister, married and settled in Pune</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ),
      },
    ],
    props: [
      { name: "defaultOpen", type: "boolean", default: "false", description: "Start expanded." },
      { name: "open / onOpenChange", type: "controlled", description: "Control the open state." },
      { name: "asChild", type: "boolean", default: "false", description: "On CollapsibleTrigger — merge onto a child button." },
      { name: "className", type: "string", description: "Style the region." },
    ],
  },
  {
    id: "list",
    name: "List",
    category: "layout",
    description: "Semantic ul with divided or card rows; ListItem adds icon, title, description and action slots.",
    aliases: ["ListItem"],
    demos: [
      {
        id: "card-list",
        title: "Card list",
        description: "Rows as floating cards with hover feedback.",
        code: `import { List, ListItem } from "@/components/ui/primitives"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronRight, Mail, Users } from "lucide-react"

<List variant="card" hoverable className="w-full max-w-md">
  <ListItem
    icon={<Users />}
    title="Wilson & Sanders families met"
    description="Sunday, 11:00 AM · Jaipur"
    action={<Badge variant="success" dot>Confirmed</Badge>}
  />
  <ListItem
    icon={<CalendarDays />}
    title="Roka ceremony scheduled"
    description="14 February · Udaipur"
    action={<ChevronRight className="size-4 text-muted-foreground" />}
  />
  <ListItem
    icon={<Mail />}
    title="New interest from John"
    description="Received 2 hours ago"
    action={<Button size="sm" variant="gold">Reply</Button>}
  />
</List>`,
        render: () => (
          <List variant="card" hoverable className="w-full max-w-md">
            <ListItem
              icon={<Users />}
              title="Wilson & Sanders families met"
              description="Sunday, 11:00 AM · Jaipur"
              action={
                <Badge variant="success" dot>
                  Confirmed
                </Badge>
              }
            />
            <ListItem
              icon={<CalendarDays />}
              title="Roka ceremony scheduled"
              description="14 February · Udaipur"
              action={<ChevronRight className="size-4 text-muted-foreground" />}
            />
            <ListItem
              icon={<Mail />}
              title="New interest from John"
              description="Received 2 hours ago"
              action={
                <Button size="sm" variant="gold">
                  Reply
                </Button>
              }
            />
          </List>
        ),
      },
      {
        id: "divided-list",
        title: "Divided list",
        description: "Hairline dividers with leading avatars and match badges.",
        code: `import { List, ListItem } from "@/components/ui/primitives"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

<List variant="divide" className="w-full max-w-md rounded-xl border px-3">
  <ListItem
    icon={<Avatar className="size-9"><AvatarImage src="https://picsum.photos/seed/markaui-face-1/400/400" alt="Emma" /><AvatarFallback>EW</AvatarFallback></Avatar>}
    title="Emma Wilson"
    description="27 · Jaipur · Music teacher"
    action={<Badge variant="soft">92% match</Badge>}
  />
</List>`,
        render: () => (
          <List variant="divide" className="w-full max-w-md rounded-xl border px-3">
            <ListItem
              icon={
                <Avatar className="size-9">
                  <AvatarImage src="https://picsum.photos/seed/markaui-face-1/400/400" alt="Emma Wilson" />
                  <AvatarFallback>EW</AvatarFallback>
                </Avatar>
              }
              title="Emma Wilson"
              description="27 · Jaipur · Music teacher"
              action={<Badge variant="soft">92% match</Badge>}
            />
            <ListItem
              icon={
                <Avatar className="size-9">
                  <AvatarImage src="https://picsum.photos/seed/markaui-face-3/400/400" alt="Zoe Perry" />
                  <AvatarFallback>ZP</AvatarFallback>
                </Avatar>
              }
              title="Zoe Perry"
              description="29 · Delhi · Architect"
              action={<Badge variant="soft">88% match</Badge>}
            />
            <ListItem
              icon={
                <Avatar className="size-9">
                  <AvatarImage src="https://picsum.photos/seed/markaui-face-5/400/400" alt="Jane Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              }
              title="Jane Smith"
              description="26 · Chennai · Doctor"
              action={<Badge variant="soft">85% match</Badge>}
            />
          </List>
        ),
      },
    ],
    props: [
      { name: "variant", type: '"divide" | "card"', default: '"divide"', description: "Hairline dividers or rounded card rows." },
      { name: "hoverable", type: "boolean", default: "false", description: "Accent-tinted hover on rows." },
      { name: "icon", type: "ReactNode", description: "ListItem leading icon / avatar slot." },
      { name: "title", type: "ReactNode", description: "ListItem medium-weight truncated title." },
      { name: "description", type: "ReactNode", description: "ListItem muted text-xs line." },
      { name: "action", type: "ReactNode", description: "ListItem trailing slot — badge, chevron or button." },
    ],
  },
  {
    id: "empty-state",
    name: "EmptyState",
    category: "layout",
    description: "Centered serif title, muted description and an icon in a soft gold circle — with action slots.",
    demos: [
      {
        id: "no-matches",
        title: "No matches yet",
        code: `import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

<EmptyState
  icon={<Search />}
  title="No matches yet"
  description="Broaden your partner preferences or complete your profile to receive better matches."
  action={<Button variant="gold">Update preferences</Button>}
  secondaryAction={<Button variant="ghost">Browse profiles</Button>}
/>`,
        render: () => (
          <EmptyState
            icon={<Search />}
            title="No matches yet"
            description="Broaden your partner preferences or complete your profile to receive better matches."
            action={
              <Button variant="gold">Update preferences</Button>
            }
            secondaryAction={<Button variant="ghost">Browse profiles</Button>}
            className="w-full rounded-xl border border-dashed"
          />
        ),
      },
    ],
    props: [
      { name: "icon", type: "ReactNode", description: "Lucide icon inside the tinted circle." },
      { name: "title", type: "ReactNode", description: "Serif heading — required." },
      { name: "description", type: "ReactNode", description: "Muted supporting text." },
      { name: "action", type: "ReactNode", description: "Primary button/link slot." },
      { name: "secondaryAction", type: "ReactNode", description: "Secondary quieter action." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Overall scale." },
    ],
  },
  {
    id: "callout",
    name: "Callout",
    category: "layout",
    description: "Soft-tinted note with a left accent border and a per-variant icon — info, success, warning, destructive or gold.",
    demos: [
      {
        id: "variants",
        title: "All variants",
        code: `import { Callout } from "@/components/ui/callout"

<Callout variant="info" title="Profile under review">Our team verifies new profiles within 24 hours.</Callout>
<Callout variant="success" title="Horoscope matched">Guna score 32 / 36 — an excellent match.</Callout>
<Callout variant="warning" title="Incomplete profile">Add your education details to rank higher.</Callout>
<Callout variant="destructive" title="Interest declined">John politely declined your interest.</Callout>
<Callout variant="gold" title="Premium member">You have unlimited interests this month.</Callout>`,
        wide: true,
        render: () => (
          <Grid cols={1} smCols={2} gap="sm" className="w-full">
            <Callout variant="info" title="Profile under review">
              Our team verifies new profiles within 24 hours.
            </Callout>
            <Callout variant="success" title="Horoscope matched">
              Guna score 32 / 36 — an excellent match.
            </Callout>
            <Callout variant="warning" title="Incomplete profile">
              Add your education details to rank higher in search.
            </Callout>
            <Callout variant="destructive" title="Interest declined">
              John politely declined your interest.
            </Callout>
            <Callout variant="gold" title="Premium member">
              You have unlimited interests this month.
            </Callout>
          </Grid>
        ),
      },
    ],
    props: [
      { name: "variant", type: '"info" | "success" | "warning" | "destructive" | "gold"', default: '"info"', description: "Tint + accent + default icon." },
      { name: "title", type: "ReactNode", description: "Medium-weight heading line." },
      { name: "icon", type: "ReactNode", description: "Override the default per-variant icon." },
      { name: "children", type: "ReactNode", description: "Muted body text under the title." },
      { name: "className", type: "string", description: "Extra classes." },
    ],
  },
  {
    id: "announcement",
    name: "Announcement",
    category: "layout",
    description: "Slim dismissible banner with a maroon-to-gold gradient — perfect for promos and product news.",
    demos: [
      {
        id: "banners",
        title: "Pill and rounded banners",
        description: "Both banners are dismissible — click the X to remove them.",
        code: `import { Announcement } from "@/components/ui/announcement"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

<Announcement
  icon={<Sparkles />}
  text="Saptapadi Premium — flat 30% off this Diwali"
  action={<Button asChild variant="link" size="sm"><a href="#premium">Claim offer</a></Button>}
/>

<Announcement rounded="lg" text="Video profiles are now live for every member" />`,
        wide: true,
        render: () => (
          <Stack gap="sm" className="w-full">
            <Announcement
              icon={<Sparkles />}
              text="Saptapadi Premium — flat 30% off this Diwali"
              action={
                <Button asChild variant="link" size="sm">
                  <a href="#premium">Claim offer</a>
                </Button>
              }
            />
            <Announcement rounded="lg" text="Video profiles are now live for every member" />
          </Stack>
        ),
      },
    ],
    props: [
      { name: "text", type: "ReactNode", description: "Banner copy — required." },
      { name: "icon", type: "ReactNode", description: "Leading icon, tinted gold." },
      { name: "action", type: "ReactNode", description: "Trailing link or button slot." },
      { name: "rounded", type: '"full" | "lg"', default: '"full"', description: "Pill vs softly-rounded silhouette." },
      { name: "onDismiss", type: "() => void", description: "Called after the X removes the banner." },
    ],
  },
  {
    id: "quote",
    name: "Quote",
    category: "layout",
    description: "Elegant serif blockquote with a gold accent border, watermark glyph and author avatar.",
    demos: [
      {
        id: "testimonial",
        title: "Testimonial",
        code: `import { Quote } from "@/components/ui/quote"

<Quote
  author="Emma Wilson"
  role="Bride · Jaipur"
  avatar="https://picsum.photos/seed/markaui-face-3/400/400"
  className="max-w-xl"
>
  Saptapadi understood that marriage is not just two people — it is two
  families, two cultures and one shared future.
</Quote>`,
        wide: true,
        render: () => (
          <div className="flex w-full justify-center">
            <Quote
              author="Emma Wilson"
              role="Bride · Jaipur"
              avatar="https://picsum.photos/seed/markaui-face-3/400/400"
              className="max-w-xl"
            >
              Saptapadi understood that marriage is not just two people — it is two families, two cultures and
              one shared future.
            </Quote>
          </div>
        ),
      },
    ],
    props: [
      { name: "children", type: "ReactNode", description: "The quoted text — rendered big, serif and italic." },
      { name: "author", type: "string", description: "Name under the quote." },
      { name: "role", type: "string", description: "Muted role / city line." },
      { name: "avatar", type: "string", description: "Avatar image src; falls back to initials." },
      { name: "leftBorder", type: "boolean", default: "true", description: "Decorative gold left border." },
    ],
  },
  {
    id: "code-block",
    name: "CodeBlock",
    category: "layout",
    description: "Framed mono code viewer with a header label, copy-to-clipboard button, optional line numbers and scroll clamping.",
    demos: [
      {
        id: "numbered",
        title: "Numbered with copy",
        description: "Click the header button to copy the source.",
        code: `import { CodeBlock } from "@/components/ui/code-block"

<CodeBlock
  filename="create-profile.ts"
  language="ts"
  lineNumbers
  maxHeight={280}
  code={"const vows = ['nourishment', 'strength', 'prosperity']"}
/>`,
        wide: true,
        render: () => (
          <CodeBlock filename="create-profile.ts" language="ts" lineNumbers maxHeight={280} code={SAMPLE_CODE} />
        ),
      },
    ],
    props: [
      { name: "code", type: "string", description: "Source text — required." },
      { name: "filename", type: "string", description: "Header label; wins over language." },
      { name: "language", type: "string", description: "Fallback header label, e.g. ts." },
      { name: "lineNumbers", type: "boolean", default: "false", description: "Render the number gutter." },
      { name: "maxHeight", type: "number | string", description: "Clamp height with internal thin-scrollbar scrolling." },
      { name: "className", type: "string", description: "Extra classes." },
    ],
  },
  {
    id: "markdown",
    name: "Markdown",
    category: "layout",
    description: "react-markdown renderer with Saptapadi styling — serif headings, gold links, tidy lists and quotes.",
    demos: [
      {
        id: "article",
        title: "Article snippet",
        code: `import { Markdown } from "@/components/ui/markdown"

const md = "# Welcome\\n\\nCelebrate **forever** with *Saptapadi*.\\n\\n- Verified profiles\\n\\n> A wedding is a memory that outlives a lifetime."

<Markdown className="rounded-xl border p-6">{md}</Markdown>`,
        wide: true,
        render: () => (
          <div className="flex w-full justify-center">
            <Markdown className="w-full max-w-2xl rounded-xl border p-6">{SAMPLE_MARKDOWN}</Markdown>
          </div>
        ),
      },
    ],
    props: [
      { name: "children", type: "string", description: "Markdown source — required." },
      { name: "className", type: "string", description: "Style the wrapper, e.g. border p-6." },
    ],
  },
  {
    id: "rich-text",
    name: "RichText",
    category: "layout",
    description: "Renders trusted HTML with elegant prose styles; RichTextClamped adds line-clamping with a read-more toggle.",
    aliases: ["RichTextClamped"],
    demos: [
      {
        id: "html",
        title: "HTML + clamped variant",
        description: "The right column clamps to three lines until Read more is clicked.",
        code: `import { RichText, RichTextClamped } from "@/components/ui/rich-text"

const html = "<p>The <strong>Saptapadi</strong> seals seven promises.</p>"

<div className="rounded-xl border p-5">
  <RichText html={html} />
</div>

<div className="rounded-xl border p-5">
  <RichTextClamped html={longStory} lines={3} />
</div>`,
        wide: true,
        render: () => (
          <Grid cols={1} lgCols={2} gap="sm" className="w-full">
            <div className="rounded-xl border p-5">
              <RichText html={SAMPLE_HTML} />
            </div>
            <div className="rounded-xl border p-5">
              <RichTextClamped html={SAMPLE_HTML_LONG} lines={3} />
            </div>
          </Grid>
        ),
      },
    ],
    props: [
      { name: "html", type: "string", description: "Trusted HTML string — sanitize upstream if user-generated." },
      { name: "className", type: "string", description: "Style the prose wrapper." },
      { name: "lines", type: "number", default: "4", description: "RichTextClamped only — visible lines while collapsed." },
    ],
  },
  {
    id: "image",
    name: "Image",
    category: "layout",
    description: "next/image wrapper with rounded frame and optional caption — supports fixed and fill sizing.",
    demos: [
      {
        id: "captioned",
        title: "Captioned image",
        code: `import { Image } from "@/components/ui/media"

<Image
  src="https://picsum.photos/seed/markaui-face-2/400/400"
  alt="Ethan Brooks"
  width={400}
  height={300}
  caption="Ethan Brooks · Product Designer, Pune"
/>`,
        render: () => (
          <div className="flex w-full justify-center">
            <MediaImage
              src="https://picsum.photos/seed/markaui-face-2/400/400"
              alt="Ethan Brooks"
              width={400}
              height={300}
              caption="Ethan Brooks · Product Designer, Pune"
              className="w-full max-w-sm"
            />
          </div>
        ),
      },
    ],
    props: [
      { name: "src / alt", type: "string", description: "Image source and required alt text." },
      { name: "width / height", type: "number", description: "Intrinsic size — required unless fill is used." },
      { name: "fill", type: "boolean", default: "false", description: "Stretch to the parent; add a sized relative parent." },
      { name: "caption", type: "ReactNode", description: "Caption bar under the image." },
      { name: "className", type: "string", description: "Styles the rounded figure wrapper." },
      { name: "priority / sizes", type: "next/image props", description: "All next/image props pass through." },
    ],
  },
  {
    id: "video",
    name: "Video",
    category: "layout",
    description: "Rounded html5 video frame with aspect-video sizing, native controls and poster support.",
    demos: [
      {
        id: "sample",
        title: "Sample clip",
        description: "A real sample mp4 with a local poster frame.",
        code: `import { Video } from "@/components/ui/media"

<Video
  src="https://www.w3schools.com/html/mov_bbb.mp4"
  poster="/images/story-2.png"
  preload="metadata"
  className="w-full max-w-lg"
/>`,
        render: () => (
          <div className="flex w-full justify-center">
            <MediaVideo
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              poster="/images/story-2.png"
              preload="metadata"
              className="w-full max-w-lg"
            />
          </div>
        ),
      },
    ],
    props: [
      { name: "src", type: "string", description: "Video URL, or pass <source> children." },
      { name: "poster", type: "string", description: "Preview frame before playback." },
      { name: "controls", type: "boolean", default: "true", description: "Native controls." },
      { name: "preload", type: '"auto" | "metadata" | "none"', default: '"metadata"', description: "Loading hint." },
      { name: "className", type: "string", description: "Styles the rounded wrapper." },
    ],
  },
  {
    id: "audio",
    name: "Audio",
    category: "layout",
    description: "Styled audio player card — play / pause button, progress bar and duration, no native chrome.",
    demos: [
      {
        id: "player",
        title: "Player card",
        description: "Without a src the button is disabled — a graceful empty state for previewing tracks.",
        code: `import { Audio } from "@/components/ui/media"

<Audio title="Saptapadi Theme — Flute Suite" duration="3:24" />

<Audio
  title="Mehndi Voice Note"
  duration="0:48"
  src="https://www.w3schools.com/html/horse.ogg"
/>`,
        render: () => (
          <Stack gap="sm" className="w-full max-w-md">
            <MediaAudio title="Saptapadi Theme — Flute Suite" duration="3:24" />
            <MediaAudio
              title="Mehndi Voice Note"
              duration="0:48"
              src="https://www.w3schools.com/html/horse.ogg"
            />
          </Stack>
        ),
      },
    ],
    props: [
      { name: "src", type: "string", description: "Audio URL — omit for a disabled preview player." },
      { name: "title", type: "ReactNode", description: "Track title." },
      { name: "duration", type: "string", description: "Static duration label, e.g. 3:24." },
      { name: "className", type: "string", description: "Extra classes on the card." },
    ],
  },
  {
    id: "carousel",
    name: "Carousel",
    category: "layout",
    description: "Embla carousel with arrow buttons — snap points, drag and keyboard support out of the box.",
    demos: [
      {
        id: "wedding-stories",
        title: "Wedding stories",
        description: "Five cards with responsive basis — half-width on small screens, thirds on large.",
        code: `import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Heart } from "lucide-react"

<Carousel opts={{ align: "start" }} className="mx-12 w-full">
  <CarouselContent>
    {slides.map((slide) => (
      <CarouselItem key={slide.title} className="basis-full sm:basis-1/2 lg:basis-1/3">
        <div className="overflow-hidden rounded-xl border bg-card">
          <img src={slide.src} alt={slide.title} className="h-40 w-full object-cover" />
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-serif text-sm font-medium">{slide.title}</p>
              <p className="text-xs text-muted-foreground">{slide.place}</p>
            </div>
            <Heart className="size-4 text-gold" />
          </div>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
        wide: true,
        render: () => (
          <Carousel opts={{ align: "start" }} className="mx-12 w-full">
            <CarouselContent>
              {CAROUSEL_SLIDES.map((slide) => (
                <CarouselItem key={slide.title} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="overflow-hidden rounded-xl border bg-card">
                    <img src={slide.src} alt={slide.title} className="h-40 w-full object-cover" />
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="font-serif text-sm font-medium">{slide.title}</p>
                        <p className="text-xs text-muted-foreground">{slide.place}</p>
                      </div>
                      <Heart className="size-4 text-gold" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ),
      },
    ],
    props: [
      { name: "opts", type: "EmblaOptions", description: "Embla options, e.g. { align: 'start' }." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Scroll axis." },
      { name: "plugins", type: "EmblaPlugin[]", description: "Embla plugins (autoplay, fade…)." },
      { name: "setApi", type: "(api: CarouselApi) => void", description: "Grab the Embla API instance." },
      { name: "className", type: "string", description: "On items use basis-*; reserve side room for the arrows." },
    ],
  },
]
