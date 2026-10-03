"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
  BookOpenIcon,
  CameraIcon,
  ClapperboardIcon,
  DumbbellIcon,
  Music2Icon,
  PaletteIcon,
  PlaneIcon,
  UtensilsIcon,
} from "lucide-react"

import type { ComponentDoc } from "./types"

import { Autocomplete } from "@/components/ui/autocomplete"
import { AvatarPicker } from "@/components/ui/avatar-picker"
import { Calendar } from "@/components/ui/calendar"
import { ColorPicker } from "@/components/ui/color-picker"
import { Combobox } from "@/components/ui/combobox"
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Dropzone, FileUpload } from "@/components/ui/file-upload"
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TimePicker } from "@/components/ui/time-picker"

/* ---------------------------------- demos --------------------------------- */

const COMMUNITIES = [
  "Bandhan Heights",
  "Rosewood Enclave",
  "Saat Phere Manor",
  "Kesar Villa",
  "Heer Palace",
]

const CITY_ITEMS = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bengaluru", label: "Bengaluru" },
  { value: "jaipur", label: "Jaipur" },
  { value: "kolkata", label: "Kolkata" },
]

function SelectDemo() {
  const [community, setCommunity] = React.useState("")
  const [city, setCity] = React.useState("mumbai")
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Community</label>
        <Select value={community || undefined} onValueChange={setCommunity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your community" />
          </SelectTrigger>
          <SelectContent>
            {COMMUNITIES.map((name) => (
              <SelectItem key={name} value={name} className="cursor-pointer">
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          Selected: {community || "none"}
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">City</label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a city" />
          </SelectTrigger>
          <SelectContent>
            {CITY_ITEMS.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="cursor-pointer"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

const INTEREST_OPTIONS = [
  {
    value: "music",
    label: "Music & Sangeet",
    icon: <Music2Icon className="size-4" />,
  },
  { value: "travel", label: "Travel", icon: <PlaneIcon className="size-4" /> },
  {
    value: "food",
    label: "Food & Cuisine",
    icon: <UtensilsIcon className="size-4" />,
  },
  {
    value: "photography",
    label: "Photography",
    icon: <CameraIcon className="size-4" />,
  },
  {
    value: "books",
    label: "Books",
    icon: <BookOpenIcon className="size-4" />,
  },
  { value: "art", label: "Art & Design", icon: <PaletteIcon className="size-4" /> },
  {
    value: "fitness",
    label: "Fitness",
    icon: <DumbbellIcon className="size-4" />,
  },
  {
    value: "films",
    label: "Films",
    icon: <ClapperboardIcon className="size-4" />,
  },
]

function MultiSelectDemo() {
  const [interests, setInterests] = React.useState<string[]>([
    "music",
    "travel",
    "food",
    "photography",
  ])
  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Interests</label>
      <MultiSelect
        options={INTEREST_OPTIONS}
        value={interests}
        onChange={setInterests}
        placeholder="Pick your interests"
        maxCount={3}
      />
      <p className="text-muted-foreground text-xs">
        {interests.length} selected — open the panel to search or clear
      </p>
    </div>
  )
}

const COMBOBOX_CITIES = [
  { value: "mumbai", label: "Mumbai, MH" },
  { value: "new-delhi", label: "New Delhi, DL" },
  { value: "bengaluru", label: "Bengaluru, KA" },
  { value: "hyderabad", label: "Hyderabad, TS" },
  { value: "chennai", label: "Chennai, TN" },
  { value: "pune", label: "Pune, MH" },
  { value: "jaipur", label: "Jaipur, RJ" },
  { value: "kolkata", label: "Kolkata, WB" },
  { value: "ahmedabad", label: "Ahmedabad, GJ" },
  { value: "kochi", label: "Kochi, KL" },
]

function ComboboxDemo() {
  const [city, setCity] = React.useState("")
  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Home city</label>
      <Combobox
        options={COMBOBOX_CITIES}
        value={city || undefined}
        onChange={(next) => setCity(next)}
        placeholder="Search cities..."
        searchPlaceholder="Type a city..."
        emptyText="No city found."
      />
      <p className="text-muted-foreground text-xs">
        {city ? "You picked " + city : "Type to filter the list"}
      </p>
    </div>
  )
}

const PROFESSIONS = [
  "Wedding Photographer",
  "Bridal Makeup Artist",
  "Mehendi Artist",
  "Event Planner",
  "Catering Chef",
  "Sangeet Choreographer",
  "Wedding Card Designer",
  "Florist",
  "DJ & Sound",
  "Ghazal Singer",
  "Banquet Manager",
  "Pandit / Puchris",
]

function AutocompleteDemo() {
  const [profession, setProfession] = React.useState("")
  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Profession</label>
      <Autocomplete
        options={PROFESSIONS}
        value={profession}
        onChange={setProfession}
        onSelect={setProfession}
        placeholder="e.g. Mehendi Artist"
      />
      <p className="text-muted-foreground text-xs">
        Free text is allowed — current: {profession || "empty"}
      </p>
    </div>
  )
}

function DatePickerDemo() {
  const [birthDate, setBirthDate] = React.useState<Date | undefined>(
    new Date(1996, 7, 15)
  )
  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Birth date</label>
      <DatePicker
        value={birthDate}
        onChange={setBirthDate}
        placeholder="Pick your birth date"
      />
      <p className="text-muted-foreground text-xs">
        {birthDate
          ? "Selected " + format(birthDate, "dd MMM yyyy")
          : "No date picked yet"}
      </p>
    </div>
  )
}

function DateRangePickerDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 2, 12),
    to: new Date(2025, 2, 18),
  })
  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Wedding functions week</label>
      <DateRangePicker value={range} onChange={setRange} />
      <p className="text-muted-foreground text-xs">
        {range?.from
          ? range.to
            ? format(range.from, "dd MMM") +
              " – " +
              format(range.to, "dd MMM yyyy")
            : format(range.from, "dd MMM yyyy") + " – ..."
          : "No range picked yet"}
      </p>
    </div>
  )
}

function TimePickerDemo() {
  const [time, setTime] = React.useState("18:30")
  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Sangeet start time</label>
      <TimePicker value={time} onChange={setTime} use12Hour minuteStep={5} />
      <p className="text-muted-foreground text-xs">24h value: {time}</p>
    </div>
  )
}

function DateTimePickerDemo() {
  const [value, setValue] = React.useState("2025-03-12T18:30")
  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Wedding muhurat</label>
      <DateTimePicker
        value={value}
        onChange={setValue}
        use12Hour
        minuteStep={5}
        placeholder="Pick date"
      />
      <p className="text-muted-foreground font-mono text-xs">{value}</p>
    </div>
  )
}

function CalendarDemo() {
  const [day, setDay] = React.useState<Date | undefined>(new Date(2025, 2, 12))
  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        mode="single"
        selected={day}
        onSelect={setDay}
        defaultMonth={new Date(2025, 2)}
      />
      <p className="text-muted-foreground text-xs">
        {day ? format(day, "dd MMM yyyy") : "Pick a day"}
      </p>
    </div>
  )
}

function FileUploadDemo() {
  const [files, setFiles] = React.useState<File[]>(() => [
    new File(["Saptapadi invitation draft"], "invitation-card.pdf", {
      type: "application/pdf",
    }),
  ])
  return (
    <div className="w-full max-w-sm">
      <FileUpload
        value={files}
        onChange={setFiles}
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        buttonLabel="Add photos & PDFs"
      />
    </div>
  )
}

function DropzoneDemo() {
  const [files, setFiles] = React.useState<File[]>(() => [
    new File(["mehendi"], "mehendi-decor.jpg", { type: "image/jpeg" }),
  ])
  return (
    <div className="w-full max-w-xl">
      <Dropzone
        value={files}
        onChange={setFiles}
        accept="image/*,.pdf"
        title="Share your wedding moodboard"
        description="Drop reference images of decor, outfits or jewellery"
      />
    </div>
  )
}

function ColorPickerDemo() {
  const [hex, setHex] = React.useState("#7d1f2e")
  return (
    <div className="w-full max-w-sm space-y-3">
      <ColorPicker value={hex} onChange={setHex} />
      <p className="text-muted-foreground text-xs">
        Theme accent: <span className="font-mono">{hex}</span>
      </p>
    </div>
  )
}

/* ---------------------------------- docs ---------------------------------- */

/** Demo host for the avatar picker (fully controlled). */
function AvatarPickerDemo() {
  const [avatar, setAvatar] = React.useState<string | null>(null)
  return (
    <div className="flex flex-col items-start gap-4">
      <AvatarPicker
        value={avatar}
        onValueChange={setAvatar}
        name="Noah Bennett"
        size={88}
      />
      <p className="text-xs text-muted-foreground">
        Pick any image — it is auto-cropped to a 256px square JPEG data URL and
        handed to <span className="font-mono">onValueChange</span>.
      </p>
    </div>
  )
}

export const forms_2Docs: ComponentDoc[] = [
  {
    id: "avatar-picker",
    name: "AvatarPicker",
    category: "forms",
    description:
      "Controlled avatar upload field — preview, camera-button upload, auto square-crop + resize (canvas → 256px JPEG data URL) and remove. Fully props-driven; pair it with any avatar consumer (navbar, dashboard header, profile forms).",
    aliases: ["AvatarUpload", "ProfilePhotoPicker"],
    demos: [
      {
        id: "avatar-picker-demo",
        title: "Upload & preview",
        description: "The value lives in the parent — this demo owns a single useState.",
        code: `import * as React from "react"
import { AvatarPicker } from "@/components/ui/avatar-picker"

export function ProfilePhoto() {
  const ex, setAvatar] = React.useState<string | null>(null)
  return (
    <AvatarPicker
      value={avatar}
      onValueChange={setAvatar}
      name="Noah Bennett"
      size={88}
    />
  )
}`,
        render: () => <AvatarPickerDemo />,
      },
    ],
    props: [
      {
        name: "value",
        type: "string | null",
        default: "—",
        description: "Current image URL / data URL; null shows initials.",
      },
      {
        name: "onValueChange",
        type: "(value: string | null) => void",
        default: "—",
        description: "Called with a 256px JPEG data URL, or null when removed.",
      },
      {
        name: "name",
        type: "string",
        default: "—",
        description: "Person's name — drives the fallback initials and alt text.",
      },
      {
        name: "size",
        type: "number",
        default: "80",
        description: "Square preview side length in px.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Blocks upload / remove while the parent form is busy.",
      },
    ],
  },
  {
    id: "select",
    name: "Select",
    category: "forms",
    description:
      "Native-feel dropdown built on Radix Select — for picking one option from a list, with labels, groups and scrollable panels.",
    demos: [
      {
        id: "labels",
        title: "Community & city",
        description:
          "Classic labelled selects — one starting empty with a placeholder, one with a default value.",
        code: `import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const cities = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bengaluru", label: "Bengaluru" },
]

export function CitySelect() {
  const [city, setCity] = React.useState("mumbai")
  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">City</label>
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a city" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((c) => (
            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}`,
        render: () => <SelectDemo />,
      },
    ],
    props: [
      {
        name: "value",
        type: "string",
        default: "—",
        description: "Controlled selected value.",
      },
      {
        name: "defaultValue",
        type: "string",
        default: "—",
        description: "Initial value when uncontrolled.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        default: "—",
        description: "Called when a new option is picked.",
      },
      {
        name: "placeholder",
        type: "string",
        default: "—",
        description: "Trigger text when nothing is selected.",
      },
      {
        name: "size",
        type: '"sm" | "default"',
        default: '"default"',
        description: "Height of the trigger.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the whole select.",
      },
    ],
  },
  {
    id: "multi-select",
    name: "MultiSelect",
    category: "forms",
    description:
      "Multi-pick select with removable chips on the trigger, a searchable checkbox panel and a clear-all footer. Controlled or uncontrolled.",
    demos: [
      {
        id: "interests",
        title: "Interests",
        description:
          "Pick several interests — chips collapse with maxCount and the panel supports search.",
        code: `import * as React from "react"
import { MultiSelect } from "@/components/ui/multi-select"

const interests = [
  { value: "music", label: "Music & Sangeet" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food & Cuisine" },
  { value: "photography", label: "Photography" },
]

export function InterestsSelect() {
  const [value, setValue] = React.useState(["music"])
  return (
    <MultiSelect
      options={interests}
      value={value}
      onChange={setValue}
      placeholder="Pick your interests"
      maxCount={3}
    />
  )
}`,
        render: () => <MultiSelectDemo />,
      },
    ],
    props: [
      {
        name: "options",
        type: "{ value: string; label: string; icon?: ReactNode }[]",
        default: "—",
        description: "Available options.",
      },
      {
        name: "value",
        type: "string[]",
        default: "—",
        description: "Controlled selection array of option values.",
      },
      {
        name: "defaultValue",
        type: "string[]",
        default: "[]",
        description: "Initial selection when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(value: string[]) => void",
        default: "—",
        description: "Called with the full next selection.",
      },
      {
        name: "placeholder",
        type: "string",
        default: '"Select options"',
        description: "Trigger text when nothing is selected.",
      },
      {
        name: "maxCount",
        type: "number",
        default: "—",
        description:
          "Max chips rendered on the trigger; extras collapse into a +N badge.",
      },
      {
        name: "searchable",
        type: "boolean",
        default: "true",
        description: "Show the search input inside the panel.",
      },
    ],
  },
  {
    id: "combobox",
    name: "Combobox",
    category: "forms",
    description:
      "Single-select with type-to-search powered by cmdk inside a popover — ideal for long option lists like cities or communities.",
    demos: [
      {
        id: "cities",
        title: "City search",
        description:
          "Searchable city picker — the trigger shows the current label, the list marks the selected row with a check.",
        code: `import * as React from "react"
import { Combobox } from "@/components/ui/combobox"

const cities = [
  { value: "mumbai", label: "Mumbai, MH" },
  { value: "new-delhi", label: "New Delhi, DL" },
  { value: "bengaluru", label: "Bengaluru, KA" },
]

export function CityCombobox() {
  const [value, setValue] = React.useState("")
  return (
    <Combobox
      options={cities}
      value={value || undefined}
      onChange={setValue}
      placeholder="Search cities..."
      emptyText="No city found."
    />
  )
}`,
        render: () => <ComboboxDemo />,
      },
    ],
    props: [
      {
        name: "options",
        type: "{ value: string; label: string; icon?: ReactNode }[]",
        default: "—",
        description: "Available options; label is used for search matching.",
      },
      {
        name: "value",
        type: "string",
        default: "—",
        description: "Controlled selected value.",
      },
      {
        name: "defaultValue",
        type: "string",
        default: "—",
        description: "Initial value when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        default: "—",
        description: "Called with the picked value; closes the panel.",
      },
      {
        name: "placeholder",
        type: "string",
        default: '"Select an option"',
        description: "Trigger text when nothing is selected.",
      },
      {
        name: "emptyText",
        type: "string",
        default: '"No results found."',
        description: "Message when the search has no matches.",
      },
    ],
  },
  {
    id: "autocomplete",
    name: "Autocomplete",
    category: "forms",
    description:
      "Free-text input with an anchored suggestion dropdown that filters as you type — values outside the list are allowed. Keyboard navigable.",
    demos: [
      {
        id: "profession",
        title: "Profession",
        description:
          "Suggestions filter per keystroke; custom professions can be typed freely.",
        code: `import * as React from "react"
import { Autocomplete } from "@/components/ui/autocomplete"

const professions = [
  "Wedding Photographer",
  "Bridal Makeup Artist",
  "Mehendi Artist",
  "Event Planner",
]

export function ProfessionField() {
  const [value, setValue] = React.useState("")
  return (
    <Autocomplete
      options={professions}
      value={value}
      onChange={setValue}
      onSelect={setValue}
      placeholder="e.g. Mehendi Artist"
    />
  )
}`,
        render: () => <AutocompleteDemo />,
      },
    ],
    props: [
      {
        name: "options",
        type: "string[]",
        default: "—",
        description: "Suggestion pool (plain strings).",
      },
      {
        name: "value",
        type: "string",
        default: "—",
        description: "Controlled text value — free text is allowed.",
      },
      {
        name: "defaultValue",
        type: "string",
        default: '""',
        description: "Initial text when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        default: "—",
        description: "Called on every keystroke with the current text.",
      },
      {
        name: "onSelect",
        type: "(value: string) => void",
        default: "—",
        description: "Called when a suggestion is picked and fills the input.",
      },
      {
        name: "limit",
        type: "number",
        default: "8",
        description: "Max suggestions rendered at once.",
      },
      {
        name: "emptyText",
        type: "string",
        default: '"No matches found."',
        description: "Message when no option matches the query.",
      },
    ],
  },
  {
    id: "date-picker",
    name: "DatePicker",
    category: "forms",
    description:
      "Popover date picker built on react-day-picker v9 — trigger shows the formatted date (date-fns pattern) with a calendar icon.",
    demos: [
      {
        id: "birth-date",
        title: "Birth date",
        description: "Perfect for matrimonial profile fields.",
        code: `import * as React from "react"
import { DatePicker } from "@/components/ui/date-picker"

export function BirthDateField() {
  const [date, setDate] = React.useState(undefined)
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Pick your birth date"
      dateFormat="dd MMM yyyy"
    />
  )
}`,
        render: () => <DatePickerDemo />,
      },
    ],
    props: [
      {
        name: "value",
        type: "Date",
        default: "—",
        description: "Controlled selected date.",
      },
      {
        name: "defaultValue",
        type: "Date",
        default: "—",
        description: "Initial date when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(date: Date | undefined) => void",
        default: "—",
        description: "Called with the picked date; closes the popover.",
      },
      {
        name: "placeholder",
        type: "string",
        default: '"Pick a date"',
        description: "Trigger text when no date is selected.",
      },
      {
        name: "dateFormat",
        type: "string",
        default: '"dd MMM yyyy"',
        description: "date-fns format pattern used on the trigger.",
      },
    ],
  },
  {
    id: "date-range-picker",
    name: "DateRangePicker",
    category: "forms",
    description:
      "Two-month range picker on the same Calendar primitive — trigger reads like 12 Mar – 18 Mar 2025 and closes once both ends are chosen.",
    aliases: ["RangePicker"],
    demos: [
      {
        id: "functions-week",
        title: "Functions week",
        description: "Span the mehendi-to-reception week in one pick.",
        code: `import * as React from "react"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/ui/date-picker"

export function FunctionsWeek() {
  const [range, setRange] = React.useState(undefined)
  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      numberOfMonths={2}
      placeholder="Pick a date range"
    />
  )
}`,
        render: () => <DateRangePickerDemo />,
      },
    ],
    props: [
      {
        name: "value",
        type: "{ from: Date; to?: Date }",
        default: "—",
        description: "Controlled range (react-day-picker DateRange).",
      },
      {
        name: "defaultValue",
        type: "{ from: Date; to?: Date }",
        default: "—",
        description: "Initial range when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(range: DateRange | undefined) => void",
        default: "—",
        description: "Called while the range is being drawn.",
      },
      {
        name: "numberOfMonths",
        type: "number",
        default: "2",
        description: "Months rendered in the panel.",
      },
      {
        name: "dateFormat",
        type: "string",
        default: '"dd MMM yyyy"',
        description: "date-fns pattern for the range end on the trigger.",
      },
    ],
  },
  {
    id: "time-picker",
    name: "TimePicker",
    category: "forms",
    description:
      "Compact hour / minute / AM-PM selects producing a 24h HH:mm value — supports 12-hour clocks and minute stepping.",
    aliases: ["ClockPicker"],
    demos: [
      {
        id: "twelve-hour",
        title: "12-hour clock",
        description: "6:30 PM in 12-hour mode with 5-minute steps.",
        code: `import * as React from "react"
import { TimePicker } from "@/components/ui/time-picker"

export function SangeetTime() {
  const [time, setTime] = React.useState("18:30")
  return <TimePicker value={time} onChange={setTime} use12Hour minuteStep={5} />
}`,
        render: () => <TimePickerDemo />,
      },
    ],
    props: [
      {
        name: "value",
        type: "string",
        default: "—",
        description: 'Controlled time as 24h "HH:mm", e.g. "14:30".',
      },
      {
        name: "defaultValue",
        type: "string",
        default: "—",
        description: "Initial time when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        default: "—",
        description: 'Called with the complete "HH:mm" value.',
      },
      {
        name: "use12Hour",
        type: "boolean",
        default: "false",
        description: "Adds the AM/PM select and 1–12 hour labels.",
      },
      {
        name: "minuteStep",
        type: "number",
        default: "1",
        description: "Minute increment between options (1–30).",
      },
    ],
  },
  {
    id: "date-time-picker",
    name: "DateTimePicker",
    category: "forms",
    description:
      "DatePicker + TimePicker composed side by side, exchanging an ISO-like YYYY-MM-DDTHH:mm value (or a Date) — calendar logic is reused, never rewritten.",
    demos: [
      {
        id: "muhurat",
        title: "Wedding muhurat",
        description: "Date and time in one controlled field.",
        code: `import * as React from "react"
import { DateTimePicker } from "@/components/ui/date-time-picker"

export function MuhuratField() {
  const [value, setValue] = React.useState("2025-03-12T18:30")
  return (
    <DateTimePicker
      value={value}
      onChange={setValue}
      use12Hour
      minuteStep={5}
    />
  )
}`,
        render: () => <DateTimePickerDemo />,
      },
    ],
    props: [
      {
        name: "value",
        type: "string | Date",
        default: "—",
        description: 'Controlled value — "YYYY-MM-DDTHH:mm" string or Date.',
      },
      {
        name: "defaultValue",
        type: "string | Date",
        default: "—",
        description: "Initial value when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        default: "—",
        description: 'Called with an ISO-like "YYYY-MM-DDTHH:mm" string.',
      },
      {
        name: "use12Hour",
        type: "boolean",
        default: "false",
        description: "Forwarded to the inner TimePicker.",
      },
      {
        name: "minuteStep",
        type: "number",
        default: "1",
        description: "Forwarded to the inner TimePicker.",
      },
      {
        name: "dateFormat",
        type: "string",
        default: '"dd MMM yyyy"',
        description: "Format of the date trigger.",
      },
    ],
  },
  {
    id: "calendar",
    name: "Calendar",
    category: "forms",
    description:
      "Theme-aware month calendar on react-day-picker v9 with gold/primary selection styling — supports single, multiple and range modes.",
    demos: [
      {
        id: "month",
        title: "Plain month",
        description:
          "A single selectable month — drop it inline in cards or panels.",
        code: `import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function MonthCalendar() {
  const [day, setDay] = React.useState(undefined)
  return (
    <Calendar
      mode="single"
      selected={day}
      onSelect={setDay}
      defaultMonth={new Date(2025, 2)}
    />
  )
}`,
        render: () => <CalendarDemo />,
        wide: true,
      },
    ],
    props: [
      {
        name: "mode",
        type: '"single" | "multiple" | "range" | "default"',
        default: '"default"',
        description: "Selection behaviour of the calendar.",
      },
      {
        name: "selected",
        type: "Date | Date[] | DateRange",
        default: "—",
        description: "Controlled selection (shape depends on mode).",
      },
      {
        name: "onSelect",
        type: "(selected) => void",
        default: "—",
        description: "Selection handler typed by mode.",
      },
      {
        name: "defaultMonth",
        type: "Date",
        default: "—",
        description: "Month shown initially.",
      },
      {
        name: "numberOfMonths",
        type: "number",
        default: "1",
        description: "Months rendered side by side.",
      },
      {
        name: "captionLayout",
        type: '"label" | "dropdown" | "dropdown-years"',
        default: '"label"',
        description: "Month/year caption style.",
      },
    ],
  },
  {
    id: "file-upload",
    name: "FileUpload",
    category: "forms",
    description:
      "Button-style uploader with a hidden input and selected-file chips — FileText icon, human-readable size and one-click remove.",
    aliases: ["Uploader"],
    demos: [
      {
        id: "chips",
        title: "Selected files",
        description:
          "One pre-selected file to show the chip — add or remove freely.",
        code: `import * as React from "react"
import { FileUpload } from "@/components/ui/file-upload"

export function InvitationUpload() {
  const [files, setFiles] = React.useState([])
  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      multiple
      accept=".pdf,.jpg,.jpeg,.png"
      buttonLabel="Add photos & PDFs"
    />
  )
}`,
        render: () => <FileUploadDemo />,
      },
    ],
    props: [
      {
        name: "accept",
        type: "string",
        default: "—",
        description: 'Native accept filter, e.g. ".pdf,.jpg" or "image/*".',
      },
      {
        name: "multiple",
        type: "boolean",
        default: "false",
        description: "Allow picking more than one file.",
      },
      {
        name: "value",
        type: "File[]",
        default: "—",
        description: "Controlled file list.",
      },
      {
        name: "onChange",
        type: "(files: File[]) => void",
        default: "—",
        description: "Called with the full next file list.",
      },
      {
        name: "maxFiles",
        type: "number",
        default: "—",
        description: "Max files kept in the list.",
      },
      {
        name: "buttonLabel",
        type: "string",
        default: '"Choose files"',
        description: "Label of the chooser button.",
      },
    ],
  },
  {
    id: "dropzone",
    name: "Dropzone",
    category: "forms",
    description:
      "Drag-and-drop area with a dashed gold border, drag-over highlight, UploadCloud affordance and a file chip list below — also click/keyboard browsable.",
    demos: [
      {
        id: "moodboard",
        title: "Moodboard dropzone",
        description:
          "Drag files in (or click) — new files call onFiles and join the list.",
        code: `import * as React from "react"
import { Dropzone } from "@/components/ui/file-upload"

export function MoodboardDropzone() {
  const handleFiles = (files) => console.log(files)
  return (
    <Dropzone
      onFiles={handleFiles}
      accept="image/*,.pdf"
      title="Share your wedding moodboard"
      description="Drop reference images of decor, outfits or jewellery"
    />
  )
}`,
        render: () => <DropzoneDemo />,
        wide: true,
      },
    ],
    props: [
      {
        name: "accept",
        type: "string",
        default: "—",
        description: "Filter applied to dropped and picked files.",
      },
      {
        name: "multiple",
        type: "boolean",
        default: "true",
        description: "Allow dropping/picking several files.",
      },
      {
        name: "value",
        type: "File[]",
        default: "—",
        description: "Controlled file list rendered below the area.",
      },
      {
        name: "onFiles",
        type: "(files: File[]) => void",
        default: "—",
        description: "Called with only the newly added files.",
      },
      {
        name: "onChange",
        type: "(files: File[]) => void",
        default: "—",
        description: "Called with the full next file list.",
      },
      {
        name: "title",
        type: "string",
        default: '"Upload photos & documents"',
        description: "Headline inside the drop area.",
      },
      {
        name: "description",
        type: "string",
        default: '"Drag and drop files here, or click to browse"',
        description: "Helper text inside the drop area.",
      },
    ],
  },
  {
    id: "color-picker",
    name: "ColorPicker",
    category: "forms",
    description:
      "Styled native color swatch + hex input + 8 luxury preset swatches (maroon, gold, emerald...). Set popover to attach it to a trigger button.",
    demos: [
      {
        id: "swatches",
        title: "Luxury swatches",
        description:
          "Pick from the house palette or type any hex — value stays a normalized #rrggbb string.",
        code: `import * as React from "react"
import { ColorPicker } from "@/components/ui/color-picker"

export function AccentColor() {
  const [hex, setHex] = React.useState("#7d1f2e")
  return <ColorPicker value={hex} onChange={setHex} />
}`,
        render: () => <ColorPickerDemo />,
      },
    ],
    props: [
      {
        name: "value",
        type: "string",
        default: "—",
        description: 'Controlled hex string, e.g. "#7d1f2e".',
      },
      {
        name: "defaultValue",
        type: "string",
        default: "—",
        description: "Initial hex when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(hex: string) => void",
        default: "—",
        description: 'Called with a normalized lowercase "#rrggbb".',
      },
      {
        name: "presetSwatches",
        type: "string[]",
        default: "8 luxury defaults",
        description: "Preset swatch hex values.",
      },
      {
        name: "popover",
        type: "boolean",
        default: "false",
        description: "Render the picker inside a popover trigger button.",
      },
      {
        name: "placeholder",
        type: "string",
        default: '"Pick a color"',
        description: "Trigger text when no color is set (popover variant).",
      },
    ],
  },
]
