"use client";

import * as React from "react";
import { useMyLoans } from "@/hooks/use-loan";
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

export default function LoanApplicationsPage() {
  const { data: loansData, isLoading, error } = useMyLoans({ limit: 50 });

  // ✅ CORRECT FIX: Extract the loan applications array
  const loans = loansData?.data?.data?.data ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_review":
      case "under_review":
        return "bg-blue-100 text-blue-800";
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
          Error loading loan applications: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loan Applications</h1>
          <p className="text-muted-foreground">
            Manage vehicle loan applications
          </p>
        </div>

        <Link href="/dashboard/loans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Loan Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Loan Applications ({loansData?.data?.data?.total ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading loan applications...</p>
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No loan applications found</p>
              <Link href="/dashboard/loans/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Application
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Monthly Income</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      {loan.vehicle ? (
                        <div>
                          <div className="font-medium">
                            {loan.vehicle.year} {loan.vehicle.make}{" "}
                            {loan.vehicle.model}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            VIN: {loan.vehicle.vin}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Vehicle ID: {loan.vehicleId}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{loan.applicantName}</div>
                      <div className="text-sm text-muted-foreground">
                        {loan.applicantEmail}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {loan.applicantPhone}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(loan.loanAmount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {loan.interestRate}% APR
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(loan.monthlyIncome)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {loan.employmentStatus
                          .toLowerCase()
                          .replace("_", " ")}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{loan.termMonths} months</div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {loan.status
                          .replace("_", " ")
                          .replace(/^./, (c) => c.toUpperCase())}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Link href={`/dashboard/loans/${loan.id}`}>
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
