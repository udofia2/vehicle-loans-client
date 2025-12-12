"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Car, FileText, DollarSign, Handshake, Home } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Vehicles", href: "/dashboard/vehicles", icon: Car },
  { name: "Valuations", href: "/dashboard/valuations", icon: DollarSign },
  { name: "Loan Applications", href: "/dashboard/loans", icon: FileText },
  { name: "Offers", href: "/dashboard/offers", icon: Handshake },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              AutoCheck
            </Link>
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
