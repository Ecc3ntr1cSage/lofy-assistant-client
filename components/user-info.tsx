"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UserInfo() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Not authenticated</div>
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Name</p>
          <p className="text-sm text-gray-600">{session.user?.name || "Not set"}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Phone</p>
          <p className="text-sm text-gray-600">{session.user?.phone || "Not set"}</p>
        </div>
        <div>
          <p className="text-sm font-medium">User ID</p>
          <p className="text-sm text-gray-600">{session.user?.id}</p>
        </div>
        <Button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          variant="outline"
          className="w-full"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
}
