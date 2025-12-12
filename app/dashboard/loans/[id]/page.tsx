"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useLoanById, useDeleteLoan } from "@/hooks/use-loan"
import { ArrowLeft, Edit, Trash2, FileText, User, DollarSign } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LoanDetailPage() {
  const router = useRouter()
  const params = useParams()
  const loanId = params.id as string
  
  const { data: loanResponse, isLoading, error } = useLoanById(loanId)
  const deleteLoan = useDeleteLoan()
  
  const loan = loanResponse?.data.data

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load loan application details",
      variant: "destructive",
    })
    router.push("/dashboard/loans")
  }

  const handleDelete = async () => {
    deleteLoan.mutate(loanId, {
      onSuccess: () => {
        router.push("/dashboard/loans")
      }
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEmploymentStatusColor = (status: string) => {
    switch (status) {
      case "EMPLOYED":
        return "bg-green-100 text-green-800"
      case "SELF_EMPLOYED":
        return "bg-blue-100 text-blue-800"
      case "UNEMPLOYED":
        return "bg-red-100 text-red-800"
      case "RETIRED":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateMonthlyPayment = (loanAmount: number, interestRate: number, termMonths: number) => {
    const monthlyRate = interestRate / 100 / 12
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1)
    return isNaN(payment) ? 0 : payment
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading loan application details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">Loan application not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const monthlyPayment = calculateMonthlyPayment(loan.loanAmount, loan.interestRate, loan.termMonths)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/loans")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Loan Applications
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Loan Application
            </h1>
            <p className="text-muted-foreground">Application ID: {loan.id}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/dashboard/loans/${loanId}/edit`)}
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteLoan.isPending}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    loan application and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteLoan.isPending}
                  >
                    {deleteLoan.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <Badge className={`text-lg px-4 py-2 ${getStatusColor(loan.status)}`}>
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1).replace('_', ' ')}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Applied</p>
                <p className="font-semibold">{formatDate(loan.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-semibold">{formatDate(loan.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{loan.applicantName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{loan.applicantEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-lg">{loan.applicantPhone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Employment Status</p>
              <Badge className={getEmploymentStatusColor(loan.employmentStatus)}>
                {loan.employmentStatus.replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(loan.monthlyIncome)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Loan Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Loan Amount</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(loan.loanAmount)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                <p className="text-lg font-semibold">{loan.interestRate}% APR</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Term</p>
                <p className="text-lg font-semibold">{loan.termMonths} months</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estimated Monthly Payment</p>
              <p className="text-xl font-semibold text-blue-600">{formatCurrency(monthlyPayment)}/mo</p>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle & Valuation Info */}
        <Card>
          <CardHeader>
            <CardTitle>Related Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vehicle ID</p>
              <p className="text-lg font-mono">{loan.vehicleId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valuation ID</p>
              <p className="text-lg font-mono">{loan.valuationId}</p>
            </div>
                {loan.notes && (
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{loan.notes}</p>
                    </div>
                </div>
                )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}