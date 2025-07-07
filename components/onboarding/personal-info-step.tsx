"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PersonalInfoStepProps {
  onComplete: (data: any) => void
}

export default function PersonalInfoStep({ onComplete }: PersonalInfoStepProps) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
  })

  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    // Validations
    if (!formData.age || Number.parseInt(formData.age) < 13 || Number.parseInt(formData.age) > 120) {
      newErrors.push("Age must be between 13 and 120")
    }
    if (!formData.gender) newErrors.push("Please select your gender")
    if (!formData.weight || Number.parseFloat(formData.weight) < 30 || Number.parseFloat(formData.weight) > 300) {
      newErrors.push("Weight must be between 30 and 300 kg")
    }
    if (!formData.height || Number.parseInt(formData.height) < 100 || Number.parseInt(formData.height) > 250) {
      newErrors.push("Height must be between 100 and 250 cm")
    }
    if (!formData.activityLevel) newErrors.push("Please select your activity level")

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onComplete({
      personalInfo: {
        age: Number.parseInt(formData.age),
        gender: formData.gender as "male" | "female" | "other",
        weight: Number.parseFloat(formData.weight),
        height: Number.parseInt(formData.height),
        activityLevel: formData.activityLevel as "sedentary" | "light" | "moderate" | "active" | "very_active",
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
        <p className="text-gray-600">Help us understand your basic profile</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <ul className="text-red-600 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={formData.age}
              onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="70"
              value={formData.weight}
              onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="175"
              value={formData.height}
              onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="activityLevel">Activity Level</Label>
          <Select
            value={formData.activityLevel}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, activityLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
              <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
              <SelectItem value="very_active">Very Active (very hard exercise, physical job)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  )
}
