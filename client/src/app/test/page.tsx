"use client"

import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import Label from "../../components/ui/label"
import { useState } from "react"

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    console.log(formData)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-md">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Component Test</h1>
            <p className="text-muted-foreground">
              Testing our shadcn-ui styled components
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <Button type="submit" fullWidth isLoading={loading}>
                Submit
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
