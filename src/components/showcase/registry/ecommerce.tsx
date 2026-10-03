"use client"

import * as React from "react"

import type { ComponentDoc } from "./types"
import {
  ProductCard,
  ProductCarousel,
  ProductGallery,
  ProductGrid,
  type ProductCardProps,
} from "@/components/ui/product"
import { Price, PriceRange, QuantitySelector } from "@/components/ui/price"
import { CartItem, CartSummary } from "@/components/ui/cart"
import { CheckoutForm } from "@/components/ui/checkout-form"
import {
  OrderStatus,
  OrderTimeline,
  type OrderStatusValue,
} from "@/components/ui/order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FEATURED_PRODUCTS: ProductCardProps[] = [
  {
    image: "/images/profile-3.png",
    name: "Kanchipuram Silk Saree",
    category: "Bridal Sarees",
    price: 24999,
    originalPrice: 31999,
    rating: 4.8,
    reviewCount: 214,
    badge: "New",
  },
  {
    image: "/images/profile-5.png",
    name: "Banarasi Georgette Saree",
    category: "Festive Wear",
    price: 12499,
    rating: 4.6,
    reviewCount: 98,
  },
]

const GRID_PRODUCTS: ProductCardProps[] = [
  {
    image: "/images/profile-1.png",
    name: "Chanderi Silk Saree",
    category: "Everyday Elegance",
    price: 8999,
    rating: 4.5,
    reviewCount: 132,
  },
  {
    image: "/images/profile-2.png",
    name: "Bandhani Silk Dupatta",
    category: "Accessories",
    price: 3499,
    originalPrice: 4299,
    rating: 4.7,
    reviewCount: 76,
    badge: "Bestseller",
  },
  {
    image: "/images/profile-4.png",
    name: "Zardozi Bridal Lehenga",
    category: "Bridal Couture",
    price: 48999,
    originalPrice: 56999,
    rating: 4.9,
    reviewCount: 51,
  },
  {
    image: "/images/profile-6.png",
    name: "Chikankari Anarkali",
    category: "Festive Wear",
    price: 15999,
    rating: 4.6,
    reviewCount: 89,
  },
]

const CAROUSEL_PRODUCTS: ProductCardProps[] = [
  FEATURED_PRODUCTS[0],
  GRID_PRODUCTS[0],
  FEATURED_PRODUCTS[1],
  GRID_PRODUCTS[2],
  {
    image: "/images/profile-6.png",
    name: "Kota Doria Kurta Set",
    category: "Everyday Elegance",
    price: 5499,
    rating: 4.4,
    reviewCount: 143,
  },
]

const GALLERY_IMAGES = [
  { src: "/images/profile-1.png", alt: "Ivory drape, full look" },
  { src: "/images/profile-2.png", alt: "Gold zari border detail" },
  { src: "/images/profile-4.png", alt: "Pleated pallu styling" },
]

const CART_SEED = [
  {
    id: "saree",
    image: "/images/profile-5.png",
    name: "Banarasi Georgette Saree",
    variant: "Rani Pink · Unstitched blouse",
    price: 12499,
    qty: 1,
  },
  {
    id: "dupatta",
    image: "/images/profile-2.png",
    name: "Bandhani Silk Dupatta",
    variant: "Gujarati tie-dye · Gold foil",
    price: 3499,
    qty: 2,
  },
]

const STATUS_FLOW: OrderStatusValue[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]

function ProductCardDemo() {
  const [wishlistedName, setWishlistedName] = React.useState<string | null>(null)
  const [action, setAction] = React.useState(
    "Tap the heart or Add to Cart — state updates live."
  )
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard
            key={product.name}
            {...product}
            wishlisted={wishlistedName === product.name}
            onWishlist={(next) => {
              setWishlistedName(next ? product.name : null)
              setAction(
                (next ? "Saved " : "Removed ") +
                  product.name +
                  (next ? " to wishlist" : " from wishlist")
              )
            }}
            onAdd={() => setAction("Added " + product.name + " to cart")}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{action}</p>
    </div>
  )
}

function ProductGridDemo() {
  const [wishlist, setWishlist] = React.useState<string[]>([])
  const toggleWishlist = (name: string, next: boolean) =>
    setWishlist((prev) =>
      next ? [...prev, name] : prev.filter((item) => item !== name)
    )
  return (
    <ProductGrid className="w-full max-w-4xl">
      {GRID_PRODUCTS.map((product) => (
        <ProductCard
          key={product.name}
          {...product}
          wishlisted={wishlist.includes(product.name)}
          onWishlist={(next) => toggleWishlist(product.name, next)}
        />
      ))}
    </ProductGrid>
  )
}

function QuantitySelectorDemo() {
  const [qty, setQty] = React.useState(3)
  return (
    <div className="flex flex-col items-center gap-3">
      <QuantitySelector value={qty} onChange={setQty} min={1} max={8} />
      <p className="text-xs text-muted-foreground">
        Selected: {qty} · max 8 per order
      </p>
    </div>
  )
}

function CartItemsDemo() {
  const [items, setItems] = React.useState(CART_SEED)
  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    )
  const remove = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id))

  if (items.length === 0) {
    return (
      <div className="flex w-full max-w-xl items-center justify-between gap-4 rounded-xl border border-dashed border-border p-4">
        <p className="text-sm text-muted-foreground">
          Your cart is empty — everything was removed.
        </p>
        <Button variant="outline" size="sm" onClick={() => setItems(CART_SEED)}>
          Restore items
        </Button>
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-xl gap-3">
      {items.map((item) => (
        <CartItem
          key={item.id}
          image={item.image}
          name={item.name}
          variant={item.variant}
          price={item.price}
          quantity={item.qty}
          onQuantityChange={(qty) => setQty(item.id, qty)}
          onRemove={() => remove(item.id)}
        />
      ))}
    </div>
  )
}

function CartSummaryDemo() {
  const [promoApplied, setPromoApplied] = React.useState(false)
  const discount = promoApplied ? 2500 : 0
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <CartSummary
        subtotal={15998}
        discount={discount}
        delivery={0}
        promo={
          <div className="flex gap-2">
            <Input placeholder="Promo code" defaultValue="SAPTAPADI" className="h-9" />
            <Button variant="outline" onClick={() => setPromoApplied((v) => !v)}>
              {promoApplied ? "Remove" : "Apply"}
            </Button>
          </div>
        }
        onCheckout={() => setPromoApplied(true)}
      />
      <p className="text-center text-xs text-muted-foreground">
        {promoApplied
          ? "SAPTAPADI applied — ₹2,500 off"
          : "Try applying the promo code SAPTAPADI"}
      </p>
    </div>
  )
}

function OrderStatusDemo() {
  const [index, setIndex] = React.useState(0)
  const status = STATUS_FLOW[index]
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <OrderStatus
        status={status}
        orderId="SAP-2026-000418"
        estimatedDate="Fri, 14 Feb"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Current status: {status}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => (i + 1) % STATUS_FLOW.length)}
        >
          Cycle status
        </Button>
      </div>
    </div>
  )
}

export const ecommerceDocs: ComponentDoc[] = [
  {
    id: "product-card",
    name: "ProductCard",
    category: "ecommerce",
    description:
      "Luxury product card with hover-zoom image, wishlist heart, badge, price with strikethrough, rating row and a gold Add to Cart button.",
    demos: [
      {
        id: "featured",
        title: "Featured products",
        description: "Two cards sharing wishlist and cart state via callbacks.",
        code: `import { ProductCard } from "@/components/ui/product"

<ProductCard
  image="/images/profile-3.png"
  name="Kanchipuram Silk Saree"
  category="Bridal Sarees"
  price={24999}
  originalPrice={31999}
  rating={4.8}
  reviewCount={214}
  badge="New"
  wishlisted={false}
  onAdd={() => addToCart()}
  onWishlist={(next) => toggleWishlist(next)}
/>`,
        render: () => <ProductCardDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "image", type: "string", description: "Product photo (4:5 crop, hover zoom)." },
      { name: "name", type: "string", description: "Serif product title." },
      { name: "category", type: "string", description: "Small uppercase subtitle." },
      { name: "price", type: "number", description: "Final price." },
      { name: "originalPrice", type: "number", description: "Struck-through MRP shown when higher." },
      { name: "rating", type: "number", description: "Star rating out of 5." },
      { name: "reviewCount", type: "number", description: "Number of reviews." },
      { name: "badge", type: "string", description: "Gold badge text, top-left." },
      { name: "wishlisted", type: "boolean", description: "Controlled wishlist state." },
      { name: "onWishlist", type: "(wishlisted: boolean) => void", description: "Called with the next state." },
      { name: "onAdd", type: "() => void", description: "Add to Cart click handler." },
    ],
  },
  {
    id: "product-grid",
    name: "ProductGrid",
    category: "ecommerce",
    description:
      "Responsive product grid — 2 columns on mobile, 3 on tablet, 4 on desktop.",
    demos: [
      {
        id: "collection",
        title: "Collection grid",
        description: "Four products with per-card wishlist state.",
        code: `import { ProductGrid, ProductCard } from "@/components/ui/product"

<ProductGrid>
  {products.map((product) => (
    <ProductCard key={product.name} {...product} />
  ))}
</ProductGrid>`,
        render: () => <ProductGridDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "children", type: "ReactNode", description: "ProductCard elements." },
      { name: "className", type: "string", description: "Override the default column template." },
    ],
  },
  {
    id: "product-gallery",
    name: "ProductGallery",
    category: "ecommerce",
    description:
      "Main product image with floating prev/next arrows and a thumbnail strip with a gold selection ring.",
    demos: [
      {
        id: "views",
        title: "Three views",
        description: "Arrows or thumbnails switch the featured shot.",
        code: `import { ProductGallery } from "@/components/ui/product"

<ProductGallery
  images={[
    { src: "/images/profile-1.png", alt: "Front drape" },
    { src: "/images/profile-2.png", alt: "Blouse detail" },
    { src: "/images/profile-4.png", alt: "Full look" },
  ]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <ProductGallery images={GALLERY_IMAGES} />
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      { name: "images", type: "{ src: string; alt?: string }[]", description: "Gallery shots." },
      { name: "defaultIndex", type: "number", default: "0", description: "Initially selected image." },
      { name: "className", type: "string", description: "Merged onto the wrapper." },
    ],
  },
  {
    id: "product-carousel",
    name: "ProductCarousel",
    category: "ecommerce",
    description:
      "Embla-powered horizontal rail of ProductCards with floating navigation arrows.",
    demos: [
      {
        id: "rail",
        title: "Curated rail",
        description: "Five products; drag or use the arrows.",
        code: `import { ProductCarousel } from "@/components/ui/product"

<ProductCarousel products={products} />`,
        render: () => (
          <div className="w-full">
            <ProductCarousel products={CAROUSEL_PRODUCTS} />
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      { name: "products", type: "ProductCardProps[]", description: "Cards rendered as slides." },
      { name: "className", type: "string", description: "Merged onto the wrapper." },
    ],
  },
  {
    id: "price",
    name: "Price",
    category: "ecommerce",
    description:
      "Indian-locale price with a smaller currency glyph and optional struck-through original amount.",
    aliases: ["Amount"],
    demos: [
      {
        id: "sizes",
        title: "Sizes & strike",
        code: `import { Price } from "@/components/ui/price"

<Price value={24999} original={31999} size="lg" />
<Price value={12499} />
<Price value={3499} size="sm" />`,
        render: () => (
          <div className="flex flex-col items-start gap-4">
            <Price value={24999} original={31999} size="lg" />
            <Price value={12499} />
            <Price value={3499} size="sm" />
          </div>
        ),
      },
    ],
    props: [
      { name: "value", type: "number", description: "Final price." },
      { name: "original", type: "number", description: "Struck-through original price." },
      { name: "currency", type: "string", default: '"₹"', description: "Currency glyph." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Type scale." },
    ],
  },
  {
    id: "price-range",
    name: "PriceRange",
    category: "ecommerce",
    description: "Elegant min–max price span for filters and collection headers.",
    demos: [
      {
        id: "filters",
        title: "Filter ranges",
        code: `import { PriceRange } from "@/components/ui/price"

<PriceRange min={12999} max={39999} size="lg" />
<PriceRange min={999} max={4999} size="sm" />`,
        render: () => (
          <div className="flex flex-col items-start gap-4">
            <PriceRange min={12999} max={39999} size="lg" />
            <PriceRange min={999} max={4999} size="sm" />
          </div>
        ),
      },
    ],
    props: [
      { name: "min", type: "number", description: "Lower bound." },
      { name: "max", type: "number", description: "Upper bound." },
      { name: "currency", type: "string", default: '"₹"', description: "Currency glyph." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Type scale." },
    ],
  },
  {
    id: "quantity-selector",
    name: "QuantitySelector",
    category: "ecommerce",
    description:
      "Pill-shaped stepper with Minus/Plus icon buttons; edges disable at min/max. Controlled or uncontrolled.",
    aliases: ["QuantityInput"],
    demos: [
      {
        id: "stepper",
        title: "Stepper",
        description: "Min 1, max 8 — buttons disable at the edges.",
        code: `import { QuantitySelector } from "@/components/ui/price"

<QuantitySelector
  value={qty}
  onChange={setQty}
  min={1}
  max={8}
/>`,
        render: () => <QuantitySelectorDemo />,
      },
    ],
    props: [
      { name: "value", type: "number", description: "Controlled quantity." },
      { name: "defaultValue", type: "number", default: "1", description: "Uncontrolled initial value." },
      { name: "onChange", type: "(value: number) => void", description: "Change callback (clamped)." },
      { name: "min", type: "number", default: "1", description: "Lower bound." },
      { name: "max", type: "number", default: "99", description: "Upper bound." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Control sizing." },
    ],
  },
  {
    id: "cart-item",
    name: "CartItem",
    category: "ecommerce",
    description:
      "Cart line with thumbnail, serif name, variant, QuantitySelector, remove button and a live line total.",
    demos: [
      {
        id: "stacked",
        title: "Two lines",
        description: "Quantities update the line totals; removal shows the empty state.",
        code: `import { CartItem } from "@/components/ui/cart"

<CartItem
  image="/images/profile-5.png"
  name="Banarasi Georgette Saree"
  variant="Rani Pink · Unstitched blouse"
  price={12499}
  quantity={qty}
  onQuantityChange={setQty}
  onRemove={() => removeItem()}
/>`,
        render: () => <CartItemsDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "image", type: "string", description: "Square thumbnail." },
      { name: "name", type: "string", description: "Product title." },
      { name: "variant", type: "string", description: "Colour / size line." },
      { name: "price", type: "number", description: "Unit price." },
      { name: "quantity", type: "number", description: "Controlled quantity." },
      { name: "onQuantityChange", type: "(quantity: number) => void", description: "Quantity callback." },
      { name: "onRemove", type: "() => void", description: "Renders the X button when set." },
      { name: "currency", type: "string", default: '"₹"', description: "Currency glyph." },
    ],
  },
  {
    id: "cart-summary",
    name: "CartSummary",
    category: "ecommerce",
    description:
      "Order summary card with subtotal, green discount and delivery rows, a promo slot, serif total and a gold checkout CTA.",
    aliases: ["OrderSummary"],
    demos: [
      {
        id: "promo",
        title: "With promo slot",
        description: "Apply the code SAPTAPADI to see the discount row turn on.",
        code: `import { CartSummary } from "@/components/ui/cart"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

<CartSummary
  subtotal={15998}
  discount={2500}
  delivery={0}
  promo={
    <div className="flex gap-2">
      <Input placeholder="Promo code" />
      <Button variant="outline">Apply</Button>
    </div>
  }
  onCheckout={() => startCheckout()}
/>`,
        render: () => <CartSummaryDemo />,
      },
    ],
    props: [
      { name: "subtotal", type: "number", description: "Sum of line totals." },
      { name: "discount", type: "number", default: "0", description: "Shown green with a minus sign." },
      { name: "delivery", type: "number", default: "0", description: "0 renders as Free." },
      { name: "promo", type: "ReactNode", description: "Slot above the divider, e.g. a promo input." },
      { name: "checkoutLabel", type: "string", default: '"Proceed to Checkout"', description: "CTA text." },
      { name: "onCheckout", type: "() => void", description: "CTA click handler." },
      { name: "currency", type: "string", default: '"₹"', description: "Currency glyph." },
    ],
  },
  {
    id: "checkout-form",
    name: "CheckoutForm",
    category: "ecommerce",
    description:
      "Two-column checkout with contact, delivery and radio-card payment sections plus a simulated place-order flow ending in a success state.",
    demos: [
      {
        id: "full",
        title: "Full form",
        description: "Fill it in and place an order — the success state shows a generated order id.",
        code: `import { CheckoutForm } from "@/components/ui/checkout-form"

<CheckoutForm
  className="mx-auto w-full max-w-3xl"
  onOrderPlaced={(orderId) => console.log(orderId)}
/>`,
        render: () => <CheckoutForm className="mx-auto w-full max-w-3xl" />,
        wide: true,
      },
    ],
    props: [
      {
        name: "onOrderPlaced",
        type: "(orderId: string) => void",
        description: "Called after the simulated placement resolves.",
      },
      { name: "className", type: "string", description: "Merged onto the form grid." },
    ],
  },
  {
    id: "order-status",
    name: "OrderStatus",
    category: "ecommerce",
    description:
      "Status banner with tone-coloured icon, label, order id, estimated date and a segmented stepper progress bar.",
    aliases: ["OrderTracker"],
    demos: [
      {
        id: "cycle",
        title: "Status cycle",
        description: "Cycle through pending → delivered — plus the cancelled state.",
        code: `import { OrderStatus } from "@/components/ui/order"

<OrderStatus
  status="shipped"
  orderId="SAP-2026-000418"
  estimatedDate="Fri, 14 Feb"
/>`,
        render: () => <OrderStatusDemo />,
        wide: true,
      },
    ],
    props: [
      {
        name: "status",
        type: '"pending" | "processing" | "shipped" | "delivered" | "cancelled"',
        description: "Drives icon, tone, label and progress.",
      },
      { name: "orderId", type: "string", description: "Monospace id under the label." },
      { name: "estimatedDate", type: "string", description: "Human formatted date, e.g. Fri, 14 Feb." },
      { name: "className", type: "string", description: "Merged onto the card." },
    ],
  },
  {
    id: "order-timeline",
    name: "OrderTimeline",
    category: "ecommerce",
    description:
      "Vertical milestone list with done/current/upcoming markers, times and an optional items summary per step.",
    demos: [
      {
        id: "journey",
        title: "Order journey",
        description: "Two steps done, shipment currently in transit.",
        code: `import { OrderTimeline } from "@/components/ui/order"

<OrderTimeline
  current={2}
  steps={[
    {
      title: "Order confirmed",
      time: "10 Feb, 9:12 AM",
      items: [{ name: "Kanchipuram Silk Saree", quantity: 1, price: 24999 }],
    },
    { title: "Quality checked", time: "12 Feb, 4:40 PM" },
    { title: "Shipped", description: "In transit with BlueDart.", time: "13 Feb, 11:05 AM" },
    { title: "Out for delivery", time: "Est. 14 Feb" },
    { title: "Delivered", time: "Est. 14 Feb" },
  ]}
/>`,
        render: () => (
          <OrderTimeline
            className="w-full max-w-xl"
            current={2}
            steps={[
              {
                title: "Order confirmed",
                description: "We received your order and payment.",
                time: "10 Feb, 9:12 AM",
                items: [
                  { name: "Kanchipuram Silk Saree", quantity: 1, price: 24999 },
                  { name: "Bandhani Silk Dupatta", quantity: 2, price: 3499 },
                ],
              },
              {
                title: "Crafted & quality checked",
                description: "Passed our 12-point weave inspection.",
                time: "12 Feb, 4:40 PM",
              },
              {
                title: "Shipped",
                description: "In transit with BlueDart — tracking SADB1234567.",
                time: "13 Feb, 11:05 AM",
              },
              { title: "Out for delivery", time: "Est. 14 Feb" },
              { title: "Delivered", time: "Est. 14 Feb" },
            ]}
          />
        ),
        wide: true,
      },
    ],
    props: [
      { name: "steps", type: "TimelineStep[]", description: "Milestones with title, time, description, items." },
      { name: "current", type: "number", default: "0", description: "Index of the in-progress step." },
      { name: "currency", type: "string", default: '"₹"', description: "Currency glyph for item rows." },
      { name: "className", type: "string", description: "Merged onto the ol element." },
    ],
  },
]
