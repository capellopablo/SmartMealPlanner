"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface GoalsStepProps {
  onComplete: (data: any) => void
}

export default function GoalsStep({ onComplete }: GoalsStepProps) {
  const [selectedGoal, setSelectedGoal] = useState("")
  const [error, setError] = useState("")

  const goals = [
    {
      value: "lose_weight",
      title: "Lose Weight",
      description: "Create a caloric deficit to help you lose weight safely",
    },
    {
      value: "maintain",
      title: "Maintain Weight",
      description: "Keep your current weight with balanced nutrition",
    },
    {
      value: "gain_muscle",
      title: "Gain Muscle",
      description: "Build lean muscle mass with protein-rich meals",
    },
    {
      value: "gain_weight",
      title: "Gain Weight",
      description: "Healthy weight gain with nutrient-dense foods",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedGoal) {
      setError("Please select your goal")
      return
    }

    onComplete({
      goals: {
        goal: selectedGoal as "lose_weight" | "maintain" | "gain_muscle" | "gain_weight",
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">What's Your Goal?</h2>
        <p className="text-gray-600">This helps us tailor your meal plans and calorie recommendations</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <RadioGroup value={selectedGoal} onValueChange={setSelectedGoal}>
          {goals.map((goal) => (
            <div key={goal.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={goal.value} id={goal.value} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={goal.value} className="text-base font-medium cursor-pointer">
                  {goal.title}
                </Label>
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  )
}
