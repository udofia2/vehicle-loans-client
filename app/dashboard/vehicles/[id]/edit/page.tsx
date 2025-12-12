"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { useVehicleById, useUpdateVehicle } from "@/hooks/use-vehicle"
import { ArrowLeft } from "lucide-react"

const vehicleSchema = z.object({
  vin: z.string().min(17, "VIN must be 17 characters").max(17, "VIN must be 17 characters"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Year must be valid").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.number().min(0, "Mileage cannot be negative"),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  transmission: z.enum(["manual", "automatic"]),
  // fuel_type: z.enum(["gasoline", "diesel", "hybrid", "electric"]),
  color: z.string().min(1, "Color is required"),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string
  
  const { data: vehicleResponse, isLoading: isLoadingVehicle, error } = useVehicleById(vehicleId)
  const updateVehicle = useUpdateVehicle()
  
  const vehicle = vehicleResponse?.data

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vin: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      condition: "good",
      transmission: "automatic",
      // fuel_type: "gasoline",
      color: "",
    },
  })

  useEffect(() => {
    if (vehicle?.data) {
      // Update form with fetched data
      form.reset({
        vin: vehicle.data.vin,
        make: vehicle.data.make,
        model: vehicle.data.model,
        year: vehicle.data.year,
        mileage: vehicle.data.mileage,
        condition: vehicle.data.condition as "excellent" | "good" | "fair" | "poor",
        transmission: vehicle.data.transmission as "manual" | "automatic",
        // fuel_type: vehicle.data.fuelType as "gasoline" | "diesel" | "hybrid" | "electric",
        color: vehicle.data.color,
      })
    }
  }, [vehicle, form])

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load vehicle details",
      variant: "destructive",
    })
    router.push("/dashboard/vehicles")
  }

  const onSubmit = async (data: VehicleFormData) => {
    updateVehicle.mutate({ id: vehicleId, data }, {
      onSuccess: () => {
        router.push("/dashboard/vehicles")
      }
    })
  }

  if (isLoadingVehicle) {
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
        <h1 className="text-3xl font-bold">Edit Vehicle</h1>
        <p className="text-muted-foreground">Update vehicle information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter VIN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter make" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter year"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter mileage"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="fuel_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gasoline">Gasoline</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={updateVehicle.isPending}>
                  {updateVehicle.isPending ? "Updating..." : "Update Vehicle"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/vehicles")}
                  disabled={updateVehicle.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}