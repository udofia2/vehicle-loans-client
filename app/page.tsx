"use client";

import { VehicleSearchForm } from "@/components/features/vehicle/vehicle-search-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, DollarSign, FileText, CheckCircle, ArrowRight, Database, Users, Shield } from "lucide-react";
import { useMyVehicles } from "@/hooks/use-vehicle";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  // Test the API integration by fetching vehicles
  const { data: vehiclesData, isLoading, error } = useMyVehicles({ limit: 5 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AutoCheck</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/vehicles" className="text-sm hover:text-primary transition-colors">
              Vehicles
            </Link>
            <Link href="/dashboard/loans" className="text-sm hover:text-primary transition-colors">
              Loans
            </Link>
            <Link href="/dashboard/offers" className="text-sm hover:text-primary transition-colors">
              Offers
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/vehicles/new">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Vehicle Loans Made
              <span className="text-primary"> Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get instant vehicle valuations and compare loan offers from multiple lenders. 
              Apply once, receive multiple offers, and drive away with the best deal.
            </p>
            
            {/* API Integration Status */}
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  {isLoading ? (
                    "Loading..."
                  ) : error ? (
                    "API connecting..."
                  ) : (
                    `${vehiclesData?.data?.total || 0} vehicles tracked`
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">1,200+ happy customers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Secure & trusted</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link href="/dashboard/vehicles/new" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Add Your Vehicle
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Vehicle Search Form */}
          <div className="max-w-lg mx-auto mt-8 space-y-4">
            <div className="text-sm text-muted-foreground">
              Or search by VIN to get started quickly
            </div>
            <VehicleSearchForm 
              onVehicleFound={(vehicle) => {
                // Navigate to vehicle details or create page with pre-filled data
                router.push('/dashboard/vehicles/new?vin=' + vehicle.vin);
              }}
            />
            
            {/* Sample VINs for Demo */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Try these sample VINs for demo:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-background p-2 rounded border">
                  <span className="font-mono">1HGBH41JXMN109186</span>
                  <span className="text-muted-foreground">Honda Accord</span>
                </div>
                <div className="flex items-center justify-between bg-background p-2 rounded border">
                  <span className="font-mono">5YJ3E1EA4KF123456</span>
                  <span className="text-muted-foreground">Tesla Model 3</span>
                </div>
                <div className="flex items-center justify-between bg-background p-2 rounded border">
                  <span className="font-mono">1FTFW1ET5DFC58229</span>
                  <span className="text-muted-foreground">Ford F-150</span>
                </div>
                <div className="flex items-center justify-between bg-background p-2 rounded border">
                  <span className="font-mono">WBAJB1C50EG123456</span>
                  <span className="text-muted-foreground">BMW 328i</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">
            Get approved for a vehicle loan in just a few simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">1. Find Your Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Enter your vehicle&apos;s VIN to get instant access to detailed vehicle information
              </CardDescription>
              <Link href="/dashboard/vehicles/new">
                <Button variant="outline" size="sm" className="w-full">
                  Add Vehicle
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">2. Get Valuation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Receive an accurate market valuation based on current market conditions
              </CardDescription>
              <Link href="/dashboard/valuations">
                <Button variant="outline" size="sm" className="w-full">
                  View Valuations
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">3. Apply for Loan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Complete a single application form and get matched with multiple lenders
              </CardDescription>
              <Link href="/dashboard/loans">
                <Button variant="outline" size="sm" className="w-full">
                  Apply Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">4. Choose & Drive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Compare offers, choose the best terms, and get approved instantly
              </CardDescription>
              <Link href="/dashboard/offers">
                <Button variant="outline" size="sm" className="w-full">
                  View Offers
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="mb-6 opacity-90">
              Join thousands of satisfied customers who found their perfect vehicle loan through our platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard/vehicles/new">
                <Button variant="secondary" size="lg">
                  Start Your Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Car className="h-6 w-6 text-primary" />
              <span className="font-bold">AutoCheck</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/vehicles" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Vehicles
              </Link>
              <Link href="/dashboard/loans" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Loans
              </Link>
              <Link href="/dashboard/offers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Offers
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}