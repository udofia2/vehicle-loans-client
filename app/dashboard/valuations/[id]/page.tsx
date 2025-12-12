"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useValuationById, useDeleteValuation } from "@/hooks/use-valuation"
import { ArrowLeft, Edit, Trash2, DollarSign } from "lucide-react"
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

export default function ValuationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const valuationId = params.id as string
  
  const { data: valuationResponse, isLoading, error } = useValuationById(valuationId)
  const deleteValuation = useDeleteValuation()
  console.log(valuationResponse?.data.data)
  const valuation = valuationResponse?.data.data

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load valuation details",
      variant: "destructive",
    })
    router.push("/dashboard/valuations")
  }

  const handleDelete = async () => {
    deleteValuation.mutate(valuationId, {
      onSuccess: () => {
        router.push("/dashboard/valuations")
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

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case "kbb":
        return "bg-blue-100 text-blue-800"
      case "edmunds":
        return "bg-green-100 text-green-800"
      case "nada":
        return "bg-purple-100 text-purple-800"
      case "manual":
        return "bg-orange-100 text-orange-800"
      case "external_api":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading valuation details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!valuation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">Valuation not found</p>
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
          onClick={() => router.push("/dashboard/valuations")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Valuations
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Vehicle Valuation
            </h1>
            <p className="text-muted-foreground">Vehicle ID: {valuation.vehicleId}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/dashboard/valuations/${valuationId}/edit`)}
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteValuation.isPending}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    valuation and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteValuation.isPending}
                  >
                    {deleteValuation.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Valuation Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Valuation Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(valuation.estimatedValue)}
              </div>
              <p className="text-sm text-muted-foreground">Estimated Value</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-lg font-semibold text-red-600">
                  {formatCurrency(valuation.minValue)}
                </div>
                <p className="text-sm text-muted-foreground">Minimum Value</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">
                  {formatCurrency(valuation.maxValue)}
                </div>
                <p className="text-sm text-muted-foreground">Maximum Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valuation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Valuation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Source</p>
                <Badge className={getSourceColor(valuation.source)}>
                  {valuation.source.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valuation Date</p>
                <p className="text-lg font-semibold">{formatDate(valuation.valuationDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehicle ID</p>
                <p className="text-lg font-mono font-semibold">{valuation.vehicleId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-lg font-semibold">{formatDate(valuation.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value Range Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Value Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Min: {formatCurrency(valuation.minValue)}</span>
                <span>Max: {formatCurrency(valuation.maxValue)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 relative">
                <div 
                  className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-4 rounded-full"
                  style={{ width: '100%' }}
                />
                <div 
                  className="absolute top-0 h-4 w-1 bg-gray-800 rounded"
                  style={{ 
                    left: `${((valuation.estimatedValue - valuation.minValue) / (valuation.maxValue - valuation.minValue)) * 100}%`
                  }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-medium">
                  Estimated: {formatCurrency(valuation.estimatedValue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        {valuation.metadata && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
             <pre className="text-sm text-gray-800 bg-gray-50 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(JSON.parse(valuation.metadata), null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}