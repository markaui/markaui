import { useState } from "react"
import type { ComponentDoc } from "./types"

import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NumberInput } from "@/components/ui/number-input"
import { PasswordInput } from "@/components/ui/password-input"
import { SearchInput } from "@/components/ui/search-input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { InputGroup, InputGroupText } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { RangeSlider } from "@/components/ui/range-slider"
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField as RhfFormField,
} from "@/components/ui/form"
import { FormField, FormSection, FieldError } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import {
  BadgeCheck,
  Bookmark,
  Heart,
  Mail,
  Search,
  Star,
  User,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/* Interactive demo components                                         */
/* ------------------------------------------------------------------ */

function GuestsStepperDemo() {
  const [guests, setGuests] = useState(150)
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="guests">Expected guests</Label>
      <NumberInput
        id="guests"
        value={guests}
        onChange={(v) => setGuests(v ?? 20)}
        min={20}
        max={1000}
        step={10}
      />
      <p className="text-muted-foreground text-xs">
        Step 10 · Arrow keys and the +/- steppers both work.
      </p>
    </div>
  )
}

function MembershipFeeDemo() {
  const [fee, setFee] = useState(1250.5)
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="fee">Membership fee (₹)</Label>
      <NumberInput
        id="fee"
        value={fee}
        onChange={(v) => setFee(v ?? 499)}
        min={499}
        max={99999}
        step={0.5}
        precision={2}
        placeholder="0.00"
      />
      <p className="text-muted-foreground text-xs">
        Min ₹499 · Max ₹99,999 · Steps of 0.50 · Two decimals enforced.
      </p>
    </div>
  )
}

function PasswordToggleDemo() {
  const [password, setPassword] = useState("")
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="pwd-toggle">Password</Label>
      <PasswordInput
        id="pwd-toggle"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter a secure password"
      />
      <p className="text-muted-foreground text-xs">
        Use 8+ characters with a mix of letters, numbers and symbols.
      </p>
    </div>
  )
}

function PasswordStrengthDemo() {
  const [password, setPassword] = useState("Mehendi@2024")
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="pwd-strength">Create password</Label>
      <PasswordInput
        id="pwd-strength"
        showStrength
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Type to see the meter react"
      />
      <p className="text-muted-foreground text-xs">
        Scored on length, letter case, digits and symbols.
      </p>
    </div>
  )
}

function SearchLoadingDemo() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [lastQuery, setLastQuery] = useState<string | null>(null)

  const handleSearch = (q: string) => {
    setLastQuery(q)
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div className="w-full max-w-sm space-y-2">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
        loading={loading}
        placeholder="Search profiles by city, e.g. Jaipur"
      />
      <p className="text-muted-foreground text-xs">
        Press Enter to search · Clear (×) appears once you type.
      </p>
      {lastQuery ? (
        <p className="text-muted-foreground text-xs">
          Showing results for “{lastQuery}”…
        </p>
      ) : null}
    </div>
  )
}

function OtpDemo() {
  const [otp, setOtp] = useState("")
  return (
    <div className="space-y-3">
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-muted-foreground text-xs">
        6-digit code sent to +91 98••• ••210 · {otp.length} of 6 digits entered
        {otp.length === 6 ? " — verifying…" : ""}
      </p>
    </div>
  )
}

function TermsCheckboxDemo() {
  const [agreed, setAgreed] = useState(true)
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
      <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
      I agree to the Terms &amp; Privacy Policy
    </label>
  )
}

function PreferenceCardsDemo() {
  const [selected, setSelected] = useState(["horoscope"])

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )

  const preferences = [
    {
      id: "veg",
      title: "Vegetarian only",
      desc: "Matches from vegetarian families",
    },
    {
      id: "community",
      title: "Same community",
      desc: "Within Marathi Brahmin community",
    },
    {
      id: "horoscope",
      title: "Horoscope match",
      desc: "Kundali shared before the first meeting",
    },
  ]

  return (
    <div className="grid w-full max-w-md gap-3">
      {preferences.map((option) => (
        <label
          key={option.id}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-all duration-200",
            "hover:shadow-md has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          )}
        >
          <Checkbox
            className="mt-0.5"
            checked={selected.includes(option.id)}
            onCheckedChange={() => toggle(option.id)}
          />
          <span className="grid gap-0.5">
            <span className="text-sm font-medium">{option.title}</span>
            <span className="text-muted-foreground text-xs">{option.desc}</span>
          </span>
        </label>
      ))}
    </div>
  )
}

function DietRadioDemo() {
  const [diet, setDiet] = useState("veg")
  return (
    <div className="flex flex-col gap-6">
      <RadioGroup value={diet} onValueChange={setDiet} className="gap-3">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="veg" id="diet-veg" />
          <Label htmlFor="diet-veg" className="cursor-pointer font-normal">
            Vegetarian
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="egg" id="diet-egg" />
          <Label htmlFor="diet-egg" className="cursor-pointer font-normal">
            Eggetarian
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="nonveg" id="diet-nonveg" />
          <Label htmlFor="diet-nonveg" className="cursor-pointer font-normal">
            Non-Vegetarian
          </Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="mumbai" orientation="horizontal" className="gap-5">
        {["mumbai", "pune", "hyderabad"].map((city) => (
          <div key={city} className="flex items-center gap-2">
            <RadioGroupItem value={city} id={"city-" + city} />
            <Label
              htmlFor={"city-" + city}
              className="cursor-pointer font-normal capitalize"
            >
              {city}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

function PlanCardsDemo() {
  const [plan, setPlan] = useState("gold")

  const plans = [
    {
      id: "silver",
      name: "Silver",
      price: "₹999",
      perks: "20 profile views per month",
    },
    {
      id: "gold",
      name: "Gold",
      price: "₹2,499",
      perks: "Unlimited views + 5 contact unlocks",
    },
    {
      id: "diamond",
      name: "Diamond",
      price: "₹4,999",
      perks: "Dedicated matchmaker + horoscope reports",
    },
  ]

  return (
    <RadioGroup
      value={plan}
      onValueChange={setPlan}
      className="grid gap-3 sm:grid-cols-3"
    >
      {plans.map((option) => (
        <label
          key={option.id}
          htmlFor={"plan-" + option.id}
          className="has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 cursor-pointer rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-base font-semibold">{option.name}</span>
            <RadioGroupItem value={option.id} id={"plan-" + option.id} />
          </div>
          <p className="text-primary mt-1 text-lg font-semibold">{option.price}</p>
          <p className="text-muted-foreground mt-1 text-xs">{option.perks}</p>
        </label>
      ))}
    </RadioGroup>
  )
}

function AlertsSwitchDemo() {
  const [alerts, setAlerts] = useState(true)
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="alerts" checked={alerts} onCheckedChange={setAlerts} />
        <div className="grid gap-0.5">
          <Label htmlFor="alerts" className="cursor-pointer">
            Daily match alerts
          </Label>
          <p className="text-muted-foreground text-xs">
            Fresh matches every morning at 8 AM IST.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border p-4">
        <span className="text-sm font-medium">Hide my last seen</span>
        <Switch defaultChecked />
      </div>
    </div>
  )
}

function ShortlistToggleDemo() {
  const [on, setOn] = useState(false)
  return (
    <Toggle variant="outline" pressed={on} onPressedChange={setOn}>
      <Star className="size-4" />
      {on ? "Shortlisted" : "Shortlist"}
    </Toggle>
  )
}

function SortToggleGroupDemo() {
  const [sort, setSort] = useState("nearby")
  return (
    <div className="space-y-2">
      <ToggleGroup
        type="single"
        variant="outline"
        value={sort}
        onValueChange={(v) => v && setSort(v)}
      >
        <ToggleGroupItem value="nearby">Nearby</ToggleGroupItem>
        <ToggleGroupItem value="new">Newest</ToggleGroupItem>
        <ToggleGroupItem value="active">Recently active</ToggleGroupItem>
      </ToggleGroup>
      <p className="text-muted-foreground text-xs">Profiles sorted by: {sort}</p>
    </div>
  )
}

function FilterToggleGroupDemo() {
  const [filters, setFilters] = useState(["verified"])
  return (
    <div className="space-y-2">
      <ToggleGroup
        type="multiple"
        variant="outline"
        value={filters}
        onValueChange={setFilters}
      >
        <ToggleGroupItem value="verified">
          <BadgeCheck className="size-4" /> Verified
        </ToggleGroupItem>
        <ToggleGroupItem value="veg">Vegetarian</ToggleGroupItem>
        <ToggleGroupItem value="abroad">Settled abroad</ToggleGroupItem>
      </ToggleGroup>
      <p className="text-muted-foreground text-xs">
        {filters.length} of 3 filters active
      </p>
    </div>
  )
}

function AgeSliderDemo() {
  const [age, setAge] = useState(26)
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between">
        <Label>Preferred age</Label>
        <span className="text-primary text-sm font-semibold">{age} yrs</span>
      </div>
      <Slider
        min={18}
        max={60}
        value={[age]}
        onValueChange={(v) => setAge(v[0] ?? 26)}
      />
      <p className="text-muted-foreground text-xs">Range 18 – 60 years.</p>
    </div>
  )
}

function BudgetRangeDemo() {
  const [budget, setBudget] = useState([15000, 85000])
  const inr = (v: number) => "₹" + v.toLocaleString("en-IN")
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Wedding budget</span>
        <span className="text-primary font-semibold">
          {inr(budget[0])} – {inr(budget[1])}
        </span>
      </div>
      <RangeSlider
        value={budget}
        onValueChange={setBudget}
        min={0}
        max={100000}
        step={5000}
        minStepsBetweenThumbs={2}
        showValue
        formatValue={inr}
      />
      <p className="text-muted-foreground text-xs">
        Drag both thumbs · 0 to ₹1,00,000 in ₹5,000 steps.
      </p>
    </div>
  )
}

function ProfileFormDemo() {
  const form = useForm<{ name: string; email: string }>({
    defaultValues: { name: "", email: "" },
  })
  const [saved, setSaved] = useState<string | null>(null)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          setSaved(values.name + " — " + values.email)
        )}
        className="w-full max-w-sm space-y-4"
      >
        <RhfFormField
          control={form.control}
          name="name"
          rules={{ required: "Please enter your full name." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Rohan Mehta" {...field} />
              </FormControl>
              <FormDescription>Shown on your Saptapadi profile.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <RhfFormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required.",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <Button type="submit">Save profile</Button>
          {saved ? (
            <span className="text-success text-xs font-medium">Saved: {saved}</span>
          ) : null}
        </div>
      </form>
    </Form>
  )
}

/* ------------------------------------------------------------------ */
/* Registry docs                                                       */
/* ------------------------------------------------------------------ */

export const forms_1Docs: ComponentDoc[] = [
  {
    id: "input",
    name: "Input",
    category: "forms",
    description:
      "Enhanced text input with three sizes, leading/trailing icon slots and a destructive error state.",
    aliases: ["TextField", "TextInput"],
    demos: [
      {
        id: "sizes",
        title: "Basic & sizes",
        description: "sm, default and lg heights on the same design language.",
        code: `import { Input } from "@/components/ui/input"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Input placeholder="Enter your full name" />
      <Input size="sm" placeholder="Small — h-8" />
      <Input size="lg" placeholder="Large — h-11" />
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-4">
            <Input placeholder="Enter your full name" />
            <Input size="sm" placeholder="Small — h-8" />
            <Input size="lg" placeholder="Large — h-11" />
          </div>
        ),
      },
      {
        id: "icons",
        title: "With icons",
        description: "leadingIcon and trailingIcon render inside the field frame.",
        code: `import { Input } from "@/components/ui/input"
import { BadgeCheck, Mail, Search, User } from "lucide-react"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Input leadingIcon={<User className="size-4" />} defaultValue="Ananya Sharma" />
      <Input leadingIcon={<Mail className="size-4" />} placeholder="ananya@example.com" />
      <Input
        leadingIcon={<Search className="size-4" />}
        placeholder="Search by city or surname"
        trailingIcon={<BadgeCheck className="size-4 text-success" />}
      />
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-4">
            <Input
              leadingIcon={<User className="size-4" />}
              defaultValue="Ananya Sharma"
              aria-label="Full name"
            />
            <Input
              leadingIcon={<Mail className="size-4" />}
              placeholder="ananya@example.com"
            />
            <Input
              leadingIcon={<Search className="size-4" />}
              placeholder="Search by city or surname"
              trailingIcon={<BadgeCheck className="size-4 text-success" />}
            />
          </div>
        ),
      },
      {
        id: "error",
        title: "Error state",
        description: "The error prop adds the destructive border and ring.",
        code: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" defaultValue="ananya@sharma" error placeholder="you@example.com" />
      <p className="text-destructive text-xs">Please enter a valid email address.</p>
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="input-error-email">Email</Label>
            <Input
              id="input-error-email"
              defaultValue="ananya@sharma"
              error
              placeholder="you@example.com"
            />
            <p className="text-destructive text-xs">
              Please enter a valid email address.
            </p>
          </div>
        ),
      },
    ],
    props: [
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Visual height and font size." },
      { name: "leadingIcon", type: "React.ReactNode", description: "Element rendered at the left inner edge." },
      { name: "trailingIcon", type: "React.ReactNode", description: "Element rendered at the right inner edge." },
      { name: "error", type: "boolean", default: "false", description: "Destructive border / ring for validation failures." },
      { name: "placeholder", type: "string", description: "Native placeholder text." },
      { name: "className", type: "string", description: "Merged onto the underlying input element." },
    ],
  },
  {
    id: "textarea",
    name: "Textarea",
    category: "forms",
    description:
      "Auto-growing multi-line input built on field-sizing, with native rows and resize support.",
    aliases: ["TextArea", "TextField"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Grows with content while staying within min-h-16.",
        code: `import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="bio">About you</Label>
      <Textarea id="bio" placeholder="A few lines about you, your family and interests…" />
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="textarea-basic-bio">About you</Label>
            <Textarea
              id="textarea-basic-bio"
              placeholder="A few lines about you, your family and interests…"
            />
            <p className="text-muted-foreground text-xs">
              Grows with content via field-sizing.
            </p>
          </div>
        ),
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "Non-interactive state for locked or admin-managed data.",
        code: `import { Textarea } from "@/components/ui/textarea"

export function Demo() {
  return (
    <Textarea
      disabled
      defaultValue="Family contact details are managed by your account guardian."
    />
  )
}`,
        render: () => (
          <Textarea
            disabled
            defaultValue="Family contact details are managed by your account guardian."
          />
        ),
      },
      {
        id: "rows-resize",
        title: "Rows & resize",
        description: "Fix the height with rows + field-sizing-fixed, or lock resizing.",
        code: `import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invite">Invitation note (fixed 4 rows)</Label>
        <Textarea id="invite" rows={4} className="field-sizing-fixed" placeholder="Dear Sharma family,…" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Note (resize disabled)</Label>
        <Textarea id="note" className="resize-none" placeholder="This one locks the resize handle." />
      </div>
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textarea-invite">Invitation note (fixed 4 rows)</Label>
              <Textarea
                id="textarea-invite"
                rows={4}
                className="field-sizing-fixed"
                placeholder="Dear Sharma family,…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea-note">Note (resize disabled)</Label>
              <Textarea
                id="textarea-note"
                className="resize-none"
                placeholder="This one locks the resize handle."
              />
            </div>
          </div>
        ),
      },
    ],
    props: [
      { name: "rows", type: "number", description: "Visible row count when height is fixed." },
      { name: "defaultValue", type: "string", description: "Initial content (uncontrolled)." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents editing and dims the field." },
      { name: "className", type: "string", description: "E.g. resize-none or field-sizing-fixed." },
    ],
  },
  {
    id: "number-input",
    name: "NumberInput",
    category: "forms",
    description:
      "Numeric field with inner +/- steppers, ArrowUp/ArrowDown support, clamping to min/max and fixed precision.",
    aliases: ["NumberField"],
    demos: [
      {
        id: "stepper",
        title: "Basic stepper",
        description: "Controlled value with min, max and step.",
        code: `import { NumberInput } from "@/components/ui/number-input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function Demo() {
  const [guests, setGuests] = useState(150)
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="guests">Expected guests</Label>
      <NumberInput
        id="guests"
        value={guests}
        onChange={(v) => setGuests(v ?? 20)}
        min={20}
        max={1000}
        step={10}
      />
    </div>
  )
}`,
        render: () => <GuestsStepperDemo />,
      },
      {
        id: "precision",
        title: "Min / max / precision",
        description: "Decimal steps with two enforced decimal places.",
        code: `import { NumberInput } from "@/components/ui/number-input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function Demo() {
  const [fee, setFee] = useState(1250.5)
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="fee">Membership fee (₹)</Label>
      <NumberInput
        id="fee"
        value={fee}
        onChange={(v) => setFee(v ?? 499)}
        min={499}
        max={99999}
        step={0.5}
        precision={2}
        placeholder="0.00"
      />
    </div>
  )
}`,
        render: () => <MembershipFeeDemo />,
      },
    ],
    props: [
      { name: "value", type: "number", description: "Controlled numeric value." },
      { name: "defaultValue", type: "number", description: "Initial value when uncontrolled." },
      { name: "onChange", type: "(value: number | undefined) => void", description: "Parsed value; undefined when emptied." },
      { name: "min / max", type: "number", description: "Clamp bounds for typing and stepping." },
      { name: "step", type: "number", default: "1", description: "Increment / decrement amount (also ArrowUp / ArrowDown)." },
      { name: "precision", type: "number", description: "Fixed number of decimal places." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables field and steppers." },
    ],
  },
  {
    id: "password-input",
    name: "PasswordInput",
    category: "forms",
    description:
      "Password field with an Eye / EyeOff visibility toggle and an optional weak → great strength meter.",
    aliases: ["PasswordField"],
    demos: [
      {
        id: "toggle",
        title: "Visibility toggle",
        description: "Ghost IconButton inside the field flips the input type.",
        code: `import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function Demo() {
  const [password, setPassword] = useState("")
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="pwd">Password</Label>
      <PasswordInput
        id="pwd"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter a secure password"
      />
    </div>
  )
}`,
        render: () => <PasswordToggleDemo />,
      },
      {
        id: "strength",
        title: "Strength meter",
        description: "showStrength renders weak / fair / strong / great bars.",
        code: `import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function Demo() {
  const [password, setPassword] = useState("Mehendi@2024")
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="pwd-strength">Create password</Label>
      <PasswordInput
        id="pwd-strength"
        showStrength
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  )
}`,
        render: () => <PasswordStrengthDemo />,
      },
    ],
    props: [
      { name: "value", type: "string", description: "Controlled value." },
      { name: "defaultValue", type: "string", description: "Initial value when uncontrolled." },
      { name: "onChange", type: "(event: ChangeEvent<HTMLInputElement>) => void", description: "Standard change handler." },
      { name: "showStrength", type: "boolean", default: "false", description: "Renders the 4-bar strength meter." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables field and toggle." },
    ],
  },
  {
    id: "search-input",
    name: "SearchInput",
    category: "forms",
    description:
      "Search field with a leading magnifier, clear-on-type button, optional loading spinner and Enter-to-search.",
    aliases: ["SearchField"],
    demos: [
      {
        id: "loading-clear",
        title: "Loading + clear",
        description: "onSearch fires on Enter; loading swaps the clear button for a spinner.",
        code: `import { SearchInput } from "@/components/ui/search-input"
import { useState } from "react"

export function Demo() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSearch = (q: string) => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1200)
  }

  return (
    <SearchInput
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onSearch={handleSearch}
      loading={loading}
      placeholder="Search profiles by city, e.g. Jaipur"
    />
  )
}`,
        render: () => <SearchLoadingDemo />,
      },
    ],
    props: [
      { name: "value", type: "string", description: "Controlled query." },
      { name: "defaultValue", type: "string", description: "Initial query when uncontrolled." },
      { name: "onChange", type: "(event: ChangeEvent<HTMLInputElement>) => void", description: "Fires on every keystroke." },
      { name: "onSearch", type: "(value: string) => void", description: "Fired on Enter — debounce upstream as needed." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner in the trailing slot." },
      { name: "placeholder", type: "string", default: '"Search…"', description: "Placeholder text." },
    ],
  },
  {
    id: "otp-input",
    name: "OTPInput",
    category: "forms",
    description:
      "One-time-password field built on input-otp with grouped slots and separators — ideal for verification codes.",
    aliases: ["InputOTP", "OneTimePassword"],
    demos: [
      {
        id: "six-digit",
        title: "6-digit with separator",
        description: "Two groups of three slots split by a dash separator.",
        code: `import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useState } from "react"

export function Demo() {
  const [otp, setOtp] = useState("")
  return (
    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}`,
        render: () => <OtpDemo />,
      },
    ],
    props: [
      { name: "maxLength", type: "number", description: "Total number of digits." },
      { name: "value", type: "string", description: "Controlled code." },
      { name: "onChange", type: "(value: string) => void", description: "Fires as digits are typed or pasted." },
      { name: "containerClassName", type: "string", description: "Class for the flex slot container." },
      { name: "disabled", type: "boolean", default: "false", description: "Locks the whole field." },
    ],
  },
  {
    id: "input-group",
    name: "InputGroup",
    category: "forms",
    description:
      "Bordered row that attaches prefix / suffix addon slots around an Input — currencies, domains, units and icons.",
    aliases: ["FieldGroup"],
    demos: [
      {
        id: "prefix-rupee",
        title: "₹ prefix",
        description: "Currency addon attached before the field.",
        code: `import { InputGroup } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="budget">Monthly budget</Label>
      <InputGroup prefix="₹">
        <Input id="budget" defaultValue="25,000" inputMode="numeric" />
      </InputGroup>
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="ig-budget">Monthly budget</Label>
            <InputGroup prefix="₹">
              <Input id="ig-budget" defaultValue="25,000" inputMode="numeric" />
            </InputGroup>
            <p className="text-muted-foreground text-xs">
              Addons stay visually attached on every theme.
            </p>
          </div>
        ),
      },
      {
        id: "suffix-domain",
        title: "Domain suffix",
        description: "Static .com addon after the handle.",
        code: `import { InputGroup } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"

export function Demo() {
  return (
    <InputGroup suffix=".com">
      <Input defaultValue="ananya-sharma" />
    </InputGroup>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="ig-site">Personal website</Label>
            <InputGroup suffix=".com">
              <Input id="ig-site" defaultValue="ananya-sharma" />
            </InputGroup>
          </div>
        ),
      },
      {
        id: "icon-prefix",
        title: "Icon prefix",
        description: "Compose freely with the InputGroupText helper export.",
        code: `import { InputGroup, InputGroupText } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function Demo() {
  return (
    <InputGroup>
      <InputGroupText>
        <Search className="size-4" />
      </InputGroupText>
      <Input placeholder="Search rituals, venues, vendors…" />
    </InputGroup>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-2">
            <InputGroup>
              <InputGroupText>
                <Search className="size-4" />
              </InputGroupText>
              <Input placeholder="Search rituals, venues, vendors…" />
            </InputGroup>
            <p className="text-muted-foreground text-xs">
              Any Input child is auto-stripped of its border to blend into the group.
            </p>
          </div>
        ),
      },
    ],
    props: [
      { name: "prefix", type: "React.ReactNode", description: "Addon rendered before the input." },
      { name: "suffix", type: "React.ReactNode", description: "Addon rendered after the input." },
      { name: "children", type: "React.ReactNode", description: "Usually a single Input; plain nodes pass through." },
      { name: "className", type: "string", description: "Merged onto the bordered row." },
    ],
  },
  {
    id: "label",
    name: "Label",
    category: "forms",
    description:
      "Accessible form label built on Radix — pairs with any control via htmlFor.",
    demos: [
      {
        id: "required",
        title: "Required marker",
        description: "Add the asterisk manually with a destructive span.",
        code: `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="full-name">
        Full Name <span aria-hidden="true" className="text-destructive">*</span>
      </Label>
      <Input id="full-name" placeholder="e.g. Ananya Sharma" />
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="label-full-name">
              Full Name <span aria-hidden="true" className="text-destructive">*</span>
            </Label>
            <Input id="label-full-name" placeholder="e.g. Ananya Sharma" />
            <p className="text-muted-foreground text-xs">
              Clicking the label focuses the linked control.
            </p>
          </div>
        ),
      },
    ],
    props: [
      { name: "htmlFor", type: "string", description: "id of the linked control." },
      { name: "className", type: "string", description: "Merged onto the label element." },
      { name: "children", type: "React.ReactNode", description: "Label text, including markers like the required asterisk." },
    ],
  },
  {
    id: "checkbox",
    name: "Checkbox",
    category: "forms",
    description:
      "Radix checkbox with checked / indeterminate states — supports label rows and card-style selection lists.",
    aliases: ["Check"],
    demos: [
      {
        id: "basic",
        title: "Basic",
        description: "Controlled single checkbox in a label row.",
        code: `import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

export function Demo() {
  const [agreed, setAgreed] = useState(true)
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
      <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
      I agree to the Terms & Privacy Policy
    </label>
  )
}`,
        render: () => <TermsCheckboxDemo />,
      },
      {
        id: "description",
        title: "With description",
        description: "Title + helper text aligned beside the box.",
        code: `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function Demo() {
  return (
    <div className="flex items-start gap-3">
      <Checkbox id="notif" className="mt-0.5" />
      <div className="grid gap-1">
        <Label htmlFor="notif">Profile visibility</Label>
        <p className="text-muted-foreground text-xs">
          Show my profile to premium members only.
        </p>
      </div>
    </div>
  )
}`,
        render: () => (
          <div className="flex items-start gap-3">
            <Checkbox id="checkbox-notif" className="mt-0.5" />
            <div className="grid gap-1">
              <Label htmlFor="checkbox-notif">Profile visibility</Label>
              <p className="text-muted-foreground text-xs">
                Show my profile in matching results for premium members only.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "Both states rendered non-interactive.",
        code: `import { Checkbox } from "@/components/ui/checkbox"

export function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm opacity-70">
        <Checkbox disabled checked /> Verified profile (locked)
      </label>
      <label className="flex items-center gap-2 text-sm opacity-70">
        <Checkbox disabled /> Family approval pending
      </label>
    </div>
  )
}`,
        render: () => (
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm opacity-70">
              <Checkbox disabled checked />
              Verified profile (locked)
            </label>
            <label className="flex items-center gap-2 text-sm opacity-70">
              <Checkbox disabled />
              Family approval pending
            </label>
          </div>
        ),
      },
      {
        id: "card-selection",
        title: "Card-style selection",
        description: "Matrimony preferences as bordered, checkable cards.",
        wide: true,
        code: `import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useState } from "react"

const preferences = [
  { id: "veg", title: "Vegetarian only", desc: "Matches from vegetarian families" },
  { id: "community", title: "Same community", desc: "Within Marathi Brahmin community" },
  { id: "horoscope", title: "Horoscope match", desc: "Kundali shared before the first meeting" },
]

export function Demo() {
  const [selected, setSelected] = useState(["horoscope"])

  const toggle = (id: string) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    )

  return (
    <div className="grid w-full max-w-md gap-3">
      {preferences.map((option) => (
        <label
          key={option.id}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200",
            "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          )}
        >
          <Checkbox
            className="mt-0.5"
            checked={selected.includes(option.id)}
            onCheckedChange={() => toggle(option.id)}
          />
          <span className="grid gap-0.5">
            <span className="text-sm font-medium">{option.title}</span>
            <span className="text-muted-foreground text-xs">{option.desc}</span>
          </span>
        </label>
      ))}
    </div>
  )
}`,
        render: () => <PreferenceCardsDemo />,
      },
    ],
    props: [
      { name: "checked", type: "boolean | 'indeterminate'", description: "Controlled state." },
      { name: "onCheckedChange", type: "(checked: boolean | 'indeterminate') => void", description: "Fired when toggled." },
      { name: "defaultChecked", type: "boolean", description: "Initial state (uncontrolled)." },
      { name: "disabled", type: "boolean", default: "false", description: "Non-interactive state." },
    ],
  },
  {
    id: "radio",
    name: "Radio",
    category: "forms",
    description:
      "A single RadioGroupItem — always rendered inside a RadioGroup root so keyboard roving focus works.",
    aliases: ["RadioGroupItem", "RadioButton"],
    demos: [
      {
        id: "lone",
        title: "Lone radio",
        description: "One item in a minimal RadioGroup wrapper.",
        code: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function Demo() {
  return (
    <RadioGroup defaultValue="veg" className="flex items-center gap-2">
      <RadioGroupItem value="veg" id="lone-veg" />
      <Label htmlFor="lone-veg" className="cursor-pointer">
        Vegetarian only
      </Label>
    </RadioGroup>
  )
}`,
        render: () => (
          <RadioGroup defaultValue="veg" className="flex items-center gap-2">
            <RadioGroupItem value="veg" id="lone-radio-veg" />
            <Label htmlFor="lone-radio-veg" className="cursor-pointer">
              Vegetarian only
            </Label>
          </RadioGroup>
        ),
      },
    ],
    props: [
      { name: "value", type: "string", description: "Value this item represents in its group." },
      { name: "disabled", type: "boolean", default: "false", description: "Non-interactive state." },
      { name: "className", type: "string", description: "Merged onto the radio circle." },
    ],
  },
  {
    id: "radio-group",
    name: "RadioGroup",
    category: "forms",
    description:
      "Single-choice group with vertical / horizontal orientations and card-style plan layouts.",
    demos: [
      {
        id: "basic",
        title: "Basic & orientation",
        description: "Vertical controlled group and a horizontal defaultChecked group.",
        code: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function Demo() {
  const [diet, setDiet] = useState("veg")
  return (
    <div className="flex flex-col gap-6">
      <RadioGroup value={diet} onValueChange={setDiet} className="gap-3">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="veg" id="diet-veg" />
          <Label htmlFor="diet-veg" className="cursor-pointer font-normal">Vegetarian</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="egg" id="diet-egg" />
          <Label htmlFor="diet-egg" className="cursor-pointer font-normal">Eggetarian</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="nonveg" id="diet-nonveg" />
          <Label htmlFor="diet-nonveg" className="cursor-pointer font-normal">Non-Vegetarian</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="mumbai" orientation="horizontal" className="gap-5">
        {["mumbai", "pune", "hyderabad"].map((city) => (
          <div key={city} className="flex items-center gap-2">
            <RadioGroupItem value={city} id={"city-" + city} />
            <Label htmlFor={"city-" + city} className="cursor-pointer font-normal capitalize">
              {city}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}`,
        render: () => <DietRadioDemo />,
      },
      {
        id: "plans",
        title: "Card-style plans",
        description: "Membership plans as selectable cards with the checked state highlighting.",
        wide: true,
        code: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

const plans = [
  { id: "silver", name: "Silver", price: "₹999", perks: "20 profile views per month" },
  { id: "gold", name: "Gold", price: "₹2,499", perks: "Unlimited views + 5 contact unlocks" },
  { id: "diamond", name: "Diamond", price: "₹4,999", perks: "Dedicated matchmaker + horoscope reports" },
]

export function Demo() {
  const [plan, setPlan] = useState("gold")
  return (
    <RadioGroup value={plan} onValueChange={setPlan} className="grid gap-3 sm:grid-cols-3">
      {plans.map((option) => (
        <label
          key={option.id}
          htmlFor={"plan-" + option.id}
          className="has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 cursor-pointer rounded-xl border p-4 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-base font-semibold">{option.name}</span>
            <RadioGroupItem value={option.id} id={"plan-" + option.id} />
          </div>
          <p className="mt-1 text-lg font-semibold text-primary">{option.price}</p>
          <p className="mt-1 text-muted-foreground text-xs">{option.perks}</p>
        </label>
      ))}
    </RadioGroup>
  )
}`,
        render: () => <PlanCardsDemo />,
      },
    ],
    props: [
      { name: "value", type: "string", description: "Controlled selected value." },
      { name: "defaultValue", type: "string", description: "Initially selected value." },
      { name: "onValueChange", type: "(value: string) => void", description: "Fired when the selection changes." },
      { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Arrow-key direction and data attribute." },
    ],
  },
  {
    id: "switch",
    name: "Switch",
    category: "forms",
    description:
      "Radix toggle switch for instant on/off settings — pairs with labels and scales cleanly.",
    demos: [
      {
        id: "labels",
        title: "With labels",
        description: "Controlled switch with a helper line, plus a settings row.",
        code: `import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function Demo() {
  const [alerts, setAlerts] = useState(true)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="alerts" checked={alerts} onCheckedChange={setAlerts} />
        <div className="grid gap-0.5">
          <Label htmlFor="alerts" className="cursor-pointer">Daily match alerts</Label>
          <p className="text-muted-foreground text-xs">
            Fresh matches every morning at 8 AM IST.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border p-4">
        <span className="text-sm font-medium">Hide my last seen</span>
        <Switch defaultChecked />
      </div>
    </div>
  )
}`,
        render: () => <AlertsSwitchDemo />,
      },
      {
        id: "sizes",
        title: "Sizes via scale",
        description: "scale-90 / scale-110 / scale-125 for compact or prominent switches.",
        code: `import { Switch } from "@/components/ui/switch"

export function Demo() {
  return (
    <div className="flex items-center gap-6">
      <Switch defaultChecked className="scale-90" />
      <Switch defaultChecked className="scale-110" />
      <Switch defaultChecked className="scale-125" />
    </div>
  )
}`,
        render: () => (
          <div className="flex items-center gap-6">
            <Switch defaultChecked className="scale-90" />
            <Switch defaultChecked className="scale-110" />
            <Switch defaultChecked className="scale-125" />
          </div>
        ),
      },
      {
        id: "disabled",
        title: "Disabled",
        description: "Locked switches in both states.",
        code: `import { Switch } from "@/components/ui/switch"

export function Demo() {
  return (
    <div className="flex items-center gap-6">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  )
}`,
        render: () => (
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Switch disabled />
              <span className="text-muted-foreground text-xs">Off</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Switch disabled defaultChecked />
              <span className="text-muted-foreground text-xs">On</span>
            </div>
          </div>
        ),
      },
    ],
    props: [
      { name: "checked", type: "boolean", description: "Controlled state." },
      { name: "defaultChecked", type: "boolean", description: "Initial state (uncontrolled)." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Fired when toggled." },
      { name: "disabled", type: "boolean", default: "false", description: "Non-interactive state." },
      { name: "className", type: "string", description: "E.g. scale-110 to resize." },
    ],
  },
  {
    id: "toggle",
    name: "Toggle",
    category: "forms",
    description:
      "Single pressed-state button — default and outline variants, ideal for filters and quick actions.",
    demos: [
      {
        id: "variants",
        title: "Variants",
        description: "Default icon toggle, pressed outline toggle and a disabled state.",
        code: `import { Toggle } from "@/components/ui/toggle"
import { Bookmark, Heart } from "lucide-react"

export function Demo() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Like profile">
        <Heart className="size-4" />
      </Toggle>
      <Toggle variant="outline" defaultPressed aria-label="Save profile">
        <Bookmark className="size-4" />
      </Toggle>
      <Toggle variant="outline" disabled>
        Locked
      </Toggle>
    </div>
  )
}`,
        render: () => (
          <div className="flex items-center gap-3">
            <Toggle aria-label="Like profile">
              <Heart className="size-4" />
            </Toggle>
            <Toggle variant="outline" defaultPressed aria-label="Save profile">
              <Bookmark className="size-4" />
            </Toggle>
            <Toggle variant="outline" disabled>
              Locked
            </Toggle>
          </div>
        ),
      },
      {
        id: "text-icon",
        title: "Text + icon",
        description: "Controlled pressed state with a label that reflects it.",
        code: `import { Toggle } from "@/components/ui/toggle"
import { Star } from "lucide-react"
import { useState } from "react"

export function Demo() {
  const [on, setOn] = useState(false)
  return (
    <Toggle variant="outline" pressed={on} onPressedChange={setOn}>
      <Star className="size-4" />
      {on ? "Shortlisted" : "Shortlist"}
    </Toggle>
  )
}`,
        render: () => <ShortlistToggleDemo />,
      },
    ],
    props: [
      { name: "variant", type: '"default" | "outline"', default: '"default"', description: "Visual treatment." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height and padding." },
      { name: "pressed", type: "boolean", description: "Controlled pressed state." },
      { name: "defaultPressed", type: "boolean", description: "Initial pressed state." },
      { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Fired when pressed state changes." },
    ],
  },
  {
    id: "toggle-group",
    name: "ToggleGroup",
    category: "forms",
    description:
      "Connected set of toggles supporting single (radio-like) and multiple (checkbox-like) selection.",
    demos: [
      {
        id: "single",
        title: "Single type",
        description: "Exactly one active item at a time.",
        code: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react"

export function Demo() {
  const [sort, setSort] = useState("nearby")
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={sort}
      onValueChange={(v) => v && setSort(v)}
    >
      <ToggleGroupItem value="nearby">Nearby</ToggleGroupItem>
      <ToggleGroupItem value="new">Newest</ToggleGroupItem>
      <ToggleGroupItem value="active">Recently active</ToggleGroupItem>
    </ToggleGroup>
  )
}`,
        render: () => <SortToggleGroupDemo />,
      },
      {
        id: "multiple",
        title: "Multiple type",
        description: "Any number of items can be active.",
        code: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BadgeCheck } from "lucide-react"
import { useState } from "react"

export function Demo() {
  const [filters, setFilters] = useState(["verified"])
  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      value={filters}
      onValueChange={setFilters}
    >
      <ToggleGroupItem value="verified">
        <BadgeCheck className="size-4" /> Verified
      </ToggleGroupItem>
      <ToggleGroupItem value="veg">Vegetarian</ToggleGroupItem>
      <ToggleGroupItem value="abroad">Settled abroad</ToggleGroupItem>
    </ToggleGroup>
  )
}`,
        render: () => <FilterToggleGroupDemo />,
      },
    ],
    props: [
      { name: "type", type: '"single" | "multiple"', description: "Selection mode." },
      { name: "value", type: "string | string[]", description: "Controlled active item(s)." },
      { name: "onValueChange", type: "(value: string | string[]) => void", description: "Fired with the new selection." },
      { name: "variant", type: '"default" | "outline"', default: '"default"', description: "Passed down to items; outline joins them into a bar." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Passed down to items." },
    ],
  },
  {
    id: "slider",
    name: "Slider",
    category: "forms",
    description:
      "Radix single-value slider with theme-aware track, range and thumb — keyboard and touch ready.",
    demos: [
      {
        id: "basic",
        title: "Basic + value display",
        description: "Live numeric readout bound to the thumb.",
        code: `import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function Demo() {
  const [age, setAge] = useState(26)
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between">
        <Label>Preferred age</Label>
        <span className="text-sm font-semibold text-primary">{age} yrs</span>
      </div>
      <Slider min={18} max={60} value={[age]} onValueChange={(v) => setAge(v[0] ?? 26)} />
    </div>
  )
}`,
        render: () => <AgeSliderDemo />,
      },
    ],
    props: [
      { name: "value", type: "number[]", description: "Controlled thumb position(s)." },
      { name: "defaultValue", type: "number[]", description: "Initial position(s)." },
      { name: "onValueChange", type: "(value: number[]) => void", description: "Fired while dragging." },
      { name: "min / max", type: "number", default: "0 / 100", description: "Track bounds." },
      { name: "step", type: "number", default: "1", description: "Granularity of movement." },
    ],
  },
  {
    id: "range-slider",
    name: "RangeSlider",
    category: "forms",
    description:
      "Dual-thumb min/max range built on Radix Slider, with optional formatted value labels; a single-element value behaves like a one-thumb slider.",
    aliases: ["DualThumbSlider"],
    demos: [
      {
        id: "price-range",
        title: "Price range",
        description: "₹0 – ₹1,00,000 budget picker with live formatted labels.",
        code: `import { RangeSlider } from "@/components/ui/range-slider"
import { useState } from "react"

const inr = (v: number) => "₹" + v.toLocaleString("en-IN")

export function Demo() {
  const [budget, setBudget] = useState([15000, 85000])
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Wedding budget</span>
        <span className="font-semibold text-primary">
          {inr(budget[0])} – {inr(budget[1])}
        </span>
      </div>
      <RangeSlider
        value={budget}
        onValueChange={setBudget}
        min={0}
        max={100000}
        step={5000}
        minStepsBetweenThumbs={2}
        showValue
        formatValue={inr}
      />
    </div>
  )
}`,
        render: () => <BudgetRangeDemo />,
      },
    ],
    props: [
      { name: "value", type: "number[]", default: "[min, max]", description: "[min, max] for two thumbs; [x] for one thumb." },
      { name: "defaultValue", type: "number[]", description: "Initial value(s) when uncontrolled." },
      { name: "onValueChange", type: "(value: number[]) => void", description: "Fired with the ordered thumb values." },
      { name: "min / max", type: "number", default: "0 / 100", description: "Track bounds." },
      { name: "step", type: "number", default: "1", description: "Granularity of movement." },
      { name: "minStepsBetweenThumbs", type: "number", default: "0", description: "Minimum gap between the two thumbs." },
      { name: "showValue", type: "boolean", default: "false", description: "Renders the selected value(s) above the track." },
      { name: "formatValue", type: "(value: number) => string", default: "(v) => String(v)", description: "Formatter for the displayed labels." },
    ],
  },
  {
    id: "form",
    name: "Form",
    category: "forms",
    description:
      "react-hook-form integration — Form provider plus FormField / FormItem / FormLabel / FormControl / FormMessage parts.",
    aliases: ["ReactHookForm", "HookForm"],
    demos: [
      {
        id: "profile",
        title: "Profile form",
        description: "Name + email with required validation via rules and formState errors.",
        wide: true,
        code: `import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Demo() {
  const form = useForm({ defaultValues: { name: "", email: "" } })
  const [saved, setSaved] = useState<string | null>(null)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          setSaved(values.name + " — " + values.email)
        )}
        className="w-full max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Please enter your full name." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Rohan Mehta" {...field} />
              </FormControl>
              <FormDescription>Shown on your Saptapadi profile.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save profile</Button>
        {saved && <p className="text-success text-xs">Saved: {saved}</p>}
      </form>
    </Form>
  )
}`,
        render: () => <ProfileFormDemo />,
      },
    ],
    props: [
      { name: "form", type: "UseFormReturn", description: "Instance from useForm — spread onto <Form {...form}>." },
      { name: "FormField.control", type: "Control<FieldValues>", description: "Wire each Controller field to the form." },
      { name: "FormField.name", type: "FieldPath", description: "Registered field name." },
      { name: "FormField.rules", type: "RegisterOptions", description: "Validation rules (required, pattern, …) without zod." },
      { name: "FormMessage", type: "ReactNode", description: "Renders the field error text from formState." },
    ],
  },
  {
    id: "form-field",
    name: "FormField",
    category: "forms",
    description:
      "Standalone labelled field wrapper — Label on top, hint below, error message replacing the hint, optional required asterisk and horizontal layout. No form library needed.",
    aliases: ["Field"],
    demos: [
      {
        id: "hint-error",
        title: "Hint & error",
        description: "One field showing a hint, one showing an error with Input error styling.",
        code: `import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <FormField
        label="Email address"
        htmlFor="ff-email"
        required
        hint="We never share your email with anyone."
      >
        <Input id="ff-email" placeholder="ananya@example.com" />
      </FormField>
      <FormField
        label="Profile headline"
        htmlFor="ff-headline"
        error="Keep the headline under 60 characters."
      >
        <Input id="ff-headline" defaultValue="Engineer who loves the Sahyadris" error />
      </FormField>
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-6">
            <FormField
              label="Email address"
              htmlFor="ff-email"
              required
              hint="We never share your email with anyone."
            >
              <Input id="ff-email" placeholder="ananya@example.com" />
            </FormField>
            <FormField
              label="Profile headline"
              htmlFor="ff-headline"
              error="Keep the headline under 60 characters."
            >
              <Input
                id="ff-headline"
                defaultValue="Engineer who loves the Sahyadris"
                error
              />
            </FormField>
          </div>
        ),
      },
    ],
    props: [
      { name: "label", type: "React.ReactNode", description: "Label text rendered above (vertical) or beside (horizontal)." },
      { name: "hint", type: "React.ReactNode", description: "Helper text under the control." },
      { name: "error", type: "React.ReactNode", description: "Validation message — replaces the hint in destructive tone." },
      { name: "required", type: "boolean", default: "false", description: "Shows a destructive asterisk." },
      { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Label placement." },
      { name: "htmlFor", type: "string", description: "id of the control, forwarded to the label." },
    ],
  },
  {
    id: "form-section",
    name: "FormSection",
    category: "forms",
    description:
      "Titled form region with a serif heading, description and a responsive grid of fields (1–4 columns).",
    aliases: ["Fieldset"],
    demos: [
      {
        id: "personal",
        title: "Personal Details",
        description: "Two-column grid of FormFields inside a bordered section.",
        wide: true,
        code: `import { FormField, FormSection } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"

export function Demo() {
  return (
    <FormSection
      title="Personal Details"
      description="Basic information shown on your matrimonial profile."
      columns={2}
      className="w-full max-w-2xl rounded-xl border p-6"
    >
      <FormField label="Full name" htmlFor="ps-name" required>
        <Input id="ps-name" defaultValue="Ananya Sharma" />
      </FormField>
      <FormField label="Date of birth" htmlFor="ps-dob" required>
        <Input id="ps-dob" placeholder="DD / MM / YYYY" />
      </FormField>
      <FormField label="Mobile number" htmlFor="ps-phone">
        <Input id="ps-phone" defaultValue="+91 98200 12345" inputMode="tel" />
      </FormField>
      <FormField label="City" htmlFor="ps-city" hint="Used to find nearby matches.">
        <Input id="ps-city" defaultValue="Pune" />
      </FormField>
    </FormSection>
  )
}`,
        render: () => (
          <FormSection
            title="Personal Details"
            description="Basic information shown on your matrimonial profile."
            columns={2}
            className="w-full max-w-2xl rounded-xl border bg-card p-6"
          >
            <FormField label="Full name" htmlFor="ps-name" required>
              <Input id="ps-name" defaultValue="Ananya Sharma" />
            </FormField>
            <FormField label="Date of birth" htmlFor="ps-dob" required>
              <Input id="ps-dob" placeholder="DD / MM / YYYY" />
            </FormField>
            <FormField label="Mobile number" htmlFor="ps-phone">
              <Input id="ps-phone" defaultValue="+91 98200 12345" inputMode="tel" />
            </FormField>
            <FormField label="City" htmlFor="ps-city" hint="Used to find nearby matches.">
              <Input id="ps-city" defaultValue="Pune" />
            </FormField>
          </FormSection>
        ),
      },
    ],
    props: [
      { name: "title", type: "React.ReactNode", description: "Section heading in the serif display face." },
      { name: "description", type: "React.ReactNode", description: "Secondary line under the title." },
      { name: "columns", type: "1 | 2 | 3 | 4", default: "2", description: "Responsive column count for the children grid." },
      { name: "className", type: "string", description: "E.g. rounded-xl border p-6 for a card look." },
    ],
  },
  {
    id: "field-error",
    name: "FieldError",
    category: "forms",
    description:
      "Small destructive validation message with an alert icon — renders nothing when empty.",
    aliases: [],
    demos: [
      {
        id: "inline",
        title: "Inline message",
        description: "Used directly under any control.",
        code: `import { FieldError } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Demo() {
  return (
    <div className="w-full max-w-sm space-y-1.5">
      <Label htmlFor="fe-phone">Phone number</Label>
      <Input id="fe-phone" defaultValue="+91 12345" error />
      <FieldError>Please enter a valid 10-digit Indian mobile number.</FieldError>
    </div>
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="fe-phone">Phone number</Label>
            <Input id="fe-phone" defaultValue="+91 12345" error />
            <FieldError>Please enter a valid 10-digit Indian mobile number.</FieldError>
          </div>
        ),
      },
    ],
    props: [
      { name: "children", type: "React.ReactNode", description: "Message text; nothing renders when empty." },
      { name: "className", type: "string", description: "Merged onto the message paragraph." },
    ],
  },
]
