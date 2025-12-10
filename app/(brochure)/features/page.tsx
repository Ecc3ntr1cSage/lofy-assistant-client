import React from "react";
import AppNavbar from "@/components/app-navbar";

const Features = () => {
  const features = [
    {
      title: "AI-Powered Assistance",
      description:
        "Get intelligent help with your daily tasks using advanced AI technology.",
      icon: "🤖",
    },
    {
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and streamline your workflow effortlessly.",
      icon: "⚡",
    },
    {
      title: "Real-time Collaboration",
      description:
        "Work together with your team in real-time with seamless collaboration tools.",
      icon: "👥",
    },
    {
      title: "Data Analytics",
      description:
        "Get insights from your data with powerful analytics and reporting features.",
      icon: "📊",
    },
    {
      title: "Cross-Platform Support",
      description: "Access your assistant from any device, anywhere, anytime.",
      icon: "📱",
    },
    {
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security and privacy measures.",
      icon: "🔒",
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <AppNavbar />
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Powerful Features
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Discover all the amazing features that make our AI assistant the
            perfect companion for your productivity needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;
