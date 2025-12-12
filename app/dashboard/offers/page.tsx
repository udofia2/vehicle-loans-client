"use client";

import * as React from "react";
import { useMyOffers } from "@/hooks/use-offer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";

export default function OffersPage() {
  const { data: offersData, isLoading, error } = useMyOffers({ limit: 50 });

  // ✅ FIX: Extract correct array
  const offers = offersData?.data?.data?.data ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Error loading offers: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offers</h1>
          <p className="text-muted-foreground">
            Manage vehicle purchase offers
          </p>
        </div>
        <Link href="/dashboard/offers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Offer
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Offers ({offersData?.data?.data?.total ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No offers found</p>
              <Link href="/dashboard/offers/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Offer
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Application</TableHead>
                  <TableHead>Offered Amount</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Monthly Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <span className="text-muted-foreground">
                        Loan App ID: {offer.loanApplicationId}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(offer.offeredAmount)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">
                        {offer.interestRate}% APR
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold">
                        {formatCurrency(offer.monthlyPayment)}/mo
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {offer.loanTerm} months
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status.charAt(0).toUpperCase() +
                          offer.status.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Link href={`/dashboard/offers/${offer.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
