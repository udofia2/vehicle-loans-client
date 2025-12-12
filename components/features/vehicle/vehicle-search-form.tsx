'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Search, Loader2 } from 'lucide-react'
import { vehicleSearchSchema, type VehicleSearch, type Vehicle } from '@/types'
import { useVehicleSearch } from '@/hooks/use-vehicle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Vehicle Search Form Component
 * Allows users to search for vehicles by VIN
 */

interface VehicleSearchFormProps {
  onVehicleFound?: (vehicle: Vehicle) => void
  className?: string
}

export function VehicleSearchForm({ onVehicleFound, className }: VehicleSearchFormProps) {
  const [vinInput, setVinInput] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleSearch>({
    resolver: zodResolver(vehicleSearchSchema),
  })

  const { data: searchResult, isLoading, error } = useVehicleSearch(vinInput)

  const onSubmit = React.useCallback((formData: VehicleSearch) => {
    setVinInput(formData.vin)
    // The search is handled by the query hook
    // We just need to handle the result when it arrives
  }, [])

  // Handle successful search result
  React.useEffect(() => {
    if (searchResult?.data && onVehicleFound) {
      onVehicleFound(searchResult.data)
    }
  }, [searchResult, onVehicleFound])

  // Auto-submit when VIN is complete (17 characters)
  const handleVinChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length === 17 && !errors.vin) {
      setVinInput(value)
    }
  }, [errors.vin])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Search Vehicle</CardTitle>
        <CardDescription>
          Enter a 17-character VIN to look up vehicle details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <div className="relative">
              <Input
                id="vin"
                placeholder="Enter 17-character VIN"
                className="uppercase pr-10"
                maxLength={17}
                {...register('vin', {
                  onChange: handleVinChange,
                })}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Search className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            {errors.vin && (
              <p className="text-sm text-destructive">{errors.vin.message}</p>
            )}
            {error && (
              <p className="text-sm text-destructive">
                Vehicle not found. Please check the VIN and try again.
              </p>
            )}
          </div>

          {vinInput && vinInput.length < 17 && (
            <p className="text-xs text-muted-foreground">
              {17 - vinInput.length} characters remaining
            </p>
          )}

          {searchResult?.data && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Vehicle Found:</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Make:</span> {searchResult.data.make}</p>
                <p><span className="font-medium">Model:</span> {searchResult.data.model}</p>
                <p><span className="font-medium">Year:</span> {searchResult.data.year}</p>
                <p><span className="font-medium">Mileage:</span> {searchResult.data.mileage?.toLocaleString()} miles</p>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || isLoading || vinInput?.length !== 17}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Vehicle
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}