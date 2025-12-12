"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { ArrowLeft, CreditCard } from "lucide-react"
import { Vehicle } from "@/types"

const loanApplicationSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  loan_amount: z.number().min(0, "Loan amount must be positive"),
  interest_rate: z.number().min(0, "Interest rate must be positive"),
  loan_term_months: z.number().min(1, "Loan term must be at least 1 month"),
  down_payment: z.number().min(0, "Down payment cannot be negative"),
  applicant_name: z.string().min(1, "Applicant name is required"),
  applicant_email: z.string().email("Valid email is required"),
  applicant_phone: z.string().min(1, "Phone number is required"),
  credit_score: z.number().min(300, "Credit score must be at least 300").max(850, "Credit score cannot exceed 850"),
  annual_income: z.number().min(0, "Annual income cannot be negative"),
  employment_status: z.enum(["employed", "self_employed", "unemployed", "retired", "student"]),
  notes: z.string().optional(),
})

type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>

export default function NewLoanApplicationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true)

  const form = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      vehicle_id: "",
      loan_amount: 0,
      interest_rate: 0,
      loan_term_months: 0,
      down_payment: 0,
      applicant_name: "",
      applicant_email: "",
      applicant_phone: "",
      credit_score: 700,
      annual_income: 0,
      employment_status: "employed",
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

  // Calculate monthly payment when loan details change
  const calculateMonthlyPayment = (amount: number, rate: number, months: number) => {
    if (amount <= 0 || rate <= 0 || months <= 0) return 0
    const monthlyRate = rate / 100 / 12
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1)
    return payment
  }

  const onSubmit = async (data: LoanApplicationFormData) => {
    try {
      setIsLoading(true)
      const monthlyPayment = calculateMonthlyPayment(data.loan_amount, data.interest_rate, data.loan_term_months)
      
      const response = await fetch("/api/loan-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          monthly_payment: monthlyPayment,
          status: "pending",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create loan application")
      }

      toast({
        title: "Success",
        description: "Loan application created successfully",
      })

      router.push("/dashboard/loans")
    } catch (error) {
      console.error("Error creating loan application:", error)
      toast({
        title: "Error",
        description: "Failed to create loan application",
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
          onClick={() => router.push("/dashboard/loans")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Loan Applications
        </Button>
        <h1 className="text-3xl font-bold">New Loan Application</h1>
        <p className="text-muted-foreground">Create a new vehicle loan application</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Vehicle and Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="loan_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter loan amount"
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
                name="down_payment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Down Payment ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter down payment"
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
                name="interest_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter interest rate"
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
                name="loan_term_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term (Months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Enter loan term in months"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="applicant_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicant_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicant_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credit_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Score</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="300"
                        max="850"
                        placeholder="Enter credit score"
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
                name="annual_income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter annual income"
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
                name="employment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self_employed">Self-Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
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
                        placeholder="Enter any additional notes..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Loan Application"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/loans")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}