"use client"

import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useOfferById, useUpdateOffer } from "@/hooks/use-offer"
import { ArrowLeft, Save, DollarSign, Percent, Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function EditOfferPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params.id as string
  
  const { data: offerResponse, isLoading, error } = useOfferById(offerId)
  const updateOffer = useUpdateOffer()
  
  const offer = offerResponse?.data.data

  const [formData, setFormData] = useState({
    offeredAmount: offer?.offeredAmount || 0,
    interestRate: offer?.interestRate || 0,
    loanTerm: offer?.loanTerm || 12,
    expiresAt: offer?.expiresAt ? new Date(offer.expiresAt).toISOString().slice(0, 16) : "",
  })

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load offer details",
      variant: "destructive",
    })
    router.push("/dashboard/offers")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.offeredAmount || formData.offeredAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Offered amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    if (!formData.interestRate || formData.interestRate < 0) {
      toast({
        title: "Validation Error",
        description: "Interest rate cannot be negative",
        variant: "destructive",
      })
      return
    }

    if (!formData.loanTerm || formData.loanTerm < 6 || formData.loanTerm > 84) {
      toast({
        title: "Validation Error",
        description: "Loan term must be between 6 and 84 months",
        variant: "destructive",
      })
      return
    }

    if (!formData.expiresAt) {
      toast({
        title: "Validation Error",
        description: "Expiration date is required",
        variant: "destructive",
      })
      return
    }

    const expiresAt = new Date(formData.expiresAt)
    if (expiresAt <= new Date()) {
      toast({
        title: "Validation Error",
        description: "Expiration date must be in the future",
        variant: "destructive",
      })
      return
    }

    updateOffer.mutate({
      offerId,
      data: {
        ...formData,
        expiresAt: expiresAt.toISOString(),
      },
    }, {
      onSuccess: () => {
        router.push(`/dashboard/offers/${offerId}`)
      },
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateMonthlyPayment = (amount: number, rate: number, term: number) => {
    if (!amount || !rate || !term) return 0
    const monthlyRate = rate / 100 / 12
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                   (Math.pow(1 + monthlyRate, term) - 1)
    return isNaN(payment) ? 0 : payment
  }

  const calculateTotalPayable = (amount: number, rate: number, term: number) => {
    const monthlyPayment = calculateMonthlyPayment(amount, rate, term)
    return monthlyPayment * term
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
              <p className="text-xl font-semibold text-muted-foreground">Offer not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Don't allow editing accepted or declined offers
  if (offer.status === "accepted" || offer.status === "declined") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-xl font-semibold text-muted-foreground">
                Cannot edit {offer.status} offer
              </p>
              <Button 
                className="mt-4"
                onClick={() => router.push(`/dashboard/offers/${offerId}`)}
              >
                View Offer Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/offers/${offerId}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Offer Details
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Loan Offer</h1>
            <p className="text-muted-foreground">
              Offer ID: {offer.id} • Application ID: {offer.loanApplicationId}
            </p>
            <div className="mt-2">
              <Badge className={getStatusColor(offer.status)}>
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                {isExpired(offer.expiresAt) && offer.status === "active" && " (Expired)"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Loan Offer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offeredAmount">
                      Offered Amount <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="offeredAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-10"
                        value={formData.offeredAmount}
                        onChange={(e) => setFormData({ ...formData, offeredAmount: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interestRate">
                      Interest Rate (%) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="interestRate"
                        type="number"
                        min="0"
                        max="30"
                        step="0.01"
                        className="pl-10"
                        value={formData.interestRate}
                        onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanTerm">
                      Loan Term (months) <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.loanTerm.toString()}
                      onValueChange={(value) => setFormData({ ...formData, loanTerm: parseInt(value) })}
                    >
                      <SelectTrigger className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <SelectValue className="ml-8" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="18">18 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                        <SelectItem value="72">72 months</SelectItem>
                        <SelectItem value="84">84 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expiresAt">
                      Expiration Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={updateOffer.isPending}
                    className="flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateOffer.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/offers/${offerId}`)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Payment Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(calculateMonthlyPayment(formData.offeredAmount, formData.interestRate, formData.loanTerm))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Payable</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(calculateTotalPayable(formData.offeredAmount, formData.interestRate, formData.loanTerm))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Interest</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(
                    calculateTotalPayable(formData.offeredAmount, formData.interestRate, formData.loanTerm) - 
                    formData.offeredAmount
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Loan Application</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-muted-foreground">Application ID</p>
              <p className="font-mono text-sm">{offer.loanApplicationId}</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => router.push(`/dashboard/loans/${offer.loanApplicationId}`)}
              >
                View Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}