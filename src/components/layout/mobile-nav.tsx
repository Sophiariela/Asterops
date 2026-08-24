"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { clientLoginNav, headerCta, headerNav } from "@/config/navigation";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-8 sm:max-w-sm">
        <SheetTitle asChild>
          <Logo />
        </SheetTitle>
        <nav className="flex flex-col gap-6">
          {headerNav.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="text-lg font-medium text-foreground transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link
              href={clientLoginNav.href}
              className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {clientLoginNav.label}
            </Link>
          </SheetClose>
        </nav>
        <SheetClose asChild>
          <Button asChild size="lg" className="mt-auto w-full">
            <Link href={headerCta.href}>{headerCta.label}</Link>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
