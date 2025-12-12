"use client";

import * as React from "react";
import { useMyVehicles } from "@/hooks/use-vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDeleteVehicle } from "@/hooks/use-vehicle";
import { toast } from "@/hooks/use-toast";

export default function VehiclesPage() {
  const { data: vehiclesData, isLoading, error } = useMyVehicles({ limit: 50 });
  const deleteVehicle = useDeleteVehicle();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle.mutateAsync(id);
        toast({
          title: "Success",
          description: "Vehicle deleted successfully",
          variant: "success",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to delete vehicle",
          variant: "destructive",
        });
      }
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading vehicles: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage all vehicles in the system
          </p>
        </div>
        <Link href="/dashboard/vehicles/new">
          <Button variant="default" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vehicles ({vehiclesData?.data?.data?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading vehicles...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              Error loading vehicles: {String(error)}
            </div>
          ) : !vehiclesData?.data?.data?.data || vehiclesData.data.data.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No vehicles found</p>
              <Link href="/dashboard/vehicles/new">
                <Button className="mt-4" variant="success" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Vehicle
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>VIN</TableHead>
                  <TableHead>Make & Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiclesData?.data?.data?.data && Array.isArray(vehiclesData.data.data.data) 
                  ? vehiclesData.data.data.data.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-mono text-sm">
                      {vehicle.vin}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.color}</div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.mileage?.toLocaleString()} miles</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {vehicle.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/vehicles/${vehicle.id}/edit`}>
                          <Button variant="ghost" size="sm" className="hover:bg-yellow-50 hover:text-yellow-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={deleteVehicle.isPending}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                : null}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
