"use client"

import * as React from "react"
import {
  CheckCircle2,
  CreditCard,
  Landmark,
  Mail,
  Phone,
  Smartphone,
  User,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type PaymentMethod = "upi" | "card" | "netbanking"

const CITIES = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi NCR" },
  { value: "bengaluru", label: "Bengaluru" },
  { value: "kolkata", label: "Kolkata" },
  { value: "chennai", label: "Chennai" },
  { value: "jaipur", label: "Jaipur" },
] as const

const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  description: string
  icon: LucideIcon
}[] = [
  {
    value: "upi",
    label: "UPI",
    description: "GPay, PhonePe, Paytm and more",
    icon: Smartphone,
  },
  {
    value: "card",
    label: "Card",
    description: "Credit or debit, all major networks",
    icon: CreditCard,
  },
  {
    value: "netbanking",
    label: "Netbanking",
    description: "All major Indian banks",
    icon: Landmark,
  },
]

export interface CheckoutFormProps
  extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  /** Called once the simulated order placement resolves, with the generated order id */
  onOrderPlaced?: (orderId: string) => void
}

function CheckoutForm({ onOrderPlaced, className, ...props }: CheckoutFormProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [city, setCity] = React.useState<string>("mumbai")
  const [pincode, setPincode] = React.useState("")
  const [payment, setPayment] = React.useState<PaymentMethod>("upi")
  const [submitting, setSubmitting] = React.useState(false)
  const [orderId, setOrderId] = React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    window.setTimeout(() => {
      const generatedId =
        "SAP-" + new Date().getFullYear() + "-" + String(Date.now() % 1000000).padStart(6, "0")
      setOrderId(generatedId)
      setSubmitting(false)
      onOrderPlaced?.(generatedId)
    }, 1600)
  }

  if (orderId) {
    const greeting = name.trim() ? name.trim().split(" ")[0] : "there"
    return (
      <div
        data-slot="checkout-success"
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card px-6 py-16 text-center",
          className
        )}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-foreground">
          Order placed, {greeting}!
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you for shopping with Saptapadi{email.trim() ? ". A receipt is on its way to " + email.trim() : ""}. Your heirloom pieces will be crafted and dispatched within 5–7 days.
        </p>
        <p className="rounded-lg bg-muted px-4 py-2 font-mono text-sm text-foreground">
          Order ID: {orderId}
        </p>
        <Button variant="outline" onClick={() => setOrderId(null)}>
          Place another order
        </Button>
      </div>
    )
  }

  return (
    <form
      data-slot="checkout-form"
      onSubmit={handleSubmit}
      className={cn("@container grid gap-6 @3xl:grid-cols-2", className)}
      {...props}
    >
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-semibold text-foreground">Contact</h3>
          <p className="text-xs text-muted-foreground">
            Order updates will be sent here.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="checkout-name">Full name</Label>
          <Input
            id="checkout-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Emma Wilson"
            leadingIcon={<User />}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="checkout-email">Email</Label>
          <Input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="emma@example.com"
            leadingIcon={<Mail />}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="checkout-phone">Phone</Label>
          <Input
            id="checkout-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+91 98765 43210"
            leadingIcon={<Phone />}
            required
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-semibold text-foreground">Delivery</h3>
          <p className="text-xs text-muted-foreground">
            Insured, trackable shipping across India.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="checkout-address">Address</Label>
          <Textarea
            id="checkout-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Flat 12, Rose Villa, MG Road…"
            rows={3}
            required
          />
        </div>
        <div className="grid gap-4 @2xl:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="checkout-city">City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="checkout-city" className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="checkout-pincode">Pincode</Label>
            <Input
              id="checkout-pincode"
              value={pincode}
              onChange={(event) => setPincode(event.target.value)}
              inputMode="numeric"
              maxLength={6}
              placeholder="400001"
              required
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 @3xl:col-span-2">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-semibold text-foreground">Payment</h3>
          <p className="text-xs text-muted-foreground">
            All transactions are encrypted and secure.
          </p>
        </div>
        <RadioGroup
          value={payment}
          onValueChange={(value) => setPayment(value as PaymentMethod)}
          className="grid gap-3 @2xl:grid-cols-3"
        >
          {PAYMENT_METHODS.map((method) => {
            const selected = payment === method.value
            return (
              <Label
                key={method.value}
                htmlFor={"checkout-payment-" + method.value}
                className={cn(
                  "cursor-pointer flex-col items-start gap-3 rounded-lg border p-4 transition-all duration-200",
                  selected
                    ? "border-gold bg-gold/5 shadow-sm"
                    : "hover:bg-accent/50"
                )}
              >
                <span className="flex w-full items-center gap-2">
                  <RadioGroupItem
                    id={"checkout-payment-" + method.value}
                    value={method.value}
                  />
                  <method.icon className="size-4 text-gold" aria-hidden="true" />
                  <span className="text-sm font-medium">{method.label}</span>
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {method.description}
                </span>
              </Label>
            )
          })}
        </RadioGroup>
      </section>

      <div className="flex flex-col items-center gap-2 @3xl:col-span-2">
        <Button
          type="submit"
          variant="gold"
          size="xl"
          loading={submitting}
          loadingText="Placing order…"
          className="w-full max-w-xs"
        >
          Place Order
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo checkout — no real payment is processed.
        </p>
      </div>
    </form>
  )
}

export { CheckoutForm }
