"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useOfferById, useDeleteOffer } from "@/hooks/use-offer"
import { ArrowLeft, Edit, Trash2, Handshake, DollarSign, Clock } from "lucide-react"
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

export default function OfferDetailPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params.id as string
  
  const { data: offerResponse, isLoading, error } = useOfferById(offerId)
  const deleteOffer = useDeleteOffer()
  
  const offer = offerResponse?.data.data

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load offer details",
      variant: "destructive",
    })
    router.push("/dashboard/offers")
  }

  const handleDelete = async () => {
    deleteOffer.mutate(offerId, {
      onSuccess: () => {
        router.push("/dashboard/offers")
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "declined":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateMonthlyPayment = (amount: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                   (Math.pow(1 + monthlyRate, term) - 1)
    return isNaN(payment) ? 0 : payment
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading offer details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Handshake className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">Offer not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const monthlyPayment = calculateMonthlyPayment(offer.offeredAmount, offer.interestRate, offer.loanTerm)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/offers")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Offers
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Loan Offer Details
            </h1>
            <p className="text-muted-foreground">Offer ID: {offer.id}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/dashboard/offers/${offerId}/edit`)}
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteOffer.isPending}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    loan offer and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteOffer.isPending}
                  >
                    {deleteOffer.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offer Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5" />
              Offer Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <Badge className={`text-lg px-4 py-2 ${getStatusColor(offer.status)}`}>
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
              </Badge>
              {isExpired(offer.expiresAt) && offer.status === "active" && (
                <div className="mt-2">
                  <Badge variant="destructive">Expired</Badge>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-semibold">{formatDate(offer.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expires</p>
                <p className="font-semibold">{formatDate(offer.expiresAt)}</p>
              </div>
              {offer.acceptedAt && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Accepted</p>
                  <p className="font-semibold">{formatDate(offer.acceptedAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loan Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Loan Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Offered Amount</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(offer.offeredAmount)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                <p className="text-lg font-semibold">{offer.interestRate}% APR</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loan Term</p>
                <p className="text-lg font-semibold">{offer.loanTerm} months</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
              <p className="text-xl font-semibold text-blue-600">{formatCurrency(monthlyPayment)}/mo</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Payable</p>
              <p className="text-lg font-semibold">{formatCurrency(offer.totalPayable)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Loan Application Reference */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Related Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Loan Application ID</p>
              <p className="text-lg font-mono">{offer.loanApplicationId}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => router.push(`/dashboard/loans/${offer.loanApplicationId}`)}
              >
                View Loan Application
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Schedule Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-600">Monthly Payment</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-600">Total Interest</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(offer.totalPayable - offer.offeredAmount)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-600">{formatCurrency(offer.totalPayable)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}