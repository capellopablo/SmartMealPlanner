"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CaloriesStepProps {
  onComplete: (data: any) => void
}

export default function CaloriesStep({ onComplete }: CaloriesStepProps) {
  const [calorieOption, setCalorieOption] = useState("no_limit")
  const [customCalories, setCustomCalories] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (calorieOption === "custom_limit") {
      const calories = Number.parseInt(customCalories)
      if (!calories || calories < 800 || calories > 5000) {
        setError("Por favor ingresa una cantidad válida de calorías entre 800 y 5000")
        return
      }

      onComplete({
        calories: {
          maxDailyCalories: calories,
        },
      })
    } else {
      onComplete({
        calories: {
          maxDailyCalories: undefined, // Will be calculated automatically
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Daily Calorie Limit</h2>
        <p className="text-gray-600">Would you like to set a daily calorie limit for your meals?</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup value={calorieOption} onValueChange={setCalorieOption}>
          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <RadioGroupItem value="no_limit" id="no_limit" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="no_limit" className="text-base font-medium cursor-pointer">
                No pretendo setear un límite de calorías diario
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                La aplicación generará recetas equilibradas en nutrientes sin un cálculo específico de calorías diarias
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <RadioGroupItem value="custom_limit" id="custom_limit" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="custom_limit" className="text-base font-medium cursor-pointer">
                Quiero setear un límite de calorías diarias
              </Label>
              <p className="text-sm text-gray-600 mt-1 mb-3">Estableceré mi propio límite diario de calorías</p>
              {calorieOption === "custom_limit" && (
                <div className="mt-3">
                  <Label htmlFor="customCalories" className="text-sm">
                    Daily Calorie Limit
                  </Label>
                  <Input
                    id="customCalories"
                    type="number"
                    placeholder="2000"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        </RadioGroup>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Información importante</h4>
          <p className="text-sm text-blue-800">
            Puedes cambiar esta configuración más adelante en tu perfil. Si no estableces un límite, nos enfocaremos en
            crear comidas equilibradas y nutritivas.
          </p>
        </div>

        <Button type="submit" className="w-full">
          Completar Configuración
        </Button>
      </form>
    </div>
  )
}
