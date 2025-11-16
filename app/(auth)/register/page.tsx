"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background"
import { motion } from "motion/react";

interface FormData {
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  question1: string;
  question2: string;
  question3: string;
  pin: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    countryCode: "60",
    phoneNumber: "",
    question1: "",
    question2: "",
    question3: "",
    pin: "",
  });

  const totalSteps = 3;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.question1) {
      toast.error("Please answer question 1");
      return false;
    }
    if (!formData.question2) {
      toast.error("Please answer question 2");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.pin.length !== 6) {
      toast.error("Please enter a 6-digit PIN");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhoneNumber,
          pin: formData.pin,
          question1: formData.question1,
          question2: formData.question2,
          question3: formData.question3,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success(data.isNewUser ? "Registration successful!" : "Profile completed successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-center">
                Step {currentStep} of {totalSteps}
              </CardDescription>
              <div className="flex gap-2 mt-4">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-all ${index + 1 <= currentStep
                      ? "bg-primary"
                      : "bg-muted"
                      }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => updateFormData("countryCode", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">+60</SelectItem>
                          <SelectItem value="1">+1</SelectItem>
                          <SelectItem value="44">+44</SelectItem>
                          <SelectItem value="65">+65</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="123456789"
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData("phoneNumber", e.target.value.replace(/\D/g, ""))}
                        maxLength={11}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Onboarding Questions */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="question1">What is your professional background?</Label>
                    <Select
                      value={formData.question1}
                      onValueChange={(value) => updateFormData("question1", value)}
                    >
                      <SelectTrigger id="question1">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="full-time">Employed Full-Time</SelectItem>
                        <SelectItem value="part-time">Employed Part-Time</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="neet">NEET</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question2">Where did you know Lofy from?</Label>
                    <Select
                      value={formData.question2}
                      onValueChange={(value) => updateFormData("question2", value)}
                    >
                      <SelectTrigger id="question2">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="search-engine">Search Engine</SelectItem>
                        <SelectItem value="friend-colleague">Friend or Colleague</SelectItem>
                        <SelectItem value="online-advertisement">Online Advertisement</SelectItem>
                        <SelectItem value="article-blog">Article or Blog</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question3">
                      Tell Lofy more about yourself. (optional)
                    </Label>
                    <textarea
                      id="question3"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Share any additional information that would help us serve you better..."
                      value={formData.question3}
                      onChange={(e) => updateFormData("question3", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Create PIN */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <Label className="text-lg">Create Your 6-Digit PIN</Label>
                      <p className="text-sm text-muted-foreground">
                        This PIN will be used to secure your account
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={formData.pin}
                        onChange={(value) => updateFormData("pin", value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isLoading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} disabled={isLoading}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
