import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Nav from "@/components/nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">Welcome to SmartMealPlanner</h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your meals, track your nutrition, and achieve your health goals with our intelligent meal planning
              platform.
            </p>
            <div className="mt-10">
              <Link href="/auth/signup">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Features</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to plan your perfect meals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Smart Planning</h3>
                <p className="text-gray-600">
                  AI-powered meal suggestions based on your preferences and dietary requirements.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Nutrition Tracking</h3>
                <p className="text-gray-600">Track calories, macros, and nutrients to meet your health goals.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Shopping Lists</h3>
                <p className="text-gray-600">Automatically generated shopping lists based on your meal plans.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Planning?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of users who are already planning smarter meals.</p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
