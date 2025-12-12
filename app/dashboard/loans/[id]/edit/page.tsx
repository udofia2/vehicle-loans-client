"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { useLoanById, useUpdateLoan } from "@/hooks/use-loan"
import { ArrowLeft } from "lucide-react"

const loanSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  valuationId: z.string().min(1, "Valuation ID is required"),
  applicantName: z.string().min(2, "Applicant name is required").max(100),
  applicantEmail: z.string().email("Invalid email address"),
  applicantPhone: z.string().min(1, "Phone number is required"),
  monthlyIncome: z.number().positive("Monthly income must be positive"),
  employmentStatus: z.enum(["EMPLOYED", "SELF_EMPLOYED", "UNEMPLOYED", "RETIRED"]),
  loanAmount: z.number().min(1000, "Minimum loan amount is 1000"),
  interestRate: z.number().min(0).max(50),
  termMonths: z.number().int().min(12).max(84),
  notes: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "cancelled", "under_review"]),
})

type LoanFormData = z.infer<typeof loanSchema>

export default function EditLoanPage() {
  const router = useRouter()
  const params = useParams()
  const loanId = params.id as string
  
  const { data: loanResponse, isLoading: isLoadingLoan, error } = useLoanById(loanId)
  const updateLoan = useUpdateLoan()
  
  const loan = loanResponse?.data

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      vehicleId: "",
      valuationId: "",
      applicantName: "",
      applicantEmail: "",
      applicantPhone: "",
      monthlyIncome: 0,
      employmentStatus: "EMPLOYED",
      loanAmount: 0,
      interestRate: 0,
      termMonths: 12,
      notes: "",
      status: "pending",
    },
  })

  useEffect(() => {
    if (loan?.data) {
      // Update form with fetched data
      form.reset({
        vehicleId: loan.data.vehicleId,
        valuationId: loan.data.valuationId,
        applicantName: loan.data.applicantName,
        applicantEmail: loan.data.applicantEmail,
        applicantPhone: loan.data.applicantPhone,
        monthlyIncome: loan.data.monthlyIncome,
        employmentStatus: loan.data.employmentStatus as "EMPLOYED" | "SELF_EMPLOYED" | "UNEMPLOYED" | "RETIRED",
        loanAmount: loan.data.loanAmount,
        interestRate: loan.data.interestRate,
        termMonths: loan.data.termMonths,
        notes: loan.data.notes || "",
        status: loan.data.status as "pending" | "approved" | "rejected" | "cancelled" | "under_review",
      })
    }
  }, [loan, form])

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load loan application details",
      variant: "destructive",
    })
    router.push("/dashboard/loans")
  }

  const onSubmit = async (data: LoanFormData) => {
    updateLoan.mutate({ id: loanId, data }, {
      onSuccess: () => {
        router.push("/dashboard/loans")
      }
    })
  }

  if (isLoadingLoan) {
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
        <h1 className="text-3xl font-bold">Edit Loan Application</h1>
        <p className="text-muted-foreground">Update loan application information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Application Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle & Valuation Info */}
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
                  name="valuationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuation ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter valuation ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Applicant Information */}
                <FormField
                  control={form.control}
                  name="applicantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter applicant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicantEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicantPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Income</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter monthly income"
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
                  name="employmentStatus"
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
                          <SelectItem value="EMPLOYED">Employed</SelectItem>
                          <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
                          <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
                          <SelectItem value="RETIRED">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Loan Details */}
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
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
                  name="termMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term (Months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter term in months"
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes - Full Width */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
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

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={updateLoan.isPending}>
                  {updateLoan.isPending ? "Updating..." : "Update Loan Application"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/loans")}
                  disabled={updateLoan.isPending}
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