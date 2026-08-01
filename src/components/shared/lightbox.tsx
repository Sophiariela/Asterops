"use client";

import * as React from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProductExample } from "@/types";

interface LightboxProps {
  items: ProductExample[];
  index: number;
  onIndexChange: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Lightbox({ items, index, onIndexChange, open, onOpenChange }: LightboxProps) {
  const current = items[index];
  const hasMultiple = items.length > 1;

  const goPrev = React.useCallback(() => {
    onIndexChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onIndexChange]);

  const goNext = React.useCallback(() => {
    onIndexChange((index + 1) % items.length);
  }, [index, items.length, onIndexChange]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext],
  );

  if (!current) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 p-4 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:p-10"
        >
          <DialogPrimitive.Close
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent sm:right-8 sm:top-8"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous example"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:border-accent/40 hover:text-accent sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next example"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:border-accent/40 hover:text-accent sm:right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <div className="relative flex max-h-[70vh] w-full max-w-4xl items-center justify-center">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-card">
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex w-full max-w-4xl flex-col gap-1 text-center">
            <DialogPrimitive.Title className="text-base font-medium text-foreground">
              {current.title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              {current.description}
            </DialogPrimitive.Description>
            {hasMultiple ? (
              <span className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {index + 1} / {items.length}
              </span>
            ) : null}
          </div>

          {hasMultiple ? (
            <div className="flex items-center gap-2">
              {items.map((item, i) => (
                <button
                  key={item.image}
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`Go to example ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted-foreground",
                  )}
                />
              ))}
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
