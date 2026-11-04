"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductCardProps {
  invocation: ProductDetailsToolInvocation;
}

export function AgentProductCard({ invocation }: AgentProductCardProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    const id = invocation.input?.productId;
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Looking up{id ? ` "${id}"` : ""}…
      </div>
    );
  }

  if (invocation.state === "output-error") {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {invocation.errorText}
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;

  if (!output) return null;

  if (output.error !== undefined) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  const product = output;
  const [image, ...moreImages] = product.images;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {image && (
        <div className="relative aspect-4/3 bg-secondary">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      {moreImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pt-3">
          {moreImages.map((src, i) => (
            <div
              key={src}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-secondary"
            >
              <Image
                src={src}
                alt={`${product.name} image ${i + 2}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
          <StockBadge
            stock={product.stock}
            inStock={product.inStock}
            lowStock={product.lowStock}
          />
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {product.description}
        </p>
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          View product →
        </Link>
      </div>
    </div>
  );
}

function StockBadge({
  stock,
  inStock,
  lowStock,
}: {
  stock: number;
  inStock: boolean;
  lowStock: boolean;
}) {
  if (!inStock) {
    return (
      <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        Out of stock
      </span>
    );
  }

  if (lowStock) {
    return (
      <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        Only {stock} left
      </span>
    );
  }

  return (
    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
      In stock
    </span>
  );
}
