"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

const AccountPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setError("")

    try {
      const response = await fetch("/api/delete-account", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push("/")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setDeleteLoading(false)
      setDeleteModalOpen(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Account Settings</h1>

      {session?.user ? (
        <>
          <p>Logged in as: {session.user?.email}</p>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Delete Account
          </button>

          {deleteModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">Delete Account</h3>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  )
}

export default AccountPage
