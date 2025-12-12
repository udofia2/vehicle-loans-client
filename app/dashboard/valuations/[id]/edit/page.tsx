"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useValuationById, useUpdateValuation } from "@/hooks/use-valuation"
import { ArrowLeft } from "lucide-react"

const valuationSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  estimatedValue: z.number().min(0, "Estimated value must be positive"),
  minValue: z.number().min(0, "Minimum value must be positive"),
  maxValue: z.number().min(0, "Maximum value must be positive"),
  source: z.enum(["manual", "kbb", "edmunds", "nada", "external_api"]),
  valuationDate: z.string().min(1, "Valuation date is required"),
  metadata: z.string().optional(),
})

type ValuationFormData = z.infer<typeof valuationSchema>

export default function EditValuationPage() {
  const router = useRouter()
  const params = useParams()
  const valuationId = params.id as string
  
  const { data: valuationResponse, isLoading: isLoadingValuation, error } = useValuationById(valuationId)
  const updateValuation = useUpdateValuation()
  
  const valuation = valuationResponse?.data

  const form = useForm<ValuationFormData>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      vehicleId: "",
      estimatedValue: 0,
      minValue: 0,
      maxValue: 0,
      source: "manual",
      valuationDate: new Date().toISOString().split('T')[0],
      metadata: "",
    },
  })

  useEffect(() => {
    if (valuation?.data) {
      // Update form with fetched data
      form.reset({
        vehicleId: valuation.data.vehicleId,
        estimatedValue: valuation.data.estimatedValue,
        minValue: valuation.data.minValue,
        maxValue: valuation.data.maxValue,
        source: valuation.data.source as "manual" | "kbb" | "edmunds" | "nada" | "external_api",
        valuationDate: new Date(valuation.data.valuationDate).toISOString().split('T')[0],
        metadata: valuation.data.metadata || "",
      })
    }
  }, [valuation, form])

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load valuation details",
      variant: "destructive",
    })
    router.push("/dashboard/valuations")
  }

  const onSubmit = async (data: ValuationFormData) => {
    updateValuation.mutate({ id: valuationId, data }, {
      onSuccess: () => {
        router.push("/dashboard/valuations")
      }
    })
  }

  if (isLoadingValuation) {
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
        <h1 className="text-3xl font-bold">Edit Valuation</h1>
        <p className="text-muted-foreground">Update valuation information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Valuation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter vehicle ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select valuation source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="kbb">Kelley Blue Book</SelectItem>
                          <SelectItem value="edmunds">Edmunds</SelectItem>
                          <SelectItem value="nada">NADA</SelectItem>
                          <SelectItem value="external_api">External API</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter estimated value"
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
                  name="minValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter minimum value"
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
                  name="maxValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter maximum value"
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
                  name="valuationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuation Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={updateValuation.isPending}>
                  {updateValuation.isPending ? "Updating..." : "Update Valuation"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/valuations")}
                  disabled={updateValuation.isPending}
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