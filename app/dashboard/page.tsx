"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyVehicles } from "@/hooks/use-vehicle";
import { useMyValuations } from "@/hooks/use-valuation";
import { useMyLoans } from "@/hooks/use-loan";
import { useMyOffers } from "@/hooks/use-offer";
import { Car, DollarSign, FileText, Handshake, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: vehiclesData } = useMyVehicles({ limit: 10 });
  const { data: valuationsData } = useMyValuations({ limit: 10 });
  const { data: loansData } = useMyLoans({ limit: 10 });
  const { data: offersData } = useMyOffers({ limit: 10 });

  const stats = [
    {
      title: "Total Vehicles",
      value: vehiclesData?.data?.data?.total || 0,
      description: "Vehicles in database",
      icon: Car,
      href: "/dashboard/vehicles",
    },
    {
      title: "Valuations",
      value: valuationsData?.data?.data?.total || 0,
      description: "Vehicle valuations",
      icon: DollarSign,
      href: "/dashboard/valuations",
    },
    {
      title: "Loan Applications",
      value: loansData?.data?.data?.total || 0,
      description: "Pending applications",
      icon: FileText,
      href: "/dashboard/loans",
    },
    {
      title: "Active Offers",
      value: offersData?.data?.data?.total || 0,
      description: "Current loan offers",
      icon: Handshake,
      href: "/dashboard/offers",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your vehicle loan application platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Link href={stat.href}>
                  <Button variant="outline" size="sm" className="mt-2">
                    View All
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you can perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/vehicles/new">
              <Button className="w-full">
                <Car className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </Link>
            <Link href="/dashboard/valuations/new">
              <Button variant="outline" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Create Valuation
              </Button>
            </Link>
            <Link href="/dashboard/loans/new">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                New Loan Application
              </Button>
            </Link>
            <Link href="/dashboard/offers/new">
              <Button variant="outline" className="w-full">
                <Handshake className="mr-2 h-4 w-4" />
                Create Offer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
