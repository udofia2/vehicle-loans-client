"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Download, 
  Upload,
  Settings,
  User,
  Mail,
  Phone
} from "lucide-react";

export default function ButtonShowcase() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Button Showcase</h1>
        <p className="text-muted-foreground">Demonstrating improved button styles and interactions</p>
      </div>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>Different button styles for various use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </CardContent>
      </Card>

      {/* Button Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Button Sizes</CardTitle>
          <CardDescription>Various button sizes for different contexts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive States */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive States</CardTitle>
          <CardDescription>Buttons with different states and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button disabled>Disabled Button</Button>
            <Button variant="outline" className="hover:shadow-lg">
              Hover Effect
            </Button>
            <Button variant="ghost" className="active:scale-95">
              Click Animation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Icon Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons with Icons</CardTitle>
          <CardDescription>Common patterns for buttons with icons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button variant="success">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button variant="ghost">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="link">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Icon Only Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Only Buttons</CardTitle>
          <CardDescription>Compact buttons with just icons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="hover:bg-blue-50 hover:text-blue-600">
              <Mail className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="hover:bg-green-50 hover:text-green-600">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="hover:bg-yellow-50 hover:text-yellow-600">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Button Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Button Groups</CardTitle>
          <CardDescription>Common button grouping patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Form Actions */}
            <div>
              <h4 className="font-semibold mb-3">Form Actions</h4>
              <div className="flex gap-3">
                <Button variant="success" size="lg">Save Changes</Button>
                <Button variant="outline" size="lg">Cancel</Button>
              </div>
            </div>

            {/* Confirmation Dialog */}
            <div>
              <h4 className="font-semibold mb-3">Confirmation Actions</h4>
              <div className="flex gap-3">
                <Button variant="destructive">Delete</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-3">Navigation</h4>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm">← Previous</Button>
                <Button variant="outline" size="sm">Next →</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}