"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { ArrowLeft, DollarSign } from "lucide-react"
import { Vehicle } from "@/types"

const valuationSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  valuation_amount: z.number().min(0, "Valuation amount must be positive"),
  market_value: z.number().min(0, "Market value must be positive"),
  depreciation_rate: z.number().min(0, "Depreciation rate must be positive").max(1, "Depreciation rate cannot exceed 100%"),
  notes: z.string().optional(),
})

type ValuationFormData = z.infer<typeof valuationSchema>

export default function NewValuationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true)

  const form = useForm<ValuationFormData>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      vehicle_id: "",
      valuation_amount: 0,
      market_value: 0,
      depreciation_rate: 0,
      notes: "",
    },
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setIsLoadingVehicles(true)
      const response = await fetch("/api/vehicles")
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles")
      }
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      console.error("Error fetching vehicles:", error)
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      })
    } finally {
      setIsLoadingVehicles(false)
    }
  }

  const onSubmit = async (data: ValuationFormData) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/valuations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          valuation_date: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create valuation")
      }

      toast({
        title: "Success",
        description: "Valuation created successfully",
      })

      router.push("/dashboard/valuations")
    } catch (error) {
      console.error("Error creating valuation:", error)
      toast({
        title: "Error",
        description: "Failed to create valuation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-3xl font-bold">New Valuation</h1>
        <p className="text-muted-foreground">Create a new vehicle valuation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Valuation Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicle_id"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Vehicle</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingVehicles ? "Loading vehicles..." : "Select a vehicle"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valuation_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuation Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter valuation amount"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="market_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Value ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter market value"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depreciation_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depreciation Rate (0-1)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          placeholder="Enter depreciation rate (e.g., 0.15 for 15%)"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes about the valuation..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Valuation"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/valuations")}
                  disabled={isLoading}
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