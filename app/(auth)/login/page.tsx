"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { motion } from "motion/react"
import { toast } from "sonner"

const loginSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string()
    .min(8, "Phone number must be valid")
    .max(15, "Phone number must be valid")
    .regex(/^\d{8,15}$/, "Phone number must contain only digits"),
  pin: z.string()
    .min(6, "PIN must be 6 digits")
    .max(6, "PIN must be 6 digits")
    .regex(/^\d{6}$/, "PIN must contain only digits")
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      countryCode: "60",
      phoneNumber: "1128532005",
      pin: "000000"
    }
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const phoneNumber = `${data.countryCode}${data.phoneNumber}`

      // Call our login API route
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          pin: data.pin
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Console log the token from cookies
        const cookies = document.cookie.split(';')
        const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session='))
        const token = sessionCookie ? sessionCookie.split('=')[1] : null

        toast.success("Login successful!")
        console.log("🔐 Session Token:", token)
        console.log("👤 User Data:", result.user)
        console.log("✅ Login Successful")

        // Handle successful login - redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        toast.error(result.error || "Login failed")
        console.error("❌ Login Error:", result.error)
      }
    } catch (error) {
      toast.error("Login failed. Please try again.")
      console.error("💥 Network Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="min-h-screen flex items-center justify-center">
          <Card className="min-w-sm mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Enter your phone number and PIN to sign in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Phone Number Field */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={() => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <div className="flex items-start gap-2">
                          <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="60">+60</SelectItem>
                                  <SelectItem value="1">+1</SelectItem>
                                  <SelectItem value="44">+44</SelectItem>
                                  <SelectItem value="65">+65</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <div className="flex-1 space-y-1">
                            <FormField
                              control={form.control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    placeholder="123123123"
                                    {...field}
                                    maxLength={11}
                                  />
                                </FormControl>
                              )}
                            />
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* PIN Field */}
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6-Digit PIN</FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <InputOTPGroup className="gap-1">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AuroraBackground >
  )
}
