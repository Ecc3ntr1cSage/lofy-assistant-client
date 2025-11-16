import React from 'react';

const Features = () => {
    const features = [
        {
            title: "AI-Powered Assistance",
            description: "Get intelligent help with your daily tasks using advanced AI technology.",
            icon: "🤖"
        },
        {
            title: "Smart Automation",
            description: "Automate repetitive tasks and streamline your workflow effortlessly.",
            icon: "⚡"
        },
        {
            title: "Real-time Collaboration",
            description: "Work together with your team in real-time with seamless collaboration tools.",
            icon: "👥"
        },
        {
            title: "Data Analytics",
            description: "Get insights from your data with powerful analytics and reporting features.",
            icon: "📊"
        },
        {
            title: "Cross-Platform Support",
            description: "Access your assistant from any device, anywhere, anytime.",
            icon: "📱"
        },
        {
            title: "Secure & Private",
            description: "Your data is protected with enterprise-grade security and privacy measures.",
            icon: "🔒"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Powerful Features
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover all the amazing features that make our AI assistant the perfect companion for your productivity needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                        Get Started Today
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Features;