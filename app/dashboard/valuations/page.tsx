"use client";

import * as React from "react";
import { useMyValuations } from "@/hooks/use-valuation";
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

export default function ValuationsPage() {
  const { data: valuationsData, isLoading, error } = useMyValuations({ limit: 50 });

  // ✅ Correct extraction of valuations array
  const valuations = valuationsData?.data?.data?.data ?? [];

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
          Error loading valuations: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Valuations</h1>
          <p className="text-muted-foreground">
            Manage vehicle valuations and assessments
          </p>
        </div>

        <Link href="/dashboard/valuations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Valuation
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Valuations ({valuationsData?.data?.data?.total ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading valuations...</p>
            </div>
          ) : valuations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No valuations found</p>
              <Link href="/dashboard/valuations/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Valuation
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Estimated Value</TableHead>
                  <TableHead>Min Value</TableHead>
                  <TableHead>Max Value</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {valuations.map((valuation) => (
                  <TableRow key={valuation.id}>
                    <TableCell>
                      {valuation.vehicle
                        ? `${valuation.vehicle.year} ${valuation.vehicle.make} ${valuation.vehicle.model}`
                        : `Vehicle ID: ${valuation.vehicleId}`}
                    </TableCell>

                    <TableCell className="font-medium">
                      {formatCurrency(valuation.estimatedValue)}
                    </TableCell>

                    <TableCell>{formatCurrency(valuation.minValue)}</TableCell>
                    <TableCell>{formatCurrency(valuation.maxValue)}</TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {valuation.source.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {formatDate(valuation.valuationDate)}
                    </TableCell>

                    <TableCell>
                      <Link href={`/dashboard/valuations/${valuation.id}`}>
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
