"use client";

import * as React from "react";
import { BadgeCheck, CreditCard, Gem, Lock, PartyPopper, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Stepper } from "@/components/ui/stepper";
import { useAuth } from "./auth-provider";
import { postOrder, useOrders } from "./orders-provider";

export interface PlanCheckoutProps {
  plan: string | null;
  price: string;
  onOpenChange: (open: boolean) => void;
}

const CHECKOUT_STEPS = [
  { id: "details", title: "Your details" },
  { id: "payment", title: "Payment" },
  { id: "done", title: "Welcome aboard" },
];

const CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Pune",
  "Jaipur",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Other",
];

const PLAN_PERKS: Record<string, string[]> = {
  Silver: ["Detailed profile", "Browse 10 lakh+ members", "5 interests / month"],
  Gold: [
    "Unlimited interests & chats",
    "AI match scores",
    "Kundli reports",
    "Dedicated relationship advisor",
  ],
  Diamond: [
    "Everything in Gold",
    "Personal matchmaker concierge",
    "Weekly hand-curated shortlists",
    "Background verification",
  ],
};

export function PlanCheckout({ plan, price, onOpenChange }: PlanCheckoutProps) {
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [details, setDetails] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
  });
  const [card, setCard] = React.useState({ number: "", expiry: "", cvv: "", name: "" });
  const { member } = useAuth();
  const { refresh: refreshOrders } = useOrders();

  React.useEffect(() => {
    if (plan) {
      setStep(0);
      setOrderId(null);
      setSubmitting(false);
      // Prefill from the signed-in member so checkout feels personalised.
      setDetails((d) =>
        member
          ? {
              fullName: d.fullName || member.name,
              email: d.email || member.email,
              phone: d.phone,
              city: d.city || member.city || "",
            }
          : d
      );
    }
  }, [plan]);

  if (!plan) return null;

  const detailsValid =
    details.fullName.trim().length >= 3 &&
    /.+@.+\..+/.test(details.email) &&
    /^[6-9]\d{9}$/.test(details.phone.replace(/\s/g, "")) &&
    details.city !== "";

  const cardValid =
    card.number.replace(/\s/g, "").length >= 15 &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    card.cvv.length >= 3;

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const pay = async () => {
    setSubmitting(true);
    const result = await postOrder({ plan: plan!, ...details, amount: price });
    setOrderId(result.orderId);
    setStep(2);
    setSubmitting(false);
    // Dashboard / navbar counts should reflect the new membership immediately.
    void refreshOrders();
  };

  const perkList = PLAN_PERKS[plan] ?? [];

  return (
    <Modal
      open={Boolean(plan)}
      onOpenChange={onOpenChange}
      title={`${plan} membership`}
      description="Seven steps, one forever — you're moments away."
    >
      <ModalBody className="space-y-6">
        <Stepper steps={CHECKOUT_STEPS} current={step} size="sm" />

        {/* Step 1 — details */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-gold/10 p-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gold/20 text-gold">
                <Gem className="size-5" />
              </span>
              <div className="flex-1">
                <p className="font-serif text-base font-bold text-foreground">{plan} plan</p>
                <p className="text-xs text-muted-foreground">
                  {price} {price === "Free" ? "forever" : "per month"} · cancel anytime
                </p>
              </div>
              <p className="font-serif text-xl font-bold text-foreground">{price}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="checkout-name">Full name</Label>
                <Input
                  id="checkout-name"
                  value={details.fullName}
                  onChange={(e) => setDetails((d) => ({ ...d, fullName: e.target.value }))}
                  placeholder="e.g. Noah Bennett"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="checkout-email">Email</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="checkout-phone">Mobile (10-digit)</Label>
                <Input
                  id="checkout-phone"
                  inputMode="numeric"
                  value={details.phone}
                  onChange={(e) =>
                    setDetails((d) => ({
                      ...d,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  placeholder="98765 43210"
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>City</Label>
                <Select
                  value={details.city}
                  onValueChange={(city) => setDetails((d) => ({ ...d, city }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — payment */}
        {step === 1 && (
          <div className="space-y-4">
            <Callout variant="info" icon={<Lock className="size-4" />}>
              This is a demo checkout — no real payment is processed and nothing is charged.
            </Callout>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input
                  id="card-number"
                  inputMode="numeric"
                  value={card.number}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))
                  }
                  placeholder="4242 4242 4242 4242"
                  autoComplete="cc-number"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="card-expiry">Expiry (MM/YY)</Label>
                <Input
                  id="card-expiry"
                  inputMode="numeric"
                  value={card.expiry}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))
                  }
                  placeholder="08/28"
                  autoComplete="cc-exp"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="card-cvv">CVV</Label>
                <PasswordInput
                  id="card-cvv"
                  inputMode="numeric"
                  value={card.cvv}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))
                  }
                  placeholder="•••"
                  autoComplete="cc-csc"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="card-name">Name on card</Label>
                <Input
                  id="card-name"
                  value={card.name}
                  onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                  placeholder="As printed on the card"
                  autoComplete="cc-name"
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{plan} membership</span>
                <span>{price === "Free" ? "₹0" : price}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18%)</span>
                <span>{price === "Free" ? "₹0" : "included"}</span>
              </div>
              <div className="flex justify-between font-serif text-base font-bold text-foreground">
                <span>Total due today</span>
                <span>{price === "Free" ? "₹0" : price}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — success */}
        {step === 2 && (
          <div className="space-y-5 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success ring-4 ring-success/20">
              <PartyPopper className="size-7" />
            </span>
            <div>
              <p className="font-serif text-2xl font-bold text-foreground">
                Welcome to {plan}, {details.fullName.split(" ")[0] || "friend"}!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your membership is active. A confirmation is on its way to {details.email}.
              </p>
            </div>
            <div className="mx-auto max-w-sm rounded-2xl border border-border bg-secondary/50 p-4 text-left">
              <p className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-semibold text-foreground">{orderId}</span>
              </p>
              <p className="mt-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold text-foreground">
                  {plan} · {price}
                </span>
              </p>
            </div>
            <ul className="mx-auto max-w-sm space-y-2 text-left">
              {perkList.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-sm text-foreground/90">
                  <BadgeCheck className="size-4 shrink-0 text-gold" />
                  {perk}
                </li>
              ))}
            </ul>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-gold" />
              7-day money-back promise · cancel anytime
            </p>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="gap-2 sm:justify-between">
        {step === 0 && (
          <>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Maybe later
            </Button>
            <Button variant="gold" disabled={!detailsValid} onClick={() => setStep(1)}>
              Continue to payment
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <Button variant="ghost" onClick={() => setStep(0)} disabled={submitting}>
              Back
            </Button>
            <Button
              variant="gold"
              disabled={!cardValid || submitting}
              onClick={pay}
              className="gap-2"
            >
              {submitting ? <Spinner className="size-4" /> : <CreditCard className="size-4" />}
              {price === "Free" ? "Activate free plan" : `Pay ${price}`}
            </Button>
          </>
        )}
        {step === 2 && (
          <Button variant="gold" fullWidth onClick={() => onOpenChange(false)}>
            Start exploring matches
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
