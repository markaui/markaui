"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Separator } from "@/components/ui/separator"
import { Price, QuantitySelector, formatPrice } from "@/components/ui/price"

export interface CartItemProps extends React.ComponentProps<"div"> {
  image: string
  name: string
  /** Small line under the name, e.g. "Crimson · With blouse piece" */
  variant?: string
  /** Unit price */
  price: number
  /** Controlled quantity */
  quantity?: number
  onQuantityChange?: (quantity: number) => void
  /** When provided, a remove button is rendered */
  onRemove?: () => void
  currency?: string
}

function CartItem({
  image,
  name,
  variant,
  price,
  quantity,
  onQuantityChange,
  onRemove,
  currency = "₹",
  className,
  ...props
}: CartItemProps) {
  const [internalQuantity, setInternalQuantity] = React.useState(quantity ?? 1)
  const qty = quantity ?? internalQuantity
  const lineTotal = price * qty

  const handleQuantityChange = (next: number) => {
    if (quantity === undefined) setInternalQuantity(next)
    onQuantityChange?.(next)
  }

  return (
    <div
      data-slot="cart-item"
      className={cn(
        "flex items-start gap-4 rounded-xl border border-border bg-card p-4",
        className
      )}
      {...props}
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="size-20 shrink-0 rounded-lg object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-sm font-medium text-foreground">
              {name}
            </h3>
            {variant ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{variant}</p>
            ) : null}
          </div>
          {onRemove ? (
            <IconButton
              type="button"
              aria-label={"Remove " + name}
              variant="ghost"
              size="xs"
              onClick={onRemove}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <X />
            </IconButton>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector
            size="sm"
            value={qty}
            onChange={handleQuantityChange}
          />
          <div className="text-right">
            <Price value={lineTotal} currency={currency} size="sm" />
            {qty > 1 ? (
              <p className="text-xs text-muted-foreground tabular-nums">
                {currency}
                {formatPrice(price)} each
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

export interface CartSummaryProps extends React.ComponentProps<"div"> {
  subtotal: number
  discount?: number
  /** Delivery fee; 0 renders as "Free" */
  delivery?: number
  /** Optional slot between the rows and the total, e.g. a promo code input */
  promo?: React.ReactNode
  checkoutLabel?: string
  onCheckout?: () => void
  currency?: string
}

function CartSummary({
  subtotal,
  discount = 0,
  delivery = 0,
  promo,
  checkoutLabel = "Proceed to Checkout",
  onCheckout,
  currency = "₹",
  className,
  ...props
}: CartSummaryProps) {
  const total = Math.max(subtotal - discount + delivery, 0)

  return (
    <div
      data-slot="cart-summary"
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
        className
      )}
      {...props}
    >
      <h3 className="font-serif text-lg font-semibold text-foreground">
        Order Summary
      </h3>
      <div className="flex flex-col gap-2.5 text-sm">
        <SummaryRow label="Subtotal" value={currency + formatPrice(subtotal)} />
        {discount > 0 ? (
          <SummaryRow
            label="Discount"
            value={"−" + currency + formatPrice(discount)}
            className="text-success [&>span]:text-success"
          />
        ) : null}
        <SummaryRow
          label="Delivery"
          value={
            delivery === 0
              ? "Free"
              : currency + formatPrice(delivery)
          }
          className={delivery === 0 ? "[&>span:last-child]:text-success" : undefined}
        />
      </div>
      {promo}
      <Separator />
      <div className="flex items-center justify-between gap-4">
        <span className="font-serif text-base font-semibold text-foreground">
          Total
        </span>
        <span className="font-serif text-xl font-bold text-foreground tabular-nums">
          {currency}
          {formatPrice(total)}
        </span>
      </div>
      <Button variant="gold" size="lg" fullWidth onClick={onCheckout}>
        {checkoutLabel}
      </Button>
    </div>
  )
}

export { CartItem, CartSummary }
