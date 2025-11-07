"use client";

import Link from "next/link";
import AppNavBar from "@/components/app-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { BentoFeatures } from "@/components/bento-features";
import { useEffect } from "react";

// Extend the Window interface to include UnicornStudio
declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean;
      init: () => void;
    };
  }
}

export default function Home() {
  useEffect(() => {
    // Initialize UnicornStudio only on the client side
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false, init: () => { } };
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(script);
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      <AppNavBar />
      {/* Top-right unicorn.studio element (fixed, sits still) */}
      <div
        className="fixed pointer-events-none -top-20 right-20 z-[-5] "
        aria-hidden="true"
      >
        <div
          data-us-project="8sHyXD7I66ltEy9jeNC0"
          style={{ width: "1080px", height: "1200px" }}
        ></div>
      </div>

      <section className="relative h-svh flex overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/10 w-96 h-96 bg-linear-to-r from-purple-400/30 to-teal-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-linear-to-r from-violet-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse "></div>
          <div className="absolute bottom-1/4 left-1/10 w-96 h-96 bg-linear-to-r from-green-400/30 to-fuchsia-400/30 rounded-full blur-3xl animate-pulse "></div>
        </div>

        <div className="max-w-7xl mx-auto flex-1 grid grid-rows-1 grid-cols-1 h-[calc(100vh-6rem)]">
          <div className="self-center justify-self-start px-4 sm:px-6 md:px-8 relative z-10">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="px-4 py-2 bg-linear-to-r from-emerald-400/30 to-indigo-500/40 border border-white backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span className="text-xs bg-linear-to-r from-emerald-800 to-indigo-800 bg-clip-text text-transparent">
                  ✨ AI-Powered Productivity Application
                </span>
              </Badge>
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-8xl font-bold bg-linear-to-r from-emerald-700/80 via-indigo-700/80 to-emerald-700 bg-clip-text text-transparent leading-tight">
                  Lofy ;
                </h1>
                <p className="text-lg lg:text-xl text-gray-800 max-w-2xl leading-relaxed ">
                  Meet your new right hand man.<br /> An Agentic AI Personal Assistant that get things done.
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild
                size="lg"
                className="text-lg text-secondary px-8 py-6 bg-linear-to-r from-emerald-600/80 to-indigo-600/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/auth/register">🤖 Try Lofy Now</Link>
              </Button>
              <Button asChild
                variant="link"
                size="lg"
                className="text-lg px-8 py-6  transition-all duration-300 hover:scale-105 text-muted-foreground"
              >
                <Link href="/auth/login">Learn More</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Free To Use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                <span>No Apps Download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <Badge
              variant="secondary"
              className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <span>💡</span>
              <span>Powerful Features</span>
            </Badge>
            <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Your Personal Assistant AI Agent
            </h2>
            <p className="text-md lg:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Lofy is an agentic AI personal assistant that integrates seamlessly into your workflow, understanding
              context and automating tasks to boost your productivity with
              intelligent automation.
            </p>
          </div>
          <BentoFeatures />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <Badge
              variant="secondary"
              className="mb-6 bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100"
            >
              <span>🚀</span>
              <span>Simple Process</span>
            </Badge>
            <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              How Lofy Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Simple integration, powerful results. Get started in minutes and
              see immediate productivity gains with our intelligent automation
              system.
            </p>
          </div>

          <div className="relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-linear-to-r from-blue-200 via-purple-200 to-green-200"></div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="relative group">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                  1
                </div>
                <Card className="pt-8 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <CardContent className="text-center space-y-4">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Connect
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Link your email, calendar, and productivity tools in
                      seconds with secure OAuth integration
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative group">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                  2
                </div>
                <Card className="pt-8 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <CardContent className="text-center space-y-4">
                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Learn
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Lofy analyzes your patterns and preferences automatically
                      to understand your workflow
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative group">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                  3
                </div>
                <Card className="pt-8 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <CardContent className="text-center space-y-4">
                    <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Act
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      AI takes action on your behalf, handling routine tasks and
                      automating your workflow
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative group">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                  4
                </div>
                <Card className="pt-8 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <CardContent className="text-center space-y-4">
                    <div className="w-16 h-16 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Thrive
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Focus on what matters while Lofy handles the rest,
                      boosting your productivity exponentially
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <Badge
              variant="secondary"
              className="mb-6 bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
            >
              <span>💎</span>
              <span>Why Choose Lofy</span>
            </Badge>
            <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Transform Your Productivity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who have transformed their
              productivity with AI assistance. Experience the future of work
              today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <CardContent className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                    Save 10+ Hours Weekly
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    Automate email management, scheduling, and routine tasks to
                    reclaim your time for high-value work and strategic
                    thinking.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <CardContent className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zm0 10h8l-2.586 2.586a2 2 0 01-2.828 0L4.828 17z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                    Never Miss Important
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    AI-powered prioritization ensures urgent matters get your
                    attention while filtering out noise and distractions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <CardContent className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                    Work-Life Balance
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    Reduce stress and overwhelm by letting AI handle the
                    administrative burden of modern work life.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <CardContent className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                    Enterprise Security
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    Bank-grade encryption and compliance ensure your data stays
                    private and secure at all times.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <CardContent className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                    Seamless Integration
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    Works with your existing tools - no disruption to your
                    current workflow or established habits.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <CardContent className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                    24/7 Availability
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    Your AI assistant never sleeps, handling tasks around the
                    clock so you can focus on strategy and innovation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/20 px-6 py-3"
              >
                <span>🚀</span>
                <span>Ready to Get Started?</span>
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Ready to Transform Your
                <span className="block bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Productivity?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Join the productivity revolution. Start your free trial today
                and experience the power of AI assistance that works seamlessly
                in your inbox.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="text-xl px-12 py-8 bg-white text-blue-600 hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                🚀 Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-xl px-12 py-8 border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                📺 Watch Demo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
            <div className="pt-8">
              <p className="text-blue-200 text-sm">
                Trusted by 10,000+ professionals worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
