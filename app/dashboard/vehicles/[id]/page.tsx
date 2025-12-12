"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useVehicleById, useDeleteVehicle } from "@/hooks/use-vehicle"
import { ArrowLeft, Edit, Trash2, Car } from "lucide-react"
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

export default function VehicleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string
  
  const { data: vehicleResponse, isLoading, error } = useVehicleById(vehicleId)
  const deleteVehicle = useDeleteVehicle()
  
  const vehicle = vehicleResponse?.data

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load vehicle details",
      variant: "destructive",
    })
    router.push("/dashboard/vehicles")
  }

  const handleDelete = async () => {
    deleteVehicle.mutate(vehicleId, {
      onSuccess: () => {
        router.push("/dashboard/vehicles")
      }
    })
  }

const getConditionColor = (condition?: string) => {
  switch (condition) {
    case "excellent":
      return "bg-green-100 text-green-800"
    case "good":
      return "bg-blue-100 text-blue-800"
    case "fair":
      return "bg-yellow-100 text-yellow-800"
    case "poor":
      return "bg-red-100 text-red-800"
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
              <p className="text-muted-foreground">Loading vehicle details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">Vehicle not found</p>
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
          onClick={() => router.push("/dashboard/vehicles")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vehicles
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-muted-foreground">VIN: {vehicle.vin}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/dashboard/vehicles/${vehicleId}/edit`)}
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteVehicle.isPending}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    vehicle and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteVehicle.isPending}
                  >
                    {deleteVehicle.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Make</p>
                <p className="text-lg font-semibold">{vehicle?.data.make}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p className="text-lg font-semibold">{vehicle?.data.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Year</p>
                <p className="text-lg font-semibold">{vehicle?.data.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Color</p>
                <p className="text-lg font-semibold capitalize">{vehicle?.data.color}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transmission</p>
                <p className="text-lg font-semibold capitalize">{vehicle?.data.transmission}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fuel Type</p>
                <p className="text-lg font-semibold capitalize">{vehicle?.data.fuelType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mileage</p>
                <p className="text-lg font-semibold">{Number(vehicle?.data.mileage || 0).toLocaleString()} miles</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Condition</p>
                  <Badge className={getConditionColor(vehicle?.data.condition ?? "unknown")}>
                    {vehicle?.data.condition
                      ? vehicle?.data.condition[0].toUpperCase() + vehicle?.data.condition.slice(1)
                      : "Unknown"}
                  </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VIN Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vehicle Identification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VIN</p>
                <p className="text-lg font-mono font-semibold">{vehicle?.data.vin}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-lg font-semibold">
                  {new Date(vehicle?.data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}