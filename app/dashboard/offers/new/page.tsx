"use client"

import { useRouter } from "next/navigation"
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
import { useMyLoans } from "@/hooks/use-loan"
import { useCreateOffer } from "@/hooks/use-offer"
import { ArrowLeft, HandHeart } from "lucide-react"

const offerSchema = z.object({
  loanApplicationId: z.string().min(1, "Loan application is required"),
  interestRate: z.number().min(5).max(30),
  loanTerm: z.number().int().min(12).max(84),
  offeredAmount: z.number().min(1000, "Minimum offered amount is 1000"),
  expirationHours: z.number().int().min(24).max(720).optional(),
})

type OfferFormData = z.infer<typeof offerSchema>

export default function NewOfferPage() {
  const router = useRouter()
  const { data: loansData, isLoading: isLoadingLoans } = useMyLoans({ limit: 100 })
  const createOffer = useCreateOffer()
  console.log(loansData?.data.data)
  const loans = loansData?.data?.data.data || []

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      loanApplicationId: "",
      interestRate: 5.0,
      loanTerm: 36,
      offeredAmount: 0,
      expirationHours: 720, // 30 days
    },
  })

  const onSubmit = async (data: OfferFormData) => {
    createOffer.mutate(data, {
      onSuccess: () => {
        router.push("/dashboard/offers")
      }
    })
  }

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
        <h1 className="text-3xl font-bold">New Loan Offer</h1>
        <p className="text-muted-foreground">Create a new loan offer for an application</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HandHeart className="mr-2 h-5 w-5" />
            Loan Offer Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="loanApplicationId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Loan Application</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingLoans ? "Loading loan applications..." : "Select a loan application"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loans.map((loan) => (
                            <SelectItem key={loan.id} value={loan.id}>
                              {loan.applicantName} - ${loan.loanAmount.toLocaleString()} ({loan.status})
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
                  name="offeredAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offered Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="1000"
                          placeholder="Enter offered amount"
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
                          min="5"
                          max="30"
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
                  name="loanTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Term (Months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="12"
                          max="84"
                          placeholder="Enter loan term"
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
                  name="expirationHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration (Hours)</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select expiration time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="24">24 Hours (1 Day)</SelectItem>
                          <SelectItem value="72">72 Hours (3 Days)</SelectItem>
                          <SelectItem value="168">168 Hours (1 Week)</SelectItem>
                          <SelectItem value="336">336 Hours (2 Weeks)</SelectItem>
                          <SelectItem value="720">720 Hours (30 Days)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={createOffer.isPending}>
                  {createOffer.isPending ? "Creating..." : "Create Loan Offer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/offers")}
                  disabled={createOffer.isPending}
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