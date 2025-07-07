"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface RestrictionsStepProps {
  onComplete: (data: any) => void
}

export default function RestrictionsStep({ onComplete }: RestrictionsStepProps) {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([])
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])

  const restrictions = [
    { value: "gluten_free", label: "Gluten-Free" },
    { value: "lactose_free", label: "Lactose-Free" },
    { value: "low_sodium", label: "Low Sodium" },
    { value: "low_sugar", label: "Low Sugar" },
    { value: "halal", label: "Halal" },
    { value: "kosher", label: "Kosher" },
  ]

  const allergies = [
    { value: "nuts", label: "Tree Nuts" },
    { value: "peanuts", label: "Peanuts" },
    { value: "shellfish", label: "Shellfish" },
    { value: "fish", label: "Fish" },
    { value: "eggs", label: "Eggs" },
    { value: "soy", label: "Soy" },
    { value: "sesame", label: "Sesame" },
  ]

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    if (checked) {
      setSelectedRestrictions((prev) => [...prev, restriction])
    } else {
      setSelectedRestrictions((prev) => prev.filter((r) => r !== restriction))
    }
  }

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    if (checked) {
      setSelectedAllergies((prev) => [...prev, allergy])
    } else {
      setSelectedAllergies((prev) => prev.filter((a) => a !== allergy))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onComplete({
      restrictions: {
        restrictions: selectedRestrictions,
        allergies: selectedAllergies,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Dietary Restrictions & Allergies</h2>
        <p className="text-gray-600">Let us know about any restrictions or allergies you have</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="text-base font-medium">Dietary Restrictions</Label>
          <p className="text-sm text-gray-600 mb-3">Select any dietary restrictions you follow</p>
          <div className="grid grid-cols-2 gap-3">
            {restrictions.map((restriction) => (
              <div key={restriction.value} className="flex items-center space-x-2">
                <Checkbox
                  id={restriction.value}
                  checked={selectedRestrictions.includes(restriction.value)}
                  onCheckedChange={(checked) => handleRestrictionChange(restriction.value, checked as boolean)}
                />
                <Label htmlFor={restriction.value} className="text-sm cursor-pointer">
                  {restriction.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Food Allergies</Label>
          <p className="text-sm text-gray-600 mb-3">Select any food allergies you have</p>
          <div className="grid grid-cols-2 gap-3">
            {allergies.map((allergy) => (
              <div key={allergy.value} className="flex items-center space-x-2">
                <Checkbox
                  id={allergy.value}
                  checked={selectedAllergies.includes(allergy.value)}
                  onCheckedChange={(checked) => handleAllergyChange(allergy.value, checked as boolean)}
                />
                <Label htmlFor={allergy.value} className="text-sm cursor-pointer">
                  {allergy.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  )
}
