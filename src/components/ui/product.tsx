"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Price } from "@/components/ui/price"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export interface ProductCardProps
  extends Omit<React.ComponentProps<"div">, "name"> {
  image: string
  name: string
  /** Small subtitle rendered above the name, e.g. the collection */
  category?: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  badge?: string
  onAdd?: () => void
  /** Receives the next wishlist state (true = saved) */
  onWishlist?: (wishlisted: boolean) => void
  /** Controlled wishlist state; falls back to internal state when omitted */
  wishlisted?: boolean
}

function ProductCard({
  image,
  name,
  category,
  price,
  originalPrice,
  rating,
  reviewCount,
  badge,
  onAdd,
  onWishlist,
  wishlisted,
  className,
  ...props
}: ProductCardProps) {
  const [internalWishlisted, setInternalWishlisted] = React.useState(
    wishlisted ?? false
  )
  const isWishlisted = wishlisted ?? internalWishlisted

  const handleWishlist = () => {
    const next = !isWishlisted
    if (wishlisted === undefined) setInternalWishlisted(next)
    onWishlist?.(next)
  }

  return (
    <div
      data-slot="product-card"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="aspect-[4/5] w-full rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badge ? (
          <Badge variant="gold" className="absolute top-3 left-3 shadow-sm">
            {badge}
          </Badge>
        ) : null}
        <IconButton
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          variant="ghost"
          size="sm"
          shape="circle"
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 bg-background/80 shadow-sm backdrop-blur-sm hover:bg-background",
            isWishlisted && "text-gold [&_svg]:fill-current"
          )}
        >
          <Heart />
        </IconButton>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {category ? (
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {category}
          </span>
        ) : null}
        <h3 className="font-serif text-base leading-snug font-medium text-foreground">
          {name}
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Price value={price} original={originalPrice} size="sm" />
          {typeof rating === "number" ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
              {rating.toFixed(1)}
              {typeof reviewCount === "number" ? (
                <span className="tabular-nums">({reviewCount})</span>
              ) : null}
            </span>
          ) : null}
        </div>
        <Button variant="gold" fullWidth className="mt-2" onClick={onAdd}>
          <ShoppingBag />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

export type ProductGridProps = React.ComponentProps<"div">

function ProductGrid({ className, ...props }: ProductGridProps) {
  return (
    <div
      data-slot="product-grid"
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
      {...props}
    />
  )
}

export interface GalleryImage {
  src: string
  alt?: string
}

export interface ProductGalleryProps extends React.ComponentProps<"div"> {
  images: GalleryImage[]
  /** Initially selected image index */
  defaultIndex?: number
}

function ProductGallery({
  images,
  defaultIndex = 0,
  className,
  ...props
}: ProductGalleryProps) {
  const [index, setIndex] = React.useState(defaultIndex)
  const count = images.length
  const safeIndex = Math.min(Math.max(index, 0), Math.max(count - 1, 0))

  if (count === 0) {
    return (
      <div
        data-slot="product-gallery"
        className={cn(
          "flex aspect-[4/5] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground",
          className
        )}
        {...props}
      >
        No images to display
      </div>
    )
  }

  const current = images[safeIndex]

  return (
    <div
      data-slot="product-gallery"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
        <img
          src={current.src}
          alt={current.alt ?? "Product image"}
          className="aspect-[4/5] w-full object-cover"
        />
        <IconButton
          type="button"
          aria-label="Previous image"
          variant="ghost"
          size="sm"
          shape="circle"
          onClick={() => setIndex((i) => (i - 1 + count) % count)}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-background/80 shadow-sm backdrop-blur-sm hover:bg-background"
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          type="button"
          aria-label="Next image"
          variant="ghost"
          size="sm"
          shape="circle"
          onClick={() => setIndex((i) => (i + 1) % count)}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-background/80 shadow-sm backdrop-blur-sm hover:bg-background"
        >
          <ChevronRight />
        </IconButton>
      </div>
      {count > 1 ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Product thumbnails">
          {images.map((image, i) => (
            <button
              type="button"
              key={image.src + "-" + i}
              aria-label={"View image " + (i + 1)}
              aria-current={i === safeIndex || undefined}
              onClick={() => setIndex(i)}
              className={cn(
                "size-16 cursor-pointer overflow-hidden rounded-lg transition-all duration-200",
                i === safeIndex
                  ? "ring-2 ring-gold ring-offset-2 ring-offset-background"
                  : "border border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={image.src}
                alt={image.alt ?? ""}
                loading="lazy"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export interface ProductCarouselProps extends React.ComponentProps<"div"> {
  products: ProductCardProps[]
}

function ProductCarousel({ products, className, ...props }: ProductCarouselProps) {
  return (
    <div
      data-slot="product-carousel"
      className={cn("w-full", className)}
      {...props}
    >
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {products.map((product, i) => (
            <CarouselItem
              key={product.name + "-" + i}
              className="basis-[80%] pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <ProductCard {...product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-background/90 shadow-md" />
        <CarouselNext className="right-2 bg-background/90 shadow-md" />
      </Carousel>
    </div>
  )
}

export { ProductCard, ProductGrid, ProductGallery, ProductCarousel }
