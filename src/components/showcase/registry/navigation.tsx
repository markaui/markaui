"use client"

import * as React from "react"
import {
  Bell,
  Bookmark,
  CalendarHeart,
  ChevronsUpDown,
  Copy,
  Crown,
  Eye,
  Heart,
  HeartHandshake,
  Home,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  User,
  Users,
} from "lucide-react"

import type { ComponentDoc } from "./types"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/ui/icon-button"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "@/components/ui/menu"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Navbar } from "@/components/ui/navbar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Stepper } from "@/components/ui/stepper"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* ------------------------------------------------------------------ */
/* Demo components (module scope so hooks stay legal)                  */
/* ------------------------------------------------------------------ */

function NavbarDemo() {
  return (
    <Navbar
      className="static rounded-xl border shadow-sm"
      brand={
        <span className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-sm">
            <Heart className="size-4 fill-current" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold tracking-tight">
              Sapta<span className="text-gradient-gold">padi</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Matrimony
            </span>
          </span>
        </span>
      }
      links={[
        { label: "Discover", href: "#discover" },
        { label: "Matches", href: "#matches", active: true },
        { label: "Plans", href: "#plans" },
        { label: "Stories", href: "#stories" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <IconButton
            variant="outline"
            shape="circle"
            aria-label="Notifications"
            className="relative"
          >
            <Bell />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-gold" />
          </IconButton>
          <Button variant="gold" size="sm">
            Get Started
          </Button>
        </div>
      }
    />
  )
}

const sidebarItems = [
  { label: "Home", icon: Home },
  { label: "Search", icon: Search },
  { label: "Shortlists", icon: Heart },
  { label: "Settings", icon: Settings },
]

function SidebarDemo() {
  const [active, setActive] = React.useState(0)
  return (
    <SidebarProvider className="h-72 min-h-0 w-full overflow-hidden rounded-xl border">
      <Sidebar collapsible="none" className="border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold text-primary-foreground">
              <Heart className="size-3.5 fill-current" />
            </span>
            <span className="font-serif text-sm font-semibold">Saptapadi</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {sidebarItems.map((item, i) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={active === i}
                    tooltip={item.label}
                    onClick={() => setActive(i)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-1 flex-col items-start justify-center gap-1 p-4">
        <p className="text-sm font-medium">{sidebarItems[active].label}</p>
        <p className="text-xs text-muted-foreground">
          Click a menu item to switch sections.
        </p>
      </div>
    </SidebarProvider>
  )
}

const navServices = [
  {
    icon: HeartHandshake,
    title: "Matchmaking",
    description: "Handpicked profiles curated by expert relationship managers.",
  },
  {
    icon: Users,
    title: "Community Events",
    description: "Meet families at curated mixers and virtual meetups.",
  },
  {
    icon: CalendarHeart,
    title: "Wedding Planning",
    description: "Vendors, muhurat dates and checklists in one place.",
  },
  {
    icon: Crown,
    title: "Elite Assistance",
    description: "Priority visibility with a dedicated concierge.",
  },
]

function NavigationMenuDemo() {
  return (
    <div className="flex w-full items-center justify-center rounded-xl border p-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[26rem] gap-1 p-1 md:grid-cols-2">
                {navServices.map((service) => (
                  <NavigationMenuLink
                    key={service.title}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <service.icon className="size-4 text-gold" />
                      {service.title}
                    </span>
                    <p className="text-xs leading-snug text-muted-foreground">
                      {service.description}
                    </p>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              onClick={(e) => e.preventDefault()}
              className={navigationMenuTriggerStyle()}
            >
              Matches
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              onClick={(e) => e.preventDefault()}
              className={navigationMenuTriggerStyle()}
            >
              Plans
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5"
          >
            <Home className="size-3.5" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Profiles
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span className="text-muted-foreground/60">/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Ananya Sharma</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const tabProfiles = [
  {
    name: "Ananya Sharma",
    meta: "26 · Mumbai · Product Designer",
    initials: "AS",
  },
  {
    name: "Meera Iyer",
    meta: "28 · Chennai · Classical Dancer",
    initials: "MI",
  },
]

const tabMessages = [
  {
    name: "Rohan Mehta",
    snippet: "Namaste! Really liked your profile — shall we connect?",
    time: "2m",
    unread: true,
  },
  {
    name: "Iyer Family",
    snippet: "We would love to arrange a call this weekend.",
    time: "1h",
    unread: false,
  },
]

function TabsDemo() {
  const [showInSearch, setShowInSearch] = React.useState(true)
  const [emailAlerts, setEmailAlerts] = React.useState(false)
  const triggerClass =
    "flex-none rounded-none border-0 border-b-2 border-transparent px-1 pb-3 pt-2 shadow-none data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:text-primary"
  return (
    <Tabs defaultValue="matches" className="w-full">
      <TabsList className="h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b bg-transparent p-0 scrollbar-thin">
        <TabsTrigger value="matches" className={triggerClass}>
          <Heart /> Matches
        </TabsTrigger>
        <TabsTrigger value="messages" className={triggerClass}>
          <MessageCircle /> Messages
        </TabsTrigger>
        <TabsTrigger value="interests" className={triggerClass}>
          <Sparkles /> Interests
        </TabsTrigger>
        <TabsTrigger value="settings" className={triggerClass}>
          <Settings /> Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="matches" className="pt-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {tabProfiles.map((profile) => (
            <div
              key={profile.name}
              className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm"
            >
              <Avatar className="size-10 border">
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{profile.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile.meta}
                </p>
              </div>
              <Button variant="gold" size="sm">
                Interest
              </Button>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="messages" className="pt-4">
        <div className="flex flex-col divide-y rounded-xl border bg-card shadow-sm">
          {tabMessages.map((message) => (
            <div key={message.name} className="flex items-center gap-3 p-3">
              <Avatar className="size-9 border">
                <AvatarFallback className="bg-gold/15 text-xs font-semibold text-gold-foreground dark:text-gold">
                  {message.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{message.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {message.snippet}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">
                  {message.time}
                </span>
                {message.unread && (
                  <span className="size-2 rounded-full bg-gold" />
                )}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="interests" className="pt-4">
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">
            You received 12 new interests this week.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="gold">Ananya · 2h ago</Badge>
            <Badge variant="soft">Meera · 5h ago</Badge>
            <Badge variant="soft">Diya · Yesterday</Badge>
            <Badge variant="soft">Kavya · 2d ago</Badge>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="pt-4">
        <div className="flex max-w-md flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm">Show my profile in search</span>
            <Switch
              checked={showInSearch}
              onCheckedChange={setShowInSearch}
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm">Email me new matches</span>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </label>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function PaginationDemo() {
  const total = 6
  const [page, setPage] = React.useState(2)
  const goto = (p: number) => setPage(Math.min(total, Math.max(1, p)))
  const stop = (e: React.MouseEvent) => e.preventDefault()
  return (
    <div className="flex flex-col items-center gap-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              onClick={(e) => {
                stop(e)
                goto(page - 1)
              }}
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {[1, 2, 3].map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={page === p}
                onClick={(e) => {
                  stop(e)
                  setPage(p)
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={page === total}
              onClick={(e) => {
                stop(e)
                setPage(total)
              }}
            >
              {total}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === total}
              onClick={(e) => {
                stop(e)
                goto(page + 1)
              }}
              className={
                page === total ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-xs text-muted-foreground">
        Page {page} of {total} · 48 profiles
      </p>
    </div>
  )
}

const stepperSteps = [
  { id: "account", title: "Account", description: "Email and mobile" },
  { id: "details", title: "Details", description: "About you" },
  { id: "preferences", title: "Preferences", description: "Partner matching" },
  { id: "review", title: "Review", description: "Publish profile" },
]

function StepperDemo() {
  const [step, setStep] = React.useState(1)
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper
        steps={stepperSteps}
        current={step}
        onStepClick={(index) => setStep(index)}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {stepperSteps.length} —{" "}
          <span className="font-medium text-foreground">
            {stepperSteps[step].title}
          </span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          <Button
            size="sm"
            disabled={step === stepperSteps.length - 1}
            onClick={() => setStep((s) => Math.min(stepperSteps.length - 1, s + 1))}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

function StepperVerticalDemo() {
  const [step, setStep] = React.useState(1)
  return (
    <Stepper
      orientation="vertical"
      size="sm"
      steps={stepperSteps}
      current={step}
      onStepClick={(index) => setStep(index)}
      className="max-w-sm"
    />
  )
}

function CommandDemo() {
  const [lastAction, setLastAction] = React.useState("None yet")
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Command className="w-full max-w-md rounded-xl border shadow-sm">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="max-h-64">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => setLastAction("Search profiles")}>
              <Search />
              Search profiles
            </CommandItem>
            <CommandItem onSelect={() => setLastAction("Browse communities")}>
              <Users />
              Browse communities
            </CommandItem>
            <CommandItem onSelect={() => setLastAction("Upgrade plan")}>
              <Crown />
              Upgrade plan
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setLastAction("Open my profile")}>
              <User />
              Open my profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setLastAction("Privacy settings")}>
              <Shield />
              Privacy settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setLastAction("Log out")}>
              <LogOut />
              Log out
              <CommandShortcut>⌘Q</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <p className="text-xs text-muted-foreground">
        Last action:{" "}
        <span className="font-medium text-foreground">{lastAction}</span>
      </p>
    </div>
  )
}

function MenuDemo() {
  const [showInSearch, setShowInSearch] = React.useState(true)
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal />
          Preferences
        </Button>
      </MenuTrigger>
      <MenuContent className="w-56">
        <MenuLabel>Matching preferences</MenuLabel>
        <MenuCheckboxItem
          checked={showInSearch}
          onCheckedChange={(v) => setShowInSearch(v === true)}
        >
          Show me in search
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={false} onCheckedChange={() => {}}>
          Hide my last name
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuItem>
          <Bookmark />
          Saved searches
          <MenuShortcut>⌘S</MenuShortcut>
        </MenuItem>
        <MenuItem>
          <Bell />
          Notification settings
          <MenuShortcut>⇧⌘N</MenuShortcut>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

function ContextMenuDemo() {
  const [pinned, setPinned] = React.useState(false)
  const [lastAction, setLastAction] = React.useState("None yet")
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ContextMenu>
        <ContextMenuTrigger className="flex w-full max-w-md cursor-context-menu flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-10 text-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <p className="text-sm font-medium">Ananya Sharma · Profile #4821</p>
          <p className="text-xs text-muted-foreground">
            Right-click here to open the profile context menu.
          </p>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Profile actions</ContextMenuLabel>
          <ContextMenuItem onSelect={() => setLastAction("View profile")}>
            <Eye />
            View profile
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setLastAction("Copy link")}>
            <Copy />
            Copy profile link
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuCheckboxItem
            checked={pinned}
            onCheckedChange={(v) => setPinned(v === true)}
            onSelect={(e) => e.preventDefault()}
          >
            Pin to top
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onSelect={() => setLastAction("Remove profile")}
          >
            <Trash2 />
            Remove from matches
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-xs text-muted-foreground">
        Last action:{" "}
        <span className="font-medium text-foreground">{lastAction}</span>
      </p>
    </div>
  )
}

function DropdownMenuDemo() {
  return (
    <div className="flex items-start justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 rounded-full border pr-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                AS
              </AvatarFallback>
            </Avatar>
            <span className="flex flex-col items-start leading-none">
              <span className="text-sm font-medium">Ananya Sharma</span>
              <span className="text-[10px] text-muted-foreground">
                Premium member
              </span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">Ananya Sharma</p>
            <p className="text-xs font-normal text-muted-foreground">
              ananya@saptapadi.in
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User />
            My profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Heart />
            Saved matches
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Crown />
            Upgrade to Elite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function MenubarDemo() {
  const [showSidebar, setShowSidebar] = React.useState(true)
  const [compact, setCompact] = React.useState(false)
  return (
    <Menubar className="w-fit">
      <MenubarMenu>
        <MenubarTrigger>Profile</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New profile <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Share with family…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Export as PDF</MenubarItem>
          <MenubarItem disabled>Archive</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Delete profile</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find matches</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>By city</MenubarItem>
              <MenubarItem>By community</MenubarItem>
              <MenubarItem>By profession</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarCheckboxItem
            checked={showSidebar}
            onCheckedChange={(v) => setShowSidebar(v === true)}
            onSelect={(e) => e.preventDefault()}
          >
            Show sidebar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={compact}
            onCheckedChange={(v) => setCompact(v === true)}
            onSelect={(e) => e.preventDefault()}
          >
            Compact mode
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>My matches</MenubarItem>
          <MenubarItem>Recent visitors</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Full screen <MenubarShortcut>⌃⌘F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

/* ------------------------------------------------------------------ */
/* Registry docs                                                       */
/* ------------------------------------------------------------------ */

export const navigationDocs: ComponentDoc[] = [
  {
    id: "navbar",
    name: "Navbar",
    category: "navigation",
    description:
      "Sticky glass top navigation bar with brand, desktop link and action slots, plus a Sheet-based mobile menu on small screens.",
    aliases: ["Header", "AppBar"],
    demos: [
      {
        id: "premium",
        title: "Premium navbar",
        description:
          "Sticky by default (overridden to static here so the preview scrolls normally). Uses container queries — narrow the stage with the width toggle and the links collapse into the Sheet menu.",
        code: `import { Heart, Bell } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"

<Navbar
  brand={
    <span className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold text-primary-foreground shadow-sm">
        <Heart className="size-4 fill-current" />
      </span>
      <span className="font-serif text-lg font-semibold tracking-tight">
        Sapta<span className="text-gradient-gold">padi</span>
      </span>
    </span>
  }
  links={[
    { label: "Discover", href: "#discover" },
    { label: "Matches", href: "#matches", active: true },
    { label: "Plans", href: "#plans" },
    { label: "Stories", href: "#stories" },
  ]}
  actions={
    <div className="flex items-center gap-2">
      <IconButton variant="outline" shape="circle" aria-label="Notifications" className="relative">
        <Bell />
        <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-gold" />
      </IconButton>
      <Button variant="gold" size="sm">Get Started</Button>
    </div>
  }
/>`,
        render: () => <NavbarDemo />,
        wide: true,
      },
    ],
    props: [
      {
        name: "brand",
        type: "ReactNode",
        default: "—",
        description: "Brand slot on the left — logo mark plus serif wordmark.",
      },
      {
        name: "links",
        type: "NavbarLinkDef[]",
        default: "[]",
        description:
          "Desktop links: { label, href, active? }. Hidden behind the mobile Sheet below md.",
      },
      {
        name: "actions",
        type: "ReactNode",
        default: "—",
        description: "Right-aligned action area — icon buttons, CTAs, avatars.",
      },
      {
        name: "children",
        type: "ReactNode",
        default: "—",
        description: "Extra content between links and actions (e.g. search).",
      },
      {
        name: "transparent",
        type: "boolean",
        default: "false",
        description: "Remove the glass background and border.",
      },
    ],
  },
  {
    id: "sidebar",
    name: "Sidebar",
    category: "navigation",
    description:
      "Full shadcn sidebar system — provider, header, groups, menus and tooltips. Ships with a built-in TooltipProvider and keyboard shortcut.",
    demos: [
      {
        id: "static",
        title: "Inside a fixed-height container",
        description:
          "collapsible='none' renders the sidebar inline so it can live inside a bounded preview. Interactive: click the menu items.",
        code: `import { Home, Search } from "lucide-react"
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent,
  SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar"

<SidebarProvider className="h-72 min-h-0 overflow-hidden rounded-xl border">
  <Sidebar collapsible="none" className="border-r">
    <SidebarHeader>
      <span className="px-2 font-serif text-sm font-semibold">Saptapadi</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="Home">
              <Home /> <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Search">
              <Search /> <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <div className="flex flex-1 items-center p-4 text-sm text-muted-foreground">
    Content area — the provider already includes a TooltipProvider.
  </div>
</SidebarProvider>`,
        render: () => <SidebarDemo />,
        wide: true,
      },
    ],
    props: [
      {
        name: "collapsible",
        type: '"offcanvas" | "icon" | "none"',
        default: '"offcanvas"',
        description:
          "Collapse behaviour. Use none for a statically rendered sidebar inside a bounded container.",
      },
      {
        name: "side",
        type: '"left" | "right"',
        default: '"left"',
        description: "Which edge the sidebar docks to.",
      },
      {
        name: "variant",
        type: '"sidebar" | "floating" | "inset"',
        default: '"sidebar"',
        description: "Visual treatment of the sidebar container.",
      },
      {
        name: "open / onOpenChange",
        type: "boolean / (open: boolean) => void",
        default: "uncontrolled",
        description:
          "Controlled expanded state on SidebarProvider (persisted to a cookie).",
      },
      {
        name: "isActive",
        type: "boolean",
        default: "false",
        description: "Highlights a SidebarMenuButton as the active item.",
      },
    ],
  },
  {
    id: "navigation-menu",
    name: "NavigationMenu",
    category: "navigation",
    description:
      "Horizontal navigation menu with accessible dropdown panels and inline trigger-styled links.",
    demos: [
      {
        id: "services",
        title: "Matrimony services",
        description:
          "Hover or focus the Services trigger to open the dropdown panel; Matches and Plans are simple links.",
        code: `import { HeartHandshake, Users } from "lucide-react"
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Services</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[26rem] gap-1 p-1 md:grid-cols-2">
          <NavigationMenuLink href="#">
            <span className="flex items-center gap-2 text-sm font-medium">
              <HeartHandshake className="size-4 text-gold" /> Matchmaking
            </span>
            <p className="text-xs text-muted-foreground">
              Handpicked profiles curated by experts.
            </p>
          </NavigationMenuLink>
          <NavigationMenuLink href="#">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Users className="size-4 text-gold" /> Community Events
            </span>
            <p className="text-xs text-muted-foreground">
              Curated mixers and virtual meetups.
            </p>
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
        Matches
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
        render: () => <NavigationMenuDemo />,
        wide: true,
      },
    ],
    props: [
      {
        name: "viewport",
        type: "boolean",
        default: "true",
        description:
          "Render dropdown contents in a shared animated viewport below the menu.",
      },
      {
        name: "defaultValue",
        type: "string",
        default: "—",
        description: "Initially open NavigationMenuItem value (uncontrolled).",
      },
      {
        name: "value / onValueChange",
        type: "string / (value: string) => void",
        default: "uncontrolled",
        description: "Controlled open item.",
      },
      {
        name: "delayDuration",
        type: "number",
        default: "—",
        description: "Delay before the menu opens on hover.",
      },
    ],
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    category: "navigation",
    description:
      "Hierarchy trail with links, separators and a current-page item. Separators accept custom children.",
    demos: [
      {
        id: "profile",
        title: "Profile trail",
        description:
          "Home → Profiles → Ananya Sharma, with the last crumb rendered as the current page and a custom slash separator.",
        code: `import { Home } from "lucide-react"
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#" className="flex items-center gap-1.5">
        <Home className="size-3.5" /> Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Profiles</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <span className="text-muted-foreground/60">/</span>
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage>Ananya Sharma</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
        render: () => <BreadcrumbDemo />,
      },
    ],
    props: [
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "On BreadcrumbLink — merge props onto the child (e.g. a Next.js Link).",
      },
      {
        name: "children",
        type: "ReactNode",
        default: "ChevronRight",
        description:
          "On BreadcrumbSeparator — a custom separator icon or glyph.",
      },
      {
        name: "aria-current",
        type: '"page"',
        default: "set by BreadcrumbPage",
        description:
          "BreadcrumbPage marks the current page and is announced by screen readers.",
      },
      {
        name: "className",
        type: "string",
        default: "—",
        description:
          "Every subcomponent forwards className, e.g. to restyle BreadcrumbList.",
      },
    ],
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "navigation",
    description:
      "Accessible tab panels. Restyle TabsList/TabsTrigger for an underlined, premium look instead of the pill background.",
    demos: [
      {
        id: "underline",
        title: "Underlined premium tabs",
        description:
          "Matches, Messages, Interests and Settings with rich content panels. Fully keyboard navigable.",
        code: `import { Heart, MessageCircle, Sparkles, Settings } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const triggerClass =
  "flex-none rounded-none border-0 border-b-2 border-transparent px-1 pb-3 pt-2 shadow-none data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:text-primary"

<Tabs defaultValue="matches" className="w-full">
  <TabsList className="h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b bg-transparent p-0 scrollbar-thin">
    <TabsTrigger value="matches" className={triggerClass}><Heart /> Matches</TabsTrigger>
    <TabsTrigger value="messages" className={triggerClass}><MessageCircle /> Messages</TabsTrigger>
    <TabsTrigger value="interests" className={triggerClass}><Sparkles /> Interests</TabsTrigger>
    <TabsTrigger value="settings" className={triggerClass}><Settings /> Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="matches" className="pt-4">
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border bg-card p-3 shadow-sm">Profile card…</div>
      <div className="rounded-xl border bg-card p-3 shadow-sm">Profile card…</div>
    </div>
  </TabsContent>
  <TabsContent value="messages" className="pt-4">Message list…</TabsContent>
  <TabsContent value="interests" className="pt-4">Interest badges…</TabsContent>
  <TabsContent value="settings" className="pt-4">Switch rows…</TabsContent>
</Tabs>`,
        render: () => <TabsDemo />,
        wide: true,
      },
    ],
    props: [
      {
        name: "defaultValue",
        type: "string",
        default: "—",
        description: "Value of the initially active tab (uncontrolled).",
      },
      {
        name: "value / onValueChange",
        type: "string / (value: string) => void",
        default: "uncontrolled",
        description: "Controlled active tab.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description:
          "Set vertical for side tabs; style TabsList with flex-col.",
      },
      {
        name: "activationMode",
        type: '"automatic" | "manual"',
        default: '"automatic"',
        description:
          "Whether arrow keys activate tabs immediately or on Enter.",
      },
    ],
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "navigation",
    description:
      "Composable pagination built on Button variants — previous/next, numbered links and an ellipsis marker.",
    demos: [
      {
        id: "numbered",
        title: "Matches pagination",
        description:
          "Pages 1–6 with an ellipsis. Click numbers, Previous and Next — states update live.",
        code: `import { useState } from "react"
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@/components/ui/pagination"

function MatchesPagination() {
  const [page, setPage] = useState(2)
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
        </PaginationItem>
        {[1, 2, 3].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={page === p}
              onClick={(e) => { e.preventDefault(); setPage(p) }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive={page === 6}>6</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`,
        render: () => <PaginationDemo />,
      },
    ],
    props: [
      {
        name: "isActive",
        type: "boolean",
        default: "false",
        description: "Marks a PaginationLink as the current page (outline style).",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg" | "icon"',
        default: '"icon"',
        description:
          "PaginationLink size; Previous/Next use the default pill size.",
      },
      {
        name: "href",
        type: "string",
        default: "—",
        description:
          "Renders links as anchors; intercept clicks for client-side paging.",
      },
      {
        name: "aria-disabled",
        type: "boolean",
        default: "—",
        description:
          "Combine with pointer-events-none opacity-50 on Previous/Next at the bounds.",
      },
    ],
  },
  {
    id: "stepper",
    name: "Stepper",
    category: "navigation",
    description:
      "Numbered step indicator with check icons and connectors that fill with primary for completed steps. Supports click-to-navigate and a vertical layout.",
    aliases: ["Steps", "Wizard"],
    demos: [
      {
        id: "create-profile",
        title: "Create Profile flow",
        description:
          "Account → Details → Preferences → Review. Click any step or use Back / Continue.",
        code: `import { useState } from "react"
import { Stepper } from "@/components/ui/stepper"

const steps = [
  { id: "account", title: "Account", description: "Email and mobile" },
  { id: "details", title: "Details", description: "About you" },
  { id: "preferences", title: "Preferences", description: "Partner matching" },
  { id: "review", title: "Review", description: "Publish profile" },
]

function CreateProfileStepper() {
  const [step, setStep] = useState(1)
  return <Stepper steps={steps} current={step} onStepClick={setStep} />
}`,
        render: () => <StepperDemo />,
        wide: true,
      },
      {
        id: "vertical",
        title: "Vertical, small",
        description:
          "orientation='vertical' with size='sm' for onboarding panels and checkout rails.",
        code: `import { useState } from "react"
import { Stepper } from "@/components/ui/stepper"

function OnboardingStepper() {
  const [step, setStep] = useState(1)
  return (
    <Stepper
      orientation="vertical"
      size="sm"
      steps={[
        { id: "account", title: "Account", description: "Email and mobile" },
        { id: "details", title: "Details", description: "About you" },
        { id: "preferences", title: "Preferences", description: "Partner matching" },
        { id: "review", title: "Review", description: "Publish profile" },
      ]}
      current={step}
      onStepClick={setStep}
    />
  )
}`,
        render: () => <StepperVerticalDemo />,
      },
    ],
    props: [
      {
        name: "steps",
        type: "{ id, title, description? }[]",
        default: "—",
        description: "Step definitions rendered in order.",
      },
      {
        name: "current",
        type: "number",
        default: "—",
        description:
          "Controlled 0-based current index; steps before it are completed.",
      },
      {
        name: "defaultCurrent",
        type: "number",
        default: "0",
        description: "Initial index when uncontrolled.",
      },
      {
        name: "onStepClick",
        type: "(index: number, step: StepperStep) => void",
        default: "—",
        description: "Fired when a step is clicked; enables the interactive state.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout direction with matching connector alignment.",
      },
      {
        name: "size",
        type: '"sm" | "default"',
        default: '"default"',
        description: "Circle size.",
      },
    ],
  },
  {
    id: "command-menu",
    name: "CommandMenu",
    category: "navigation",
    description:
      "cmdk-powered command list with grouped items, shortcuts and fuzzy filtering — usable inline (this demo) or inside a Dialog via CommandDialog.",
    aliases: ["Command"],
    demos: [
      {
        id: "inline",
        title: "Inline command list",
        description:
          "Not in dialog mode: a bordered Command container with Suggestions and Actions groups. Type to filter, click to select.",
        code: `import { Search, Users, Crown, User } from "lucide-react"
import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
} from "@/components/ui/command"

<Command className="rounded-xl border shadow-sm">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem><Search /> Search profiles</CommandItem>
      <CommandItem><Users /> Browse communities</CommandItem>
      <CommandItem><Crown /> Upgrade plan</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem>
        <User /> Open my profile <CommandShortcut>⌘P</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
        render: () => <CommandDemo />,
        wide: true,
      },
    ],
    props: [
      {
        name: "value / onValueChange",
        type: "string / (value: string) => void",
        default: "uncontrolled",
        description: "Controlled search input value.",
      },
      {
        name: "shouldFilter",
        type: "boolean",
        default: "true",
        description:
          "Disable built-in filtering when you filter items yourself.",
      },
      {
        name: "loop",
        type: "boolean",
        default: "false",
        description: "Wrap arrow-key navigation at the ends of the list.",
      },
      {
        name: "heading",
        type: "string",
        default: "—",
        description: "Label rendered by CommandGroup.",
      },
      {
        name: "onSelect",
        type: "(value: string) => void",
        default: "—",
        description: "CommandItem selection handler.",
      },
    ],
  },
  {
    id: "menu",
    name: "Menu",
    category: "navigation",
    description:
      "Thin aliases over the dropdown-menu primitives — import Menu, MenuItem, MenuLabel, MenuSeparator, MenuCheckboxItem and MenuShortcut from a friendlier namespace.",
    demos: [
      {
        id: "preferences",
        title: "Preferences menu",
        description:
          "Same Radix behaviour as DropdownMenu, aliased names. The checkbox items toggle in place.",
        code: `import { Bookmark, Bell } from "lucide-react"
import {
  Menu, MenuTrigger, MenuContent, MenuLabel, MenuItem,
  MenuCheckboxItem, MenuSeparator, MenuShortcut,
} from "@/components/ui/menu"
import { Button } from "@/components/ui/button"

<Menu>
  <MenuTrigger asChild>
    <Button variant="outline">Preferences</Button>
  </MenuTrigger>
  <MenuContent className="w-56">
    <MenuLabel>Matching preferences</MenuLabel>
    <MenuCheckboxItem checked>Show me in search</MenuCheckboxItem>
    <MenuSeparator />
    <MenuItem>
      <Bookmark /> Saved searches <MenuShortcut>⌘S</MenuShortcut>
    </MenuItem>
    <MenuItem>
      <Bell /> Notification settings <MenuShortcut>⇧⌘N</MenuShortcut>
    </MenuItem>
  </MenuContent>
</Menu>`,
        render: () => <MenuDemo />,
      },
    ],
    props: [
      {
        name: "open / onOpenChange",
        type: "boolean / (open: boolean) => void",
        default: "uncontrolled",
        description: "Controlled open state on Menu (aliased DropdownMenu).",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Trap focus and close on outside click while open.",
      },
      {
        name: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "MenuItem variant for destructive actions.",
      },
      {
        name: "checked / onCheckedChange",
        type: "boolean / (checked: boolean) => void",
        default: "false",
        description: "Controlled state for MenuCheckboxItem.",
      },
      {
        name: "inset",
        type: "boolean",
        default: "false",
        description: "Align MenuItem/MenuLabel with items that show icons.",
      },
    ],
  },
  {
    id: "context-menu",
    name: "ContextMenu",
    category: "navigation",
    description:
      "Right-click context menu with items, checkbox items, shortcuts and destructive variants.",
    demos: [
      {
        id: "profile-card",
        title: "Profile card actions",
        description:
          "Right-click the dashed area. Pin to top stays open while toggling; Remove is destructive.",
        code: `import { Eye, Copy, Trash2 } from "lucide-react"
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuLabel,
  ContextMenuItem, ContextMenuCheckboxItem, ContextMenuSeparator, ContextMenuShortcut,
} from "@/components/ui/context-menu"

<ContextMenu>
  <ContextMenuTrigger className="rounded-xl border border-dashed p-10 text-center">
    Right-click here
  </ContextMenuTrigger>
  <ContextMenuContent className="w-56">
    <ContextMenuLabel>Profile actions</ContextMenuLabel>
    <ContextMenuItem><Eye /> View profile</ContextMenuItem>
    <ContextMenuItem>
      <Copy /> Copy profile link <ContextMenuShortcut>⌘C</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuCheckboxItem onSelect={(e) => e.preventDefault()}>
      Pin to top
    </ContextMenuCheckboxItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">
      <Trash2 /> Remove from matches
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
        render: () => <ContextMenuDemo />,
      },
    ],
    props: [
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Render an invisible overlay that closes the menu on click.",
      },
      {
        name: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "ContextMenuItem variant for destructive actions.",
      },
      {
        name: "checked / onCheckedChange",
        type: "boolean / (checked: boolean) => void",
        default: "false",
        description: "Controlled state for ContextMenuCheckboxItem.",
      },
      {
        name: "onSelect",
        type: "(event: Event) => void",
        default: "—",
        description:
          "Call event.preventDefault() inside a checkbox item to keep the menu open.",
      },
    ],
  },
  {
    id: "dropdown-menu",
    name: "DropdownMenu",
    category: "navigation",
    description:
      "Classic Radix dropdown for profile and action menus, with shortcut labels, groups and a destructive variant.",
    demos: [
      {
        id: "profile",
        title: "Profile dropdown",
        description:
          "Avatar trigger with member badge, account items with shortcuts, an upgrade nudge and destructive logout.",
        code: `import { User, Heart, Settings, Crown, LogOut, ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="gap-2 rounded-full border pr-3">
      <Avatar className="size-8">
        <AvatarFallback className="bg-primary/10 text-primary">AS</AvatarFallback>
      </Avatar>
      <ChevronsUpDown className="size-4 text-muted-foreground" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-60">
    <DropdownMenuLabel>
      <p className="text-sm font-medium">Ananya Sharma</p>
      <p className="text-xs text-muted-foreground">ananya@saptapadi.in</p>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User /> My profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Heart /> Saved matches <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem><Crown /> Upgrade to Elite</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <LogOut /> Log out <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
        render: () => <DropdownMenuDemo />,
      },
    ],
    props: [
      {
        name: "open / onOpenChange",
        type: "boolean / (open: boolean) => void",
        default: "uncontrolled",
        description: "Controlled open state.",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Trap focus and close on outside click while open.",
      },
      {
        name: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "DropdownMenuItem variant for destructive actions.",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "4",
        description: "Distance between the trigger and the content panel.",
      },
      {
        name: "inset",
        type: "boolean",
        default: "false",
        description: "Align items/labels with icon-bearing items.",
      },
    ],
  },
  {
    id: "menubar",
    name: "Menubar",
    category: "navigation",
    description:
      "Desktop-style horizontal menubar with nested submenus, checkbox items, shortcuts and destructive items.",
    demos: [
      {
        id: "app",
        title: "Profile / Edit / View",
        description:
          "Open Edit to see the working Find matches submenu and checkbox items that toggle in place.",
        code: `import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
  MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubTrigger,
  MenubarSubContent, MenubarCheckboxItem,
} from "@/components/ui/menubar"

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Profile</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New profile <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
      <MenubarItem>Share with family…</MenubarItem>
      <MenubarSeparator />
      <MenubarItem variant="destructive">Delete profile</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
      <MenubarSub>
        <MenubarSubTrigger>Find matches</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>By city</MenubarItem>
          <MenubarItem>By community</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarCheckboxItem onSelect={(e) => e.preventDefault()}>
        Show sidebar
      </MenubarCheckboxItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>My matches</MenubarItem>
      <MenubarItem>Recent visitors</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
        render: () => <MenubarDemo />,
      },
    ],
    props: [
      {
        name: "onValueChange",
        type: "(value: string) => void",
        default: "—",
        description: "Fires when the open MenubarMenu changes.",
      },
      {
        name: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "MenubarItem variant for destructive actions.",
      },
      {
        name: "checked / onCheckedChange",
        type: "boolean / (checked: boolean) => void",
        default: "false",
        description: "Controlled state for MenubarCheckboxItem.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables triggers and items.",
      },
    ],
  },
]
