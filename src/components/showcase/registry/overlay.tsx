"use client"

import * as React from "react"

import type { ComponentDoc } from "./types"

import {
  Bookmark,
  ChevronRight,
  Eye,
  Gem,
  Heart,
  LogOut,
  MessageCircle,
  Send,
  Settings,
  SlidersHorizontal,
  Trash2,
  User,
  Bell,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Lightbox } from "@/components/ui/lightbox"
import {
  Notification,
  NotificationList,
  type NotificationItem,
} from "@/components/ui/notification"
import { toast } from "@/hooks/use-toast"

/* ---------------------------------- demos --------------------------------- */

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button leftIcon={<Send aria-hidden="true" />}>Send Interest</Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-gold/40 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Send Interest to Emma
          </DialogTitle>
          <DialogDescription>
            She will be notified instantly. Interests with a short note get 3x
            more responses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Write a short note (optional)" />
          <p className="text-xs text-muted-foreground">
            Free members can send 5 interests per day. You have 3 left today.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Maybe later</Button>
          </DialogClose>
          <Button variant="gold">Send interest</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const modalSizes = ["sm", "md", "lg"] as const

function ModalSizesDemo() {
  const [openSize, setOpenSize] = React.useState<
    "sm" | "md" | "lg" | null
  >(null)

  return (
    <div className="flex flex-wrap items-center gap-3">
      {modalSizes.map((size) => (
        <Button
          key={size}
          variant="outline"
          onClick={() => setOpenSize(size)}
        >
          Open {size.toUpperCase()} modal
        </Button>
      ))}
      {modalSizes.map((size) => (
        <Modal
          key={size}
          open={openSize === size}
          onOpenChange={(open) => setOpenSize(open ? size : null)}
          size={size}
          title={"Profile visibility (" + size.toUpperCase() + ")"}
          description="Choose who can see your full profile and photos."
        >
          <ModalBody className="space-y-2">
            <p className="text-muted-foreground">
              Matched members only, all verified members, or everyone on
              Saptapadi — your privacy, your rules.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="gold" dot>
                Gold members
              </Badge>
              <Badge variant="soft">Verified only</Badge>
              <Badge variant="outline">Everyone</Badge>
            </div>
          </ModalBody>
        </Modal>
      ))}
    </div>
  )
}

function ModalFooterDemo() {
  const [open, setOpen] = React.useState(false)
  const [sending, setSending] = React.useState(false)

  const handleConfirm = () => {
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setOpen(false)
    }, 1400)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="gold" onClick={() => setOpen(true)}>
        Open RSVP modal
      </Button>
      <Modal
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setSending(false)
        }}
        title="Confirm your attendance"
        description="Emma and John would love to have you at the sangeet night."
        footer={
          <ModalFooter>
            <Button
              variant="outline"
              disabled={sending}
              onClick={() => setOpen(false)}
            >
              Maybe later
            </Button>
            <Button
              variant="gold"
              loading={sending}
              loadingText="Sending..."
              onClick={handleConfirm}
            >
              Confirm attendance
            </Button>
          </ModalFooter>
        }
      >
        <ModalBody className="space-y-3">
          <Input placeholder="Your full name" />
          <Input placeholder="Number of guests attending" />
          <p className="text-xs text-muted-foreground">
            The confirming button keeps a loading state and closes the modal
            when done.
          </p>
        </ModalBody>
      </Modal>
    </div>
  )
}

function DrawerProfileDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" leftIcon={<Eye aria-hidden="true" />}>
          Quick view profile
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-2xl">
        <DrawerHeader className="items-center gap-2">
          <Avatar className="size-16 ring-gold-soft">
            <AvatarImage
              src="https://picsum.photos/seed/markaui-face-1/400/400"
              alt="Emma Wilson"
            />
            <AvatarFallback>EW</AvatarFallback>
          </Avatar>
          <DrawerTitle className="font-serif text-lg">
            Emma Wilson, 26
          </DrawerTitle>
          <DrawerDescription>
            Mumbai, India • Content strategist • 5 ft 4 in • Vegetarian
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-3 gap-2 px-4 pb-2">
          <Button
            variant="gold"
            className="h-auto flex-col gap-1 py-3 text-xs"
          >
            <Heart aria-hidden="true" />
            Send Interest
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-1 py-3 text-xs"
          >
            <Bookmark aria-hidden="true" />
            Shortlist
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-1 py-3 text-xs"
          >
            <MessageCircle aria-hidden="true" />
            Chat
          </Button>
        </div>
        <DrawerFooter className="pt-0">
          <DrawerClose asChild>
            <Button variant="ghost" fullWidth>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const sheetNavItems = [
  { icon: User, label: "My profile" },
  { icon: Heart, label: "Interests received" },
  { icon: MessageCircle, label: "Messages" },
  { icon: Bell, label: "Notification settings" },
  { icon: Settings, label: "Preferences" },
]

const visibilityOptions = [
  "Everyone on Saptapadi",
  "Verified members only",
  "Matched members only",
]

function SheetNavDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Account menu (right)</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle className="font-serif">
              Namaste, Emma
            </SheetTitle>
            <SheetDescription>Your Saptapadi account</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-3">
            {sheetNavItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                {item.label}
                <ChevronRight
                  className="ml-auto size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </button>
            ))}
          </nav>
          <SheetFooter>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              leftIcon={<LogOut aria-hidden="true" />}
            >
              Sign out
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Visibility (left)</Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="font-serif">
              Profile visibility
            </SheetTitle>
            <SheetDescription>
              Control who discovers you in search results.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 px-4">
            {visibilityOptions.map((option, index) => (
              <Button
                key={option}
                size="sm"
                variant={index === 1 ? "default" : "outline"}
                className="justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="gold" fullWidth>
                Save preference
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" leftIcon={<Trash2 aria-hidden="true" />}>
          Remove from shortlist
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif">
            Remove from shortlist?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Isla Morgan will be removed from your shortlist. You can send an
            interest again later, but she will not be notified of this change.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Keep shortlisted
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer bg-destructive text-white hover:bg-destructive/90">
            Yes, remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ConfirmDeleteDemo() {
  const [deleted, setDeleted] = React.useState(false)

  const handleConfirm = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 1200))
    setDeleted(true)
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <ConfirmDialog
        trigger={
          <Button variant="destructive" leftIcon={<Trash2 aria-hidden="true" />}>
            Delete photo
          </Button>
        }
        title="Delete this photo?"
        description="This photo will be permanently removed from your profile gallery. This cannot be undone."
        confirmText="Delete photo"
        cancelText="Keep photo"
        tone="destructive"
        onConfirm={handleConfirm}
      />
      {deleted ? (
        <Badge variant="destructive" dot>
          Photo deleted
        </Badge>
      ) : (
        <Badge variant="outline">Gallery: 6 photos</Badge>
      )}
    </div>
  )
}

function ConfirmUpgradeDemo() {
  const [upgraded, setUpgraded] = React.useState(false)

  const handleConfirm = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 1400))
    setUpgraded(true)
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <ConfirmDialog
        trigger={
          <Button variant="gold" leftIcon={<Gem aria-hidden="true" />}>
            Upgrade to Gold
          </Button>
        }
        title="Upgrade to Gold membership?"
        description="Gold members get unlimited contact views, kundli matching and priority placement for 6 months."
        confirmText="Proceed to payment"
        cancelText="Not now"
        tone="gold"
        onConfirm={handleConfirm}
      />
      {upgraded ? (
        <Badge variant="gold" dot>
          Gold member
        </Badge>
      ) : (
        <Badge variant="outline">Free plan</Badge>
      )}
    </div>
  )
}

const ageRanges = ["21 - 25", "25 - 30", "30 - 35", "35+"]
const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune"]

function BottomSheetDemo() {
  const [age, setAge] = React.useState("25 - 30")
  const [city, setCity] = React.useState("Mumbai")

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          leftIcon={<SlidersHorizontal aria-hidden="true" />}
        >
          Search filters
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle className="font-serif">
            Refine your search
          </DrawerTitle>
          <DrawerDescription>
            Narrow your matches by age bracket and city.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 px-4 pb-2">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Age bracket
            </p>
            <div className="flex flex-wrap gap-2">
              {ageRanges.map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={age === range ? "default" : "outline"}
                  onClick={() => setAge(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">City</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((option) => (
                <Button
                  key={option}
                  size="sm"
                  variant={city === option ? "default" : "outline"}
                  onClick={() => setCity(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter className="flex-row gap-2">
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              setAge("25 - 30")
              setCity("Mumbai")
            }}
          >
            Reset
          </Button>
          <DrawerClose asChild>
            <Button variant="gold" fullWidth>
              Show matches
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const storyImages = [
  { src: "/images/story-1.png", alt: "The proposal under marigold lights" },
  { src: "/images/story-2.png", alt: "Mehndi celebrations at dusk" },
  { src: "/images/story-3.png", alt: "The seven vows" },
]

function LightboxDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Lightbox
        images={storyImages}
        caption="Emma and John — a wedding in three frames"
      >
        { }
        <img
          src="/images/story-1.png"
          alt="Open the wedding gallery"
          className="h-32 w-48 rounded-xl border border-border object-cover shadow-sm transition-all duration-200 hover:shadow-md"
        />
      </Lightbox>
      <p className="max-w-xs text-sm text-muted-foreground">
        Click the thumbnail to open the viewer. Zoom with the controls or by
        clicking the image, navigate with arrows or arrow keys, and close with
        Escape.
      </p>
    </div>
  )
}

function ToastDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Interest sent",
            description: "Emma has been notified about your interest.",
          })
        }
      >
        Send interest
      </Button>
      <Button
        variant="gold"
        onClick={() =>
          toast({
            title: "Profile visibility updated",
            description: "Your profile is now visible to verified members only.",
          })
        }
      >
        Update visibility
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast({
            variant: "destructive",
            title: "Interest limit reached",
            description: "Free members can send 5 interests per day.",
          })
        }
      >
        Simulate failure
      </Button>
    </div>
  )
}

const seedNotifications: NotificationItem[] = [
  {
    id: "n1",
    variant: "gold",
    unread: true,
    title: "Gold membership expiring",
    description: "Renew now to keep unlimited contact views and priority placement.",
    time: "9:00 am",
  },
  {
    id: "n2",
    variant: "info",
    unread: true,
    title: "Interest received",
    description: "Karan Thompson sent you an interest with a short note.",
    time: "8:20 am",
    actions: (
      <Button size="sm" variant="outline">
        View interest
      </Button>
    ),
  },
  {
    id: "n3",
    variant: "warning",
    unread: true,
    title: "Incomplete profile",
    description: "Add your education details to appear in 40% more searches.",
    time: "Yesterday",
  },
  {
    id: "n4",
    variant: "success",
    title: "Photo approved",
    description: "Your third photo is now live on your profile.",
    time: "Monday",
  },
]

function NotificationItemsDemo() {
  const [dismissed, setDismissed] = React.useState<string[]>([])

  const items = [
    {
      id: "match",
      variant: "info" as const,
      title: "New match for you",
      description: "Riley Miller from Pune just joined with 92% compatibility.",
      time: "2 min ago",
      unread: true,
      actions: (
        <>
          <Button size="sm" variant="gold">
            View match
          </Button>
          <Button size="sm" variant="ghost">
            Later
          </Button>
        </>
      ),
    },
    {
      id: "boost",
      variant: "gold" as const,
      title: "Profile boost active",
      description: "Your profile is being shown to 3x more members until Friday.",
      time: "1 hr ago",
    },
    {
      id: "kundli",
      variant: "success" as const,
      title: "Kundli match completed",
      description: "Pandit-verified horoscope matching is ready for Noah and Ava.",
      time: "Yesterday",
    },
  ]

  const visible = items.filter((item) => !dismissed.includes(item.id))

  return (
    <div className="w-full max-w-md space-y-3">
      {visible.map((item) => (
        <Notification
          key={item.id}
          {...item}
          onDismiss={() =>
            setDismissed((prev) => [...prev, item.id])
          }
        />
      ))}
      {visible.length === 0 && (
        <p className="text-sm text-muted-foreground">
          All notifications dismissed.
        </p>
      )}
    </div>
  )
}

function NotificationListDemo() {
  const [items, setItems] = React.useState(seedNotifications)

  return (
    <div className="w-full max-w-md">
      <NotificationList
        title="Inbox"
        items={items}
        maxHeight="max-h-80"
        onDismiss={(id) =>
          setItems((prev) => prev.filter((item) => item.id !== id))
        }
        onMarkAllRead={() =>
          setItems((prev) =>
            prev.map((item) => ({ ...item, unread: false }))
          )
        }
      />
    </div>
  )
}

/* ---------------------------------- docs ---------------------------------- */

export const overlayDocs: ComponentDoc[] = [
  {
    id: "dialog",
    name: "Dialog",
    category: "overlay",
    description:
      "Radix-powered modal dialog — the foundation every overlay in the library composes. Accessible, focus-trapped and animated.",
    aliases: ["ModalDialog"],
    demos: [
      {
        id: "form",
        title: "Dialog with form-ish content",
        description:
          "A trigger-controlled dialog with an input and footer actions.",
        code: `import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Send Interest</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Send Interest to Emma</DialogTitle>
      <DialogDescription>
        She will be notified instantly. Interests with a note get 3x more responses.
      </DialogDescription>
    </DialogHeader>
    <Input placeholder="Write a short note (optional)" />
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Maybe later</Button>
      </DialogClose>
      <Button variant="gold">Send interest</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
        render: () => <DialogDemo />,
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state. Omit for trigger-based usage.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Called when the dialog requests to open or close.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Uncontrolled initial open state.",
      },
      {
        name: "showCloseButton",
        type: "boolean",
        default: "true",
        description: "On DialogContent — renders the top-right X button.",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Blocks interaction with the rest of the page.",
      },
    ],
  },
  {
    id: "modal",
    name: "Modal",
    category: "overlay",
    description:
      "Premium wrapper over Dialog — serif title, gold hairline divider, blurred dark overlay, rounded-2xl gold-bordered panel with size presets and a footer slot.",
    demos: [
      {
        id: "sizes",
        title: "Sizes",
        description: "sm, md and lg width presets behind three triggers.",
        wide: true,
        code: `import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalBody } from "@/components/ui/modal"

function Demo() {
  const [size, setSize] = React.useState<"sm" | "md" | "lg" | null>("md")

  return (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg"] as const).map((s) => (
        <Button key={s} variant="outline" onClick={() => setSize(s)}>
          Open {s.toUpperCase()} modal
        </Button>
      ))}
      <Modal
        open={size !== null}
        onOpenChange={(o) => setSize(o ? size : null)}
        size={size ?? "md"}
        title="Profile visibility"
        description="Choose who can see your full profile and photos."
      >
        <ModalBody>Matched members only, verified only, or everyone.</ModalBody>
      </Modal>
    </div>
  )
}`,
        render: () => <ModalSizesDemo />,
      },
      {
        id: "footer-loading",
        title: "Footer actions with loading",
        description:
          "The confirm button spins while a task runs, then closes the modal.",
        wide: true,
        code: `import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal"

function RsvpModal() {
  const [open, setOpen] = React.useState(false)
  const [sending, setSending] = React.useState(false)

  const confirm = () => {
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setOpen(false)
    }, 1400)
  }

  return (
    <div>
      <Button variant="gold" onClick={() => setOpen(true)}>Open RSVP</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Confirm your attendance"
        description="Emma and John would love to have you at the sangeet night."
        footer={
          <ModalFooter>
            <Button variant="outline" disabled={sending} onClick={() => setOpen(false)}>
              Maybe later
            </Button>
            <Button variant="gold" loading={sending} loadingText="Sending..." onClick={confirm}>
              Confirm attendance
            </Button>
          </ModalFooter>
        }
      >
        <ModalBody className="space-y-3">
          <Input placeholder="Your full name" />
          <Input placeholder="Number of guests attending" />
        </ModalBody>
      </Modal>
    </div>
  )
}`,
        render: () => <ModalFooterDemo />,
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Open/close callback.",
      },
      {
        name: "title",
        type: "ReactNode",
        description: "Serif heading at the top of the panel.",
      },
      {
        name: "description",
        type: "ReactNode",
        description: "Muted supporting line under the title.",
      },
      {
        name: "footer",
        type: "ReactNode",
        description: "Action row rendered at the bottom, right-aligned on sm+.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "Max width preset — max-w-sm / md / lg / 2xl.",
      },
      {
        name: "hideClose",
        type: "boolean",
        default: "false",
        description: "Hides the top-right close button.",
      },
    ],
  },
  {
    id: "drawer",
    name: "Drawer",
    category: "overlay",
    description:
      "vaul-powered draggable drawer. Default slides from the bottom with a grabber handle; also supports top, left and right directions.",
    demos: [
      {
        id: "profile",
        title: "Bottom drawer with profile actions",
        description: "Drag or swipe the handle to dismiss, or tap a action.",
        wide: true,
        code: `import { Button } from "@/components/ui/button"
import {
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter,
  DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer"

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Quick view profile</Button>
  </DrawerTrigger>
  <DrawerContent className="rounded-t-2xl">
    <DrawerHeader>
      <DrawerTitle>Emma Wilson, 26</DrawerTitle>
      <DrawerDescription>Mumbai, India • Content strategist</DrawerDescription>
    </DrawerHeader>
    <div className="grid grid-cols-3 gap-2 px-4 pb-2">
      <Button variant="gold" className="h-auto flex-col gap-1 py-3 text-xs">
        Send Interest
      </Button>
      <Button variant="outline" className="h-auto flex-col gap-1 py-3 text-xs">
        Shortlist
      </Button>
      <Button variant="outline" className="h-auto flex-col gap-1 py-3 text-xs">
        Chat
      </Button>
    </div>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="ghost" fullWidth>Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
        render: () => <DrawerProfileDemo />,
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Open/close callback.",
      },
      {
        name: "direction",
        type: '"bottom" | "top" | "left" | "right"',
        default: '"bottom"',
        description: "Edge the drawer slides in from.",
      },
      {
        name: "dismissible",
        type: "boolean",
        default: "true",
        description: "Allow closing by swipe or overlay tap.",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Blocks interaction with the page behind the drawer.",
      },
      {
        name: "handleOnly",
        type: "boolean",
        default: "false",
        description: "Only dragging the grabber closes the drawer.",
      },
    ],
  },
  {
    id: "sheet",
    name: "Sheet",
    category: "overlay",
    description:
      "Edge-of-screen sliding panel built on Radix Dialog — four side variants with smooth slide animations. Great for menus and filters.",
    demos: [
      {
        id: "sides",
        title: "Right menu and left preferences",
        description:
          "Two triggers: a right sheet with a nav list and a left sheet with visibility options.",
        wide: true,
        code: `import { Button } from "@/components/ui/button"
import {
  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Account menu</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Namaste, Emma</SheetTitle>
      <SheetDescription>Your Saptapadi account</SheetDescription>
    </SheetHeader>
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) => (
        <button
          key={item.label}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
        >
          {item.label}
        </button>
      ))}
    </nav>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="gold" fullWidth>Save preference</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`,
        render: () => <SheetNavDemo />,
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Open/close callback.",
      },
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"right"',
        description: "On SheetContent — edge the sheet slides in from.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Uncontrolled initial open state.",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Blocks interaction with the page behind the sheet.",
      },
    ],
  },
  {
    id: "alert-dialog",
    name: "AlertDialog",
    category: "overlay",
    description:
      "Focused confirmation dialog that interrupts the flow until a decision is made. The overlay cannot be dismissed by clicking outside.",
    demos: [
      {
        id: "destructive",
        title: "Destructive confirm",
        description: "A classic irreversible-action confirmation.",
        code: `import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Remove from shortlist</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Remove from shortlist?</AlertDialogTitle>
      <AlertDialogDescription>
        This cannot be undone. She will not be notified of this change.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep shortlisted</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
        Yes, remove
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
        render: () => <AlertDialogDemo />,
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Open/close callback.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Uncontrolled initial open state.",
      },
      {
        name: "AlertDialogAction",
        type: "component",
        description:
          "Confirming button — closes the dialog automatically on click.",
      },
      {
        name: "AlertDialogCancel",
        type: "component",
        description: "Cancelling button — closes the dialog on click.",
      },
    ],
  },
  {
    id: "confirm-dialog",
    name: "ConfirmDialog",
    category: "overlay",
    description:
      "Opinionated confirm/cancel dialog on AlertDialog primitives — tone-aware icon in a tinted circle, styled action buttons, and built-in pending state for async onConfirm handlers.",
    demos: [
      {
        id: "destructive-delete",
        title: "Destructive — delete photo",
        description:
          "Confirm stays open with a spinner while the async delete resolves, then closes.",
        code: `import * as React from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

function DeletePhoto() {
  const confirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    // ...delete the photo
  }

  return (
    <ConfirmDialog
      trigger={<Button variant="destructive">Delete photo</Button>}
      title="Delete this photo?"
      description="This photo will be permanently removed from your gallery."
      confirmText="Delete photo"
      cancelText="Keep photo"
      tone="destructive"
      onConfirm={confirm}
    />
  )
}`,
        render: () => <ConfirmDeleteDemo />,
      },
      {
        id: "gold-upgrade",
        title: "Gold — membership upgrade",
        description:
          "A premium upsell confirmation with the gold tone and pending payment simulation.",
        code: `import * as React from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

function Upgrade() {
  const confirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1400))
    // ...start the payment
  }

  return (
    <ConfirmDialog
      trigger={<Button variant="gold">Upgrade to Gold</Button>}
      title="Upgrade to Gold membership?"
      description="Unlimited contact views, kundli matching and priority placement for 6 months."
      confirmText="Proceed to payment"
      cancelText="Not now"
      tone="gold"
      onConfirm={confirm}
    />
  )
}`,
        render: () => <ConfirmUpgradeDemo />,
      },
    ],
    props: [
      {
        name: "trigger",
        type: "ReactNode",
        description: "Element that opens the dialog when clicked.",
      },
      {
        name: "title",
        type: "ReactNode",
        description: "Serif heading of the confirmation.",
      },
      {
        name: "description",
        type: "ReactNode",
        description: "Supporting copy explaining the consequence.",
      },
      {
        name: "tone",
        type: '"default" | "destructive" | "gold"',
        default: '"default"',
        description: "Selects the icon and confirm button styling.",
      },
      {
        name: "confirmText",
        type: "string",
        default: '"Confirm"',
        description: "Label of the confirming action.",
      },
      {
        name: "cancelText",
        type: "string",
        default: '"Cancel"',
        description: "Label of the dismissing action.",
      },
      {
        name: "onConfirm",
        type: "() => void | Promise<void>",
        description:
          "May be async — the dialog stays open with a spinner until it resolves, then closes.",
      },
      {
        name: "loading",
        type: "boolean",
        description:
          "Controlled pending state; overrides the internal promise tracking.",
      },
    ],
  },
  {
    id: "bottom-sheet",
    name: "BottomSheet",
    category: "overlay",
    description:
      "The classic bottom-sheet pattern — a Drawer with direction bottom, rounded top corners and the grabber handle bar. Composed with the same Drawer primitives, no extra component needed.",
    demos: [
      {
        id: "filters",
        title: "Filter bottom sheet",
        description:
          "Rounded-t-2xl surface with the vaul grabber on top and interactive filter chips.",
        wide: true,
        code: `import * as React from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

function FilterSheet() {
  const [age, setAge] = React.useState("25 - 30")
  const [city, setCity] = React.useState("Mumbai")

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Search filters</Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle>Refine your search</DrawerTitle>
          <DrawerDescription>Narrow matches by age and city.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {ageRanges.map((range) => (
            <Button
              key={range}
              size="sm"
              variant={age === range ? "default" : "outline"}
              onClick={() => setAge(range)}
            >
              {range}
            </Button>
          ))}
        </div>
        <DrawerFooter className="flex-row gap-2">
          <Button variant="outline" fullWidth>Reset</Button>
          <DrawerClose asChild>
            <Button variant="gold" fullWidth>Show matches</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}`,
        render: () => <BottomSheetDemo />,
      },
    ],
    props: [
      {
        name: "direction",
        type: '"bottom"',
        default: '"bottom"',
        description: "Leave at the Drawer default to get the bottom sheet.",
      },
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Open/close callback.",
      },
      {
        name: "dismissible",
        type: "boolean",
        default: "true",
        description: "Allow closing by swipe or overlay tap.",
      },
      {
        name: "className",
        type: "string",
        description:
          "On DrawerContent — add rounded-t-2xl for the bottom-sheet look; the grabber renders automatically.",
      },
    ],
  },
  {
    id: "lightbox",
    name: "Lightbox",
    category: "overlay",
    description:
      "Fullscreen image viewer on Dialog — click-to-zoom plus zoom in/out/reset controls, caption, prev/next navigation for galleries, arrow-key navigation and Escape to close.",
    demos: [
      {
        id: "gallery",
        title: "Wedding gallery",
        description:
          "A thumbnail opens the viewer with three frames, zoom controls and navigation.",
        wide: true,
        code: `import { Lightbox } from "@/components/ui/lightbox"

const images = [
  { src: "/images/story-1.png", alt: "The proposal under marigold lights" },
  { src: "/images/story-2.png", alt: "Mehndi celebrations at dusk" },
  { src: "/images/story-3.png", alt: "The seven vows" },
]

<Lightbox
  images={images}
  caption="Emma and John — a wedding in three frames"
>
  <img
    src="/images/story-1.png"
    alt="Open the wedding gallery"
    className="h-32 w-48 cursor-zoom-in rounded-xl border object-cover"
  />
</Lightbox>`,
        render: () => <LightboxDemo />,
      },
    ],
    props: [
      {
        name: "images",
        type: "{ src: string; alt?: string }[]",
        description:
          "Images to browse; prev/next controls appear when there are 2 or more.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "Thumbnail element rendered as the open trigger.",
      },
      {
        name: "caption",
        type: "ReactNode",
        description: "Caption displayed under the active image.",
      },
      {
        name: "label",
        type: "string",
        default: '"Image viewer"',
        description: "Visually hidden accessible title for the viewer.",
      },
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Open/close callback.",
      },
    ],
  },
  {
    id: "toast",
    name: "Toast",
    category: "overlay",
    description:
      "Imperative toast notifications via the use-toast hook — call toast() from anywhere; the Toaster is already mounted in the root layout. Swipe or auto-dismiss on the way out.",
    aliases: ["Snackbar"],
    demos: [
      {
        id: "variants",
        title: "Toast variants",
        description: "Default and destructive toasts fired from buttons.",
        code: `import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

<div className="flex flex-wrap gap-3">
  <Button
    variant="outline"
    onClick={() =>
      toast({
        title: "Interest sent",
        description: "Emma has been notified about your interest.",
      })
    }
  >
    Send interest
  </Button>
  <Button
    variant="destructive"
    onClick={() =>
      toast({
        variant: "destructive",
        title: "Interest limit reached",
        description: "Free members can send 5 interests per day.",
      })
    }
  >
    Simulate failure
  </Button>
</div>`,
        render: () => <ToastDemo />,
      },
    ],
    props: [
      {
        name: "title",
        type: "ReactNode",
        description: "Bold headline of the toast.",
      },
      {
        name: "description",
        type: "ReactNode",
        description: "Supporting copy under the title.",
      },
      {
        name: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "Visual tone of the toast surface.",
      },
      {
        name: "duration",
        type: "number",
        default: "5000",
        description: "Milliseconds before auto-dismiss.",
      },
      {
        name: "action",
        type: "ToastAction",
        description: "Optional action element rendered inside the toast.",
      },
    ],
  },
  {
    id: "notification",
    name: "Notification",
    category: "overlay",
    description:
      "Rich notification item — tone-tinted icon circle, unread gold dot and surface, timestamp, action slot and dismiss button. Pair with NotificationList for an inbox with a mark-all-read header.",
    demos: [
      {
        id: "tones",
        title: "Tones and unread state",
        description:
          "Info, gold and success items — dismiss any of them, unread ones show the gold dot.",
        code: `import { Button } from "@/components/ui/button"
import { Notification } from "@/components/ui/notification"

<div className="w-full max-w-md space-y-3">
  <Notification
    variant="info"
    unread
    title="New match for you"
    description="Riley Miller from Pune just joined with 92% compatibility."
    time="2 min ago"
    actions={<Button size="sm" variant="gold">View match</Button>}
  />
  <Notification
    variant="gold"
    title="Profile boost active"
    description="Shown to 3x more members until Friday."
    time="1 hr ago"
  />
  <Notification
    variant="success"
    title="Kundli match completed"
    description="Pandit-verified horoscope matching is ready."
    time="Yesterday"
  />
</div>`,
        render: () => <NotificationItemsDemo />,
      },
      {
        id: "list",
        title: "NotificationList inbox",
        description:
          "Stacked items with a max-height scroll area, unread count badge and a working mark-all-read header.",
        wide: true,
        code: `import * as React from "react"
import { NotificationList } from "@/components/ui/notification"

const seed = [
  { id: "n1", variant: "gold", unread: true, title: "Gold membership expiring", description: "Renew to keep unlimited contact views.", time: "9:00 am" },
  { id: "n2", variant: "info", unread: true, title: "Interest received", description: "Karan Thompson sent you an interest.", time: "8:20 am" },
  { id: "n3", variant: "warning", unread: true, title: "Incomplete profile", description: "Add education details for 40% more searches.", time: "Yesterday" },
  { id: "n4", variant: "success", title: "Photo approved", description: "Your third photo is now live.", time: "Monday" },
]

function Inbox() {
  const [items, setItems] = React.useState(seed)

  return (
    <NotificationList
      title="Inbox"
      items={items}
      maxHeight="max-h-80"
      onDismiss={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
      onMarkAllRead={() =>
        setItems((prev) => prev.map((item) => ({ ...item, unread: false })))
      }
    />
  )
}`,
        render: () => <NotificationListDemo />,
      },
    ],
    props: [
      {
        name: "variant",
        type: '"info" | "success" | "warning" | "gold" | "destructive"',
        default: '"info"',
        description:
          "Tone — maps to Bell, CheckCircle2, TriangleAlert, Sparkles and XCircle icons with matching tints.",
      },
      {
        name: "title",
        type: "ReactNode",
        description: "Primary line of the notification.",
      },
      {
        name: "description",
        type: "ReactNode",
        description: "Secondary line.",
      },
      {
        name: "time",
        type: "ReactNode",
        description: 'Timestamp label, e.g. "2 min ago".',
      },
      {
        name: "unread",
        type: "boolean",
        default: "false",
        description: "Shows the gold unread dot and a subtle gold surface.",
      },
      {
        name: "actions",
        type: "ReactNode",
        description: "Row of action elements under the copy.",
      },
      {
        name: "onDismiss",
        type: "() => void",
        description: "Shows an X button on the right when provided.",
      },
      {
        name: "items",
        type: "NotificationItem[]",
        description: "NotificationList — data for the stacked items.",
      },
      {
        name: "onMarkAllRead",
        type: "() => void",
        description:
          "NotificationList — called after the header action clears unread flags.",
      },
    ],
  },
]
