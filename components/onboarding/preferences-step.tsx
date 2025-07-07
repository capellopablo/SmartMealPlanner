"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PreferencesStepProps {
  onComplete: (data: any) => void
}

export default function PreferencesStep({ onComplete }: PreferencesStepProps) {
  const [selectedDiet, setSelectedDiet] = useState("")
  const [error, setError] = useState("")

  const dietTypes = [
    {
      value: "omnivore",
      title: "Omnivore",
      description: "I eat all types of food including meat, fish, and plants",
    },
    {
      value: "vegetarian",
      title: "Vegetarian",
      description: "I don't eat meat but consume dairy and eggs",
    },
    {
      value: "vegan",
      title: "Vegan",
      description: "I only eat plant-based foods",
    },
    {
      value: "keto",
      title: "Ketogenic",
      description: "High-fat, low-carb diet for ketosis",
    },
    {
      value: "paleo",
      title: "Paleo",
      description: "Whole foods, no processed foods, grains, or legumes",
    },
    {
      value: "mediterranean",
      title: "Mediterranean",
      description: "Rich in fruits, vegetables, fish, and olive oil",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDiet) {
      setError("Please select your diet preference")
      return
    }

    onComplete({
      preferences: {
        dietType: selectedDiet as "omnivore" | "vegetarian" | "vegan" | "keto" | "paleo" | "mediterranean",
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Diet Preferences</h2>
        <p className="text-gray-600">What type of diet do you follow or prefer?</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <RadioGroup value={selectedDiet} onValueChange={setSelectedDiet}>
          {dietTypes.map((diet) => (
            <Label
              key={diet.value}
              htmlFor={diet.value}
              className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300"
            >
              <RadioGroupItem value={diet.value} id={diet.value} className="mt-1" />
              <div className="flex-1">
                <span className="text-base font-medium">{diet.title}</span>
                <p className="text-sm text-gray-600 mt-1">{diet.description}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  )
}
