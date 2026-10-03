import type { ComponentDoc } from "./types"

import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Link } from "@/components/ui/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { CircularProgress } from "@/components/ui/circular-progress"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Check,
  ChevronRight,
  Crown,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react"

export const coreDocs: ComponentDoc[] = [
  {
    id: "button",
    name: "Button",
    category: "core",
    description:
      "Primary action trigger with maroon, gold and gradient variants, a built-in loading state and left/right icon slots.",
    demos: [
      {
        id: "variants",
        title: "Variants",
        description:
          "Eight expressive flavours — from understated outline to the signature Saptapadi gradient.",
        code: `import { Button } from "@/components/ui/button"

<Button>Default</Button>
<Button variant="gold">Gold</Button>
<Button variant="gradient">Gradient</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="gold">Gold</Button>
            <Button variant="gradient">Gradient</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        ),
        wide: true,
      },
      {
        id: "sizes",
        title: "Sizes",
        description: "Four heights, from compact sm to celebratory xl.",
        code: `import { Button } from "@/components/ui/button"

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra large</Button>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra large</Button>
          </div>
        ),
      },
      {
        id: "loading-icons",
        title: "Loading & Icons",
        description:
          "The loading prop shows a spinner and disables the button; leftIcon and rightIcon add ornament.",
        code: `import { Button } from "@/components/ui/button"
import { Heart, ChevronRight } from "lucide-react"

<Button loading loadingText="Finding matches">
  Find matches
</Button>
<Button variant="gold" loading>Saving profile</Button>
<Button variant="outline" leftIcon={<Heart />}>Shortlist</Button>
<Button variant="gold" rightIcon={<ChevronRight />}>View profiles</Button>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button loading loadingText="Finding matches">
              Find matches
            </Button>
            <Button variant="gold" loading>Saving profile</Button>
            <Button variant="outline" leftIcon={<Heart />}>
              Shortlist
            </Button>
            <Button variant="gold" rightIcon={<ChevronRight />}>
              View profiles
            </Button>
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      {
        name: "variant",
        type: '"default" | "gold" | "gradient" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        default: '"default"',
        description: "Visual style of the button.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg" | "xl" | "icon"',
        default: '"default"',
        description: "Height and padding of the button.",
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "Shows a spinner and disables the button.",
      },
      {
        name: "loadingText",
        type: "string",
        default: "—",
        description: "Replaces the children with this text while loading.",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        default: "—",
        description: "Element rendered before the label (hidden while loading).",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        default: "—",
        description: "Element rendered after the label (hidden while loading).",
      },
      {
        name: "fullWidth",
        type: "boolean",
        default: "false",
        description: "Stretches the button to the full width of its container.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto the child element (Radix Slot).",
      },
    ],
  },
  {
    id: "icon-button",
    name: "IconButton",
    category: "core",
    description:
      "A square or circular button for icon-only actions, with variants, sizes and a loading state.",
    demos: [
      {
        id: "variants",
        title: "Variants",
        description: "All six colours, ready for toolbars and card actions.",
        code: `import { IconButton } from "@/components/ui/icon-button"
import { Search, Heart, Bell, Settings, Plus, Trash2 } from "lucide-react"

<IconButton aria-label="Search"><Search /></IconButton>
<IconButton variant="gold" aria-label="Favourites"><Heart /></IconButton>
<IconButton variant="outline" aria-label="Notifications"><Bell /></IconButton>
<IconButton variant="ghost" aria-label="Settings"><Settings /></IconButton>
<IconButton variant="secondary" aria-label="Add"><Plus /></IconButton>
<IconButton variant="destructive" aria-label="Remove"><Trash2 /></IconButton>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <IconButton aria-label="Search">
              <Search />
            </IconButton>
            <IconButton variant="gold" aria-label="Favourites">
              <Heart />
            </IconButton>
            <IconButton variant="outline" aria-label="Notifications">
              <Bell />
            </IconButton>
            <IconButton variant="ghost" aria-label="Settings">
              <Settings />
            </IconButton>
            <IconButton variant="secondary" aria-label="Add">
              <Plus />
            </IconButton>
            <IconButton variant="destructive" aria-label="Remove">
              <Trash2 />
            </IconButton>
          </div>
        ),
      },
      {
        id: "sizes-shapes",
        title: "Sizes & Shapes",
        description: "Five sizes; pair shape='circle' for round actions.",
        code: `import { IconButton } from "@/components/ui/icon-button"
import { Heart, Bell } from "lucide-react"

<IconButton size="xs" aria-label="Like"><Heart /></IconButton>
<IconButton size="sm" aria-label="Like"><Heart /></IconButton>
<IconButton size="default" aria-label="Like"><Heart /></IconButton>
<IconButton size="lg" shape="circle" variant="outline" aria-label="Notifications"><Bell /></IconButton>
<IconButton size="xl" shape="circle" variant="gold" aria-label="Like"><Heart /></IconButton>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <IconButton size="xs" aria-label="Like">
              <Heart />
            </IconButton>
            <IconButton size="sm" aria-label="Like">
              <Heart />
            </IconButton>
            <IconButton size="default" aria-label="Like">
              <Heart />
            </IconButton>
            <IconButton size="lg" aria-label="Like">
              <Heart />
            </IconButton>
            <IconButton
              size="lg"
              shape="circle"
              variant="outline"
              aria-label="Notifications"
            >
              <Bell />
            </IconButton>
            <IconButton
              size="xl"
              shape="circle"
              variant="gold"
              aria-label="Like"
            >
              <Heart />
            </IconButton>
          </div>
        ),
      },
      {
        id: "loading",
        title: "Loading",
        description: "Swap any icon for a spinner with the loading prop.",
        code: `import { IconButton } from "@/components/ui/icon-button"
import { Heart, Check, Share2 } from "lucide-react"

<IconButton loading aria-label="Sending interest"><Heart /></IconButton>
<IconButton variant="gold" shape="circle" loading aria-label="Saving"><Check /></IconButton>
<IconButton variant="outline" shape="circle" aria-label="Share"><Share2 /></IconButton>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <IconButton loading aria-label="Sending interest">
              <Heart />
            </IconButton>
            <IconButton variant="gold" shape="circle" loading aria-label="Saving">
              <Check />
            </IconButton>
            <IconButton variant="outline" shape="circle" aria-label="Share">
              <Share2 />
            </IconButton>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "variant",
        type: '"default" | "gold" | "outline" | "ghost" | "secondary" | "destructive"',
        default: '"default"',
        description: "Visual style of the button.",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description: "Side length of the square hit area.",
      },
      {
        name: "shape",
        type: '"square" | "circle"',
        default: '"square"',
        description: "Corner treatment — circle for fully round buttons.",
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "Replaces the icon with a spinner and disables the button.",
      },
      {
        name: "aria-label",
        type: "string",
        default: "—",
        description: "Required accessible label — icon-only buttons have no text.",
      },
    ],
  },
  {
    id: "button-group",
    name: "ButtonGroup",
    category: "core",
    description:
      "Groups related buttons with detached spacing or seamless attached borders, horizontally or vertically.",
    demos: [
      {
        id: "detached",
        title: "Detached",
        description: "Default grouped spacing for related profile actions.",
        code: `import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Heart, MessageCircle } from "lucide-react"

<ButtonGroup>
  <Button variant="outline" leftIcon={<Heart />}>Shortlist</Button>
  <Button variant="outline" leftIcon={<MessageCircle />}>Message</Button>
  <Button variant="gold">Express interest</Button>
</ButtonGroup>`,
        render: () => (
          <ButtonGroup>
            <Button variant="outline" leftIcon={<Heart />}>
              Shortlist
            </Button>
            <Button variant="outline" leftIcon={<MessageCircle />}>
              Message
            </Button>
            <Button variant="gold">Express interest</Button>
          </ButtonGroup>
        ),
        wide: true,
      },
      {
        id: "attached-horizontal",
        title: "Attached — Horizontal",
        description: "Seamless segmented control with shared borders.",
        code: `import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

<ButtonGroup attached>
  <Button variant="outline">Horoscope</Button>
  <Button variant="outline">Album</Button>
  <Button variant="outline">Contact</Button>
</ButtonGroup>`,
        render: () => (
          <ButtonGroup attached>
            <Button variant="outline">Horoscope</Button>
            <Button variant="outline">Album</Button>
            <Button variant="outline">Contact</Button>
          </ButtonGroup>
        ),
      },
      {
        id: "attached-vertical",
        title: "Attached — Vertical",
        description: "Stack icon buttons for a compact action rail.",
        code: `import { IconButton } from "@/components/ui/icon-button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Heart, MessageCircle, Share2 } from "lucide-react"

<ButtonGroup attached orientation="vertical">
  <IconButton variant="ghost" aria-label="Like"><Heart /></IconButton>
  <IconButton variant="ghost" aria-label="Comment"><MessageCircle /></IconButton>
  <IconButton variant="ghost" aria-label="Share"><Share2 /></IconButton>
</ButtonGroup>`,
        render: () => (
          <ButtonGroup attached orientation="vertical">
            <IconButton variant="ghost" aria-label="Like">
              <Heart />
            </IconButton>
            <IconButton variant="ghost" aria-label="Comment">
              <MessageCircle />
            </IconButton>
            <IconButton variant="ghost" aria-label="Share">
              <Share2 />
            </IconButton>
          </ButtonGroup>
        ),
      },
    ],
    props: [
      {
        name: "attached",
        type: "boolean",
        default: "false",
        description:
          "Attach children seamlessly — inner corners are squared and buttons share borders.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout direction of the group.",
      },
    ],
  },
  {
    id: "link",
    name: "Link",
    category: "core",
    description:
      "A styled anchor that renders Next.js Link for internal routes, with variants, icon slots and an external-link affordance.",
    demos: [
      {
        id: "variants",
        title: "Variants",
        description:
          "From quiet muted text to the signature gold — plus a nav variant for bars and footers.",
        code: `import { Link } from "@/components/ui/link"

<Link href="#">Default</Link>
<Link href="#" variant="muted">Muted</Link>
<Link href="#" variant="primary">Primary</Link>
<Link href="#" variant="gold">Gold</Link>
<Link href="#" variant="underline">Underline</Link>
<Link href="#" variant="nav">Nav</Link>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="#">Default</Link>
            <Link href="#" variant="muted">
              Muted
            </Link>
            <Link href="#" variant="primary">
              Primary
            </Link>
            <Link href="#" variant="gold">
              Gold
            </Link>
            <Link href="#" variant="underline">
              Underline
            </Link>
            <Link href="#" variant="nav">
              Nav
            </Link>
          </div>
        ),
        wide: true,
      },
      {
        id: "icons-external",
        title: "Icons & External",
        description:
          "Icon slots on either side; external adds target=_blank, rel=noopener and an ArrowUpRight glyph.",
        code: `import { Link } from "@/components/ui/link"
import { Heart, ChevronRight, Crown } from "lucide-react"

<Link href="#" size="sm" iconLeft={<Heart />}>Small with icon</Link>
<Link href="#" iconRight={<ChevronRight />}>Continue browsing</Link>
<Link href="#" size="lg" variant="gold" iconLeft={<Crown />}>Upgrade to gold</Link>
<Link href="https://saptapadi.example.com/rituals" external>Read the rituals</Link>`,
        render: () => (
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="#" size="sm" iconLeft={<Heart />}>
                Small with icon
              </Link>
              <Link href="#" iconRight={<ChevronRight />}>
                Continue browsing
              </Link>
              <Link href="#" size="lg" variant="gold" iconLeft={<Crown />}>
                Upgrade to gold
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="https://saptapadi.example.com/rituals" external>
                Read the rituals
              </Link>
              <Link href="https://saptapadi.example.com/safety" external variant="primary">
                Safety guidelines
              </Link>
            </div>
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      {
        name: "href",
        type: "string",
        default: "—",
        description:
          "Destination URL. Paths starting with '/' render a Next.js Link; others render a plain anchor.",
      },
      {
        name: "variant",
        type: '"default" | "muted" | "primary" | "gold" | "underline" | "nav"',
        default: '"default"',
        description: "Visual style of the link.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Font size of the label.",
      },
      {
        name: "external",
        type: "boolean",
        default: "false",
        description:
          "Opens in a new tab with rel='noopener noreferrer' and an ArrowUpRight icon.",
      },
      {
        name: "iconLeft",
        type: "React.ReactNode",
        default: "—",
        description: "Element rendered before the label.",
      },
      {
        name: "iconRight",
        type: "React.ReactNode",
        default: "—",
        description: "Element rendered after the label (ignored when external).",
      },
    ],
  },
  {
    id: "badge",
    name: "Badge",
    category: "core",
    description:
      "A compact status pill in nine variants with an optional status dot and icon support.",
    demos: [
      {
        id: "variants",
        title: "Variants & Dots",
        description:
          "Every variant, plus the dot prop for at-a-glance statuses.",
        code: `import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="gold">Gold</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="soft">Soft</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success" dot>Verified</Badge>
<Badge variant="warning" dot>Pending</Badge>
<Badge variant="info" dot>New match</Badge>
<Badge variant="gold" dot>Premium</Badge>
<Badge variant="outline">Outline</Badge>`,
        render: () => (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Default</Badge>
              <Badge variant="gold">Gold</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="soft">Soft</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success" dot>Verified</Badge>
              <Badge variant="warning" dot>Pending review</Badge>
              <Badge variant="info" dot>New match</Badge>
              <Badge variant="gold" dot>Premium</Badge>
              <Badge variant="destructive" dot>Inactive</Badge>
            </div>
          </div>
        ),
        wide: true,
      },
      {
        id: "icons",
        title: "With Icons",
        description: "Icons inherit the pill colour and shrink to fit.",
        code: `import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles, Heart, MapPin } from "lucide-react"

<Badge variant="success"><Check />Profile verified</Badge>
<Badge variant="gold"><Crown />Gold member</Badge>
<Badge variant="info"><Sparkles />96% match</Badge>
<Badge variant="soft"><Heart />42 interests</Badge>
<Badge variant="outline"><MapPin />Jaipur</Badge>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success">
              <Check />
              Profile verified
            </Badge>
            <Badge variant="gold">
              <Crown />
              Gold member
            </Badge>
            <Badge variant="info">
              <Sparkles />
              96% match
            </Badge>
            <Badge variant="soft">
              <Heart />
              42 interests
            </Badge>
            <Badge variant="outline">
              <MapPin />
              Jaipur
            </Badge>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "variant",
        type: '"default" | "gold" | "secondary" | "soft" | "destructive" | "success" | "warning" | "info" | "outline"',
        default: '"default"',
        description: "Visual style of the pill.",
      },
      {
        name: "dot",
        type: "boolean",
        default: "false",
        description: "Prepends a small status dot in the current text colour.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto the child element (Radix Slot).",
      },
    ],
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "core",
    description:
      "Profile photo with initials fallback, class-driven sizes, group stacking and status overlays.",
    demos: [
      {
        id: "sizes-fallback",
        title: "Sizes & Fallback",
        description:
          "Set size with size-* utilities; AvatarFallback renders initials while (or when no) image loads.",
        code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

<Avatar className="size-8"><AvatarFallback className="text-xs">EW</AvatarFallback></Avatar>
<Avatar className="size-10"><AvatarFallback>JD</AvatarFallback></Avatar>
<Avatar className="size-12"><AvatarFallback className="bg-primary text-primary-foreground">EW</AvatarFallback></Avatar>
<Avatar className="size-14"><AvatarFallback className="bg-gold text-gold-foreground">JD</AvatarFallback></Avatar>
<Avatar className="size-14"><AvatarFallback className="bg-chart-1/15 text-chart-1">SM</AvatarFallback></Avatar>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">EW</AvatarFallback>
            </Avatar>
            <Avatar className="size-10">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                EW
              </AvatarFallback>
            </Avatar>
            <Avatar className="size-14">
              <AvatarFallback className="bg-gold text-gold-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <Avatar className="size-14">
              <AvatarFallback className="bg-chart-1/15 text-chart-1">
                SM
              </AvatarFallback>
            </Avatar>
          </div>
        ),
        wide: true,
      },
      {
        id: "group-status",
        title: "Avatar Group & Status",
        description:
          "Overlap with -space-x-2 and ring-2 ring-background; add an absolute status dot for presence.",
        code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

<div className="flex -space-x-2 *:ring-2 *:ring-background">
  <Avatar className="size-10"><AvatarFallback className="text-xs">EW</AvatarFallback></Avatar>
  <Avatar className="size-10"><AvatarFallback className="text-xs">JD</AvatarFallback></Avatar>
  <Avatar className="size-10"><AvatarFallback className="text-xs">SM</AvatarFallback></Avatar>
  <Avatar className="size-10"><AvatarFallback className="text-xs">+9</AvatarFallback></Avatar>
</div>

<div className="relative w-fit">
  <Avatar className="size-12"><AvatarFallback className="bg-primary/15 text-primary">EW</AvatarFallback></Avatar>
  <span className="absolute right-0 bottom-0 size-3 rounded-full bg-success ring-2 ring-background" />
</div>`,
        render: () => (
          <div className="flex flex-col gap-6">
            <div className="flex -space-x-2 *:ring-2 *:ring-background">
              <Avatar className="size-10">
                <AvatarFallback className="bg-chart-1/15 text-chart-1 text-xs">
                  EW
                </AvatarFallback>
              </Avatar>
              <Avatar className="size-10">
                <AvatarFallback className="bg-chart-2/15 text-chart-2 text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <Avatar className="size-10">
                <AvatarFallback className="bg-chart-3/15 text-chart-3 text-xs">
                  SM
                </AvatarFallback>
              </Avatar>
              <Avatar className="size-10">
                <AvatarFallback className="bg-chart-4/15 text-chart-4 text-xs">
                  NV
                </AvatarFallback>
              </Avatar>
              <Avatar className="size-10">
                <AvatarFallback className="text-xs">+9</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative w-fit">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary/15 text-primary">
                    EW
                  </AvatarFallback>
                </Avatar>
                <span
                  className="absolute right-0 bottom-0 size-3 rounded-full bg-success ring-2 ring-background"
                  aria-label="Online"
                />
              </div>
              <div className="relative w-fit">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-gold/20 text-gold-foreground dark:text-gold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -top-1.5 -right-2 px-1.5" variant="gold">
                  Pro
                </Badge>
              </div>
            </div>
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      {
        name: "className",
        type: "string",
        default: "size-8",
        description: "Applied to the root — set size with Tailwind size utilities.",
      },
      {
        name: "delayMs",
        type: "number",
        default: "0",
        description: "Delay before the fallback is rendered (prevents flashing).",
      },
      {
        name: "src",
        type: "string",
        default: "—",
        description: "Image source, passed to AvatarImage.",
      },
      {
        name: "alt",
        type: "string",
        default: "—",
        description: "Alt text for the image, passed to AvatarImage.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        default: "—",
        description: "Place AvatarFallback (initials) inside for missing or failed images.",
      },
    ],
  },
  {
    id: "separator",
    name: "Separator",
    category: "core",
    description:
      "A thin thematic divider — horizontal or vertical — with decorative label layouts.",
    demos: [
      {
        id: "orientations",
        title: "Orientations & Label",
        description: "Horizontal rules, vertical rails, and an ornamental label divider.",
        code: `import { Separator } from "@/components/ui/separator"

<Separator />
<Separator orientation="vertical" className="h-10" />

<div className="flex items-center gap-4">
  <Separator className="flex-1" />
  <span className="text-xs uppercase tracking-widest text-muted-foreground">Saptapadi</span>
  <Separator className="flex-1" />
</div>`,
        render: () => (
          <div className="flex w-full max-w-md flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-serif text-sm font-medium">Emma &amp; Chris</p>
              <Separator />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Horoscope matched</span>
                <span className="tabular-nums">96%</span>
              </div>
            </div>
            <div className="flex h-12 items-center gap-4">
              <p className="text-xs text-muted-foreground">Vertical</p>
              <Separator orientation="vertical" className="h-10" />
              <p className="text-xs text-muted-foreground">Between text</p>
              <Separator orientation="vertical" className="h-10" />
              <p className="text-xs text-muted-foreground">Columns</p>
            </div>
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Saptapadi
              </span>
              <Separator className="flex-1" />
            </div>
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Direction of the rule.",
      },
      {
        name: "decorative",
        type: "boolean",
        default: "true",
        description:
          "When true, screen readers ignore it; set false to expose it as a role=separator.",
      },
      {
        name: "className",
        type: "string",
        default: "—",
        description: "Set explicit heights for vertical separators (e.g. h-10).",
      },
    ],
  },
  {
    id: "spinner",
    name: "Spinner",
    category: "core",
    description:
      "A lightweight CSS loading indicator in five sizes, colourable through text utilities.",
    demos: [
      {
        id: "sizes-colors",
        title: "Sizes & Colors",
        description: "size prop from xs to xl; recolour any instance with a text-* class.",
        code: `import { Spinner } from "@/components/ui/spinner"

<Spinner size="sm" />
<Spinner size="default" />
<Spinner size="xl" />
<Spinner className="text-gold" />
<Spinner className="text-info" />
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <Spinner size="sm" /> Finding matches…
</div>`,
        render: () => (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-6">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="default" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Spinner className="text-gold" />
              <Spinner className="text-success" />
              <Spinner className="text-info" />
              <Spinner className="text-destructive" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner size="sm" />
                Finding matches…
              </div>
            </div>
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      {
        name: "size",
        type: '"xs" | "sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description: "Diameter of the spinning ring.",
      },
      {
        name: "label",
        type: "string",
        default: '"Loading…"',
        description: "Accessible status text announced to screen readers.",
      },
      {
        name: "className",
        type: "string",
        default: "—",
        description: "Override the colour with text-* utilities (e.g. text-gold).",
      },
    ],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    category: "core",
    description: "A shimmering placeholder block for composing loading states.",
    demos: [
      {
        id: "profile-card",
        title: "Profile Card Skeleton",
        description:
          "Compose circles, bars and blocks into a believable loading layout for a profile card.",
        code: `import { Skeleton } from "@/components/ui/skeleton"

<div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
  <div className="flex items-center gap-4">
    <Skeleton className="size-14 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="size-9 rounded-lg" />
  </div>
  <div className="mt-6 space-y-2">
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
    <Skeleton className="h-3 w-2/3" />
  </div>
  <div className="mt-6 flex gap-2">
    <Skeleton className="h-9 flex-1 rounded-lg" />
    <Skeleton className="h-9 w-28 rounded-lg" />
  </div>
</div>`,
        render: () => (
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="size-9 rounded-lg" />
            </div>
            <div className="mt-6 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="mt-6 flex gap-2">
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      {
        name: "className",
        type: "string",
        default: "—",
        description: "Shape the placeholder with size, width and rounded utilities.",
      },
    ],
  },
  {
    id: "progress",
    name: "Progress",
    category: "core",
    description:
      "A linear determinate progress bar; recolour the indicator through className overrides on the root.",
    aliases: ["ProgressBar"],
    demos: [
      {
        id: "values",
        title: "Values",
        description: "Pair with labels and tabular numbers for polished readouts.",
        code: `import { Progress } from "@/components/ui/progress"

<div className="w-full max-w-md space-y-1.5">
  <div className="flex justify-between text-sm">
    <span>Profile completion</span>
    <span className="text-muted-foreground tabular-nums">85%</span>
  </div>
  <Progress value={85} />
  <Progress value={62} />
  <Progress value={34} />
</div>`,
        render: () => (
          <div className="flex w-full max-w-md flex-col gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Profile completion</span>
                <span className="text-muted-foreground tabular-nums">85%</span>
              </div>
              <Progress value={85} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Horoscope analysis</span>
                <span className="text-muted-foreground tabular-nums">62%</span>
              </div>
              <Progress value={62} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Album uploads</span>
                <span className="text-muted-foreground tabular-nums">34%</span>
              </div>
              <Progress value={34} />
            </div>
          </div>
        ),
      },
      {
        id: "colors",
        title: "Colors",
        description:
          "Target the indicator data-slot to paint the fill in any semantic colour.",
        code: `import { Progress } from "@/components/ui/progress"

<Progress value={72} className="[&>[data-slot=progress-indicator]]:bg-gold" />
<Progress value={58} className="[&>[data-slot=progress-indicator]]:bg-success" />
<Progress value={44} className="[&>[data-slot=progress-indicator]]:bg-info" />
<Progress value={26} className="[&>[data-slot=progress-indicator]]:bg-destructive" />`,
        render: () => (
          <div className="flex w-full max-w-md flex-col gap-4">
            <Progress value={90} />
            <Progress
              value={72}
              className="[&>[data-slot=progress-indicator]]:bg-gold"
            />
            <Progress
              value={58}
              className="[&>[data-slot=progress-indicator]]:bg-success"
            />
            <Progress
              value={44}
              className="[&>[data-slot=progress-indicator]]:bg-info"
            />
            <Progress
              value={26}
              className="[&>[data-slot=progress-indicator]]:bg-destructive"
            />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "value",
        type: "number",
        default: "—",
        description: "Progress from 0 to max (0–100 by default).",
      },
      {
        name: "max",
        type: "number",
        default: "100",
        description: "Maximum value the bar represents.",
      },
      {
        name: "className",
        type: "string",
        default: "—",
        description:
          "Style the root; use [&>[data-slot=progress-indicator]]:bg-* to recolour the fill.",
      },
    ],
  },
  {
    id: "circular-progress",
    name: "CircularProgress",
    category: "core",
    description:
      "A smooth SVG progress ring with a value label, six colour options and an animated indeterminate mode.",
    aliases: ["ProgressCircle"],
    demos: [
      {
        id: "values-colors",
        title: "Values & Colors",
        description:
          "Rounded caps with a soft track in every semantic colour; showValue prints the percentage.",
        code: `import { CircularProgress } from "@/components/ui/circular-progress"

<CircularProgress value={92} showValue />
<CircularProgress value={76} showValue color="gold" />
<CircularProgress value={58} showValue color="success" />
<CircularProgress value={34} showValue color="warning" />
<CircularProgress value={15} showValue color="destructive" />`,
        render: () => (
          <div className="flex flex-wrap items-center gap-6">
            <CircularProgress value={92} showValue aria-label="Profile strength" />
            <CircularProgress value={76} showValue color="gold" aria-label="Gold score" />
            <CircularProgress value={58} showValue color="success" aria-label="Verification" />
            <CircularProgress value={34} showValue color="warning" aria-label="Pending" />
            <CircularProgress value={15} showValue color="destructive" aria-label="Risk" />
          </div>
        ),
      },
      {
        id: "label-thickness",
        title: "Label & Thickness",
        description: "Scale the ring and pair a caption with the numeric value.",
        code: `import { CircularProgress } from "@/components/ui/circular-progress"

<CircularProgress value={84} showValue label="Match" size={88} thickness={8} color="gold" />
<CircularProgress value={66} label="Horoscope" size={72} thickness={5} color="info" />
<CircularProgress value={40} label="Album" size={72} thickness={5} color="success" />`,
        render: () => (
          <div className="flex flex-wrap items-center gap-8">
            <CircularProgress
              value={84}
              showValue
              label="Match"
              size={88}
              thickness={8}
              color="gold"
            />
            <CircularProgress
              value={66}
              label="Horoscope"
              size={72}
              thickness={5}
              color="info"
            />
            <CircularProgress
              value={40}
              label="Album"
              size={72}
              thickness={5}
              color="success"
            />
          </div>
        ),
      },
      {
        id: "indeterminate",
        title: "Indeterminate",
        description:
          "Omit the value to run a travelling dash animation — perfect for unknown durations.",
        code: `import { CircularProgress } from "@/components/ui/circular-progress"

<CircularProgress size={40} thickness={4} aria-label="Loading matches" />
<CircularProgress color="gold" size={56} thickness={5} label="Loading" />
<CircularProgress color="info" size={72} thickness={6} />`,
        render: () => (
          <div className="flex flex-wrap items-center gap-8">
            <CircularProgress size={40} thickness={4} aria-label="Loading matches" />
            <CircularProgress color="gold" size={56} thickness={5} label="Loading" />
            <CircularProgress color="info" size={72} thickness={6} />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "value",
        type: "number",
        default: "—",
        description: "Progress from 0 to 100. Omit for the indeterminate animation.",
      },
      {
        name: "size",
        type: "number",
        default: "64",
        description: "Outer diameter of the ring in pixels.",
      },
      {
        name: "thickness",
        type: "number",
        default: "6",
        description: "Stroke width in pixels.",
      },
      {
        name: "color",
        type: '"primary" | "gold" | "success" | "warning" | "destructive" | "info"',
        default: '"primary"',
        description: "Colour of the value arc and its track.",
      },
      {
        name: "showValue",
        type: "boolean",
        default: "false",
        description: "Prints the percentage in the centre.",
      },
      {
        name: "label",
        type: "string",
        default: "—",
        description: "Centre caption, shown under the value and used as aria-label.",
      },
    ],
  },
  {
    id: "tooltip",
    name: "Tooltip",
    category: "core",
    description:
      "A small floating label revealed on hover or focus, with four side placements.",
    demos: [
      {
        id: "sides",
        title: "Four Sides",
        description: "Place tooltips on any side; the arrow follows automatically.",
        code: `import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

<Tooltip>
  <TooltipTrigger asChild><Button variant="outline" size="sm">Top</Button></TooltipTrigger>
  <TooltipContent side="top">Top tooltip</TooltipContent>
</Tooltip>
<Tooltip>
  <TooltipTrigger asChild><Button variant="outline" size="sm">Right</Button></TooltipTrigger>
  <TooltipContent side="right">Right tooltip</TooltipContent>
</Tooltip>`,
        render: () => (
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Top</Button>
              </TooltipTrigger>
              <TooltipContent side="top">Top tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Bottom</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Left</Button>
              </TooltipTrigger>
              <TooltipContent side="left">Left tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Right</Button>
              </TooltipTrigger>
              <TooltipContent side="right">Right tooltip</TooltipContent>
            </Tooltip>
          </div>
        ),
      },
      {
        id: "styled",
        title: "Styled Content",
        description:
          "Richer markup inside the content — a title, a caption, and a custom sideOffset.",
        code: `import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="gold" leftIcon={<Sparkles />}>Match score</Button>
  </TooltipTrigger>
  <TooltipContent sideOffset={8} className="w-48">
    <p className="font-semibold">96% compatible</p>
    <p className="opacity-80">Horoscope, values and lifestyle aligned.</p>
  </TooltipContent>
</Tooltip>`,
        render: () => (
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="gold" leftIcon={<Sparkles />}>
                  Match score
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8} className="w-48">
                <p className="font-semibold">96% compatible</p>
                <p className="opacity-80">
                  Horoscope, values and lifestyle aligned.
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton variant="outline" aria-label="Details">
                  <Info />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                Verified profiles reply within 24 hours.
              </TooltipContent>
            </Tooltip>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"top"',
        description: "Preferred side of the trigger (on TooltipContent).",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description: "Alignment along the chosen side (on TooltipContent).",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "0",
        description: "Distance in pixels between the tooltip and the trigger.",
      },
      {
        name: "delayDuration",
        type: "number",
        default: "0",
        description: "Milliseconds to wait before opening.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Render the tooltip open on mount (uncontrolled).",
      },
    ],
  },
  {
    id: "popover",
    name: "Popover",
    category: "core",
    description:
      "A floating card anchored to a trigger — ideal for compact forms and profile previews.",
    demos: [
      {
        id: "profile-card",
        title: "Profile Card Popover",
        description:
          "A mini profile preview with badges and quick actions, opened from a button.",
        code: `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

<Popover>
  <PopoverTrigger asChild><Button variant="outline">View profile</Button></PopoverTrigger>
  <PopoverContent className="w-72">
    <div className="flex items-start gap-3">
      <Avatar className="size-12"><AvatarFallback className="bg-primary/15 text-primary">EW</AvatarFallback></Avatar>
      <div>
        <p className="text-sm font-semibold">Emma Wilson</p>
        <p className="text-xs text-muted-foreground">Jaipur, Rajasthan</p>
      </div>
      <Badge variant="gold">Pro</Badge>
    </div>
    <div className="mt-4 flex gap-2">
      <Button size="sm" variant="gold" className="flex-1">Connect</Button>
      <Button size="sm" variant="outline" className="flex-1">Message</Button>
    </div>
  </PopoverContent>
</Popover>`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3 py-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" leftIcon={<UserPlus />}>
                  View profile
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="flex items-start gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/15 text-primary">
                      EW
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      Emma Wilson
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      Jaipur, Rajasthan
                    </p>
                  </div>
                  <Badge variant="gold">Pro</Badge>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Product designer who loves heritage walks and filter coffee.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="soft">Design</Badge>
                  <Badge variant="soft">Travel</Badge>
                  <Badge variant="soft">Classical dance</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="gold" className="flex-1">
                    Connect
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Message
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ),
        wide: true,
      },
      {
        id: "form",
        title: "Form in Popover (Custom Width)",
        description:
          "Compose Input and Button inside a wider popover for a focused micro-form.",
        code: `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

<Popover>
  <PopoverTrigger asChild><Button variant="gold">Invite to connect</Button></PopoverTrigger>
  <PopoverContent className="w-80">
    <p className="font-serif text-base font-semibold">Send an invite</p>
    <p className="text-xs text-muted-foreground">Introduce yourself with a short note.</p>
    <div className="mt-4 space-y-3">
      <Input placeholder="Your name" aria-label="Your name" />
      <Input placeholder="Short message (optional)" aria-label="Message" />
      <Button className="w-full">Send invite</Button>
    </div>
  </PopoverContent>
</Popover>`,
        render: () => (
          <div className="py-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="gold" leftIcon={<Sparkles />}>
                  Invite to connect
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-1 text-left">
                  <p className="font-serif text-base font-semibold">
                    Send an invite
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Introduce yourself with a short note.
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  <Input placeholder="Your name" aria-label="Your name" />
                  <Input
                    placeholder="Short message (optional)"
                    aria-label="Message"
                  />
                  <Button className="w-full" rightIcon={<Heart />}>
                    Send invite
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        default: "—",
        description: "Controlled open state.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Open on mount (uncontrolled).",
      },
      {
        name: "modal",
        type: "boolean",
        default: "false",
        description: "Trap focus and block outside interaction while open.",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description: "Alignment of the content relative to the trigger.",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "4",
        description: "Gap between the trigger and the popover content.",
      },
    ],
  },
  {
    id: "hover-card",
    name: "HoverCard",
    category: "core",
    description:
      "A rich preview card that appears while hovering a trigger — perfect for user profiles.",
    demos: [
      {
        id: "user-preview",
        title: "User Preview",
        description:
          "Avatar, bio and a compact stat row, revealed non-destructively on hover.",
        code: `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Star } from "lucide-react"

<HoverCard>
  <HoverCardTrigger asChild>
    <button type="button" className="...">@chris.doe</button>
  </HoverCardTrigger>
  <HoverCardContent className="w-72">
    <div className="flex items-start gap-3">
      <Avatar className="size-12"><AvatarFallback className="bg-gold/20 text-gold-foreground dark:text-gold">JD</AvatarFallback></Avatar>
      <div>
        <p className="text-sm font-semibold">Chris Miller</p>
        <p className="text-xs text-muted-foreground">@chris.doe</p>
      </div>
      <Badge variant="success" dot>Online</Badge>
    </div>
    <p className="mt-3 text-xs text-muted-foreground">Architect from Mumbai.</p>
    <div className="mt-4 flex items-center gap-5 text-xs text-muted-foreground">
      <span>128 interests</span>
      <span>42 chats</span>
      <span>4.9 rating</span>
    </div>
  </HoverCardContent>
</HoverCard>`,
        render: () => (
          <div className="flex flex-wrap items-center justify-center gap-3 py-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-md"
                >
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-gold/20 text-gold-foreground dark:text-gold text-[10px]">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  @chris.doe
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-72">
                <div className="flex items-start gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-gold/20 text-gold-foreground dark:text-gold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">Chris Miller</p>
                    <p className="text-xs text-muted-foreground">
                      @chris.doe
                    </p>
                  </div>
                  <Badge variant="success" dot>
                    Online
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Architect from Mumbai. Weekend trekker and admirer of
                  Indo-Saracenic design.
                </p>
                <div className="mt-4 flex items-center gap-5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5 text-destructive" />
                    128 interests
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3.5 text-info" />
                    42 chats
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 text-gold" />
                    4.9
                  </span>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Open on mount (uncontrolled).",
      },
      {
        name: "openDelay",
        type: "number",
        default: "0",
        description: "Milliseconds before the card opens after hover.",
      },
      {
        name: "closeDelay",
        type: "number",
        default: "0",
        description: "Milliseconds before the card closes after the pointer leaves.",
      },
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"bottom"',
        description: "Preferred side of the trigger (on HoverCardContent).",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description: "Alignment along the chosen side (on HoverCardContent).",
      },
    ],
  },
]
