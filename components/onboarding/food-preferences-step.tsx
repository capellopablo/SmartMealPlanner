"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FoodPreferencesStepProps {
  onComplete: (data: any) => void
}

export default function FoodPreferencesStep({ onComplete }: FoodPreferencesStepProps) {
  const [dislikedInput, setDislikedInput] = useState("")
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>([])

  const addDisliked = () => {
    if (dislikedInput.trim() && !dislikedIngredients.includes(dislikedInput.trim())) {
      setDislikedIngredients((prev) => [...prev, dislikedInput.trim()])
      setDislikedInput("")
    }
  }

  const removeDisliked = (ingredient: string) => {
    setDislikedIngredients((prev) => prev.filter((item) => item !== ingredient))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onComplete({
      foodPreferences: {
        favoriteIngredients: [],
        dislikedIngredients,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Ingredients to Exclude</h2>
        <p className="text-gray-600">Tell us about ingredients you'd rather avoid in your meals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="text-base font-medium">Disliked Ingredients</Label>
          <p className="text-sm text-gray-600 mb-3">Add ingredients you prefer to avoid</p>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="e.g., mushrooms, cilantro, olives"
              value={dislikedInput}
              onChange={(e) => setDislikedInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDisliked())}
            />
            <Button type="button" onClick={addDisliked} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {dislikedIngredients.map((ingredient) => (
              <Badge key={ingredient} variant="destructive" className="flex items-center gap-1">
                {ingredient}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeDisliked(ingredient)} />
              </Badge>
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
