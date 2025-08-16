import React from 'react';
import { Code, Zap, Users, Target, Brain, Clock } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutUs: React.FC = () => {
  const features: FeatureCard[] = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms that understand code structure, dependencies, and patterns across any repository."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Minutes, Not Weeks",
      description: "Transform weeks of manual code exploration into comprehensive insights delivered in just minutes."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Support for all major programming languages and frameworks, adapting to your technology stack."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Insights",
      description: "Get actionable insights about code quality, architecture patterns, and potential improvement areas."
    }
  ];

  const stats = [
    { number: "10x", label: "Faster Onboarding" },
    { number: "500+", label: "Repositories Analyzed" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "24/7", label: "Available" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Brain className="w-8 h-8 text-blue-800" style={{ color: '#1E3A8A' }} />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-800" style={{ color: '#1E3A8A' }}>Onboard AI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing how developers understand and navigate codebases. 
              Our AI-powered platform transforms weeks of repository exploration into minutes of intelligent analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Every developer knows the frustration of joining a new project or exploring an unfamiliar codebase. 
                Hours turn into days, days into weeks, as you try to understand the architecture, dependencies, 
                and logic flow.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe there's a better way. Our AI doesn't just scan code—it understands it. It identifies 
                patterns, maps relationships, and provides intelligent insights that would take human developers 
                weeks to discover manually.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6" style={{ color: '#1E3A8A' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Understanding</h3>
                  <p className="text-gray-600">From confusion to clarity in minutes</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#1E3A8A' }}>
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How We're Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI doesn't just read code—it comprehends architecture, identifies patterns, 
              and delivers insights that matter.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <div style={{ color: '#1E3A8A' }}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Vision</h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              We envision a world where understanding any codebase is as simple as having a conversation. 
              Where developers can focus on building amazing things instead of deciphering existing code.
            </p>
            
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-12 text-white" style={{ background: `linear-gradient(to right, #1E3A8A, #1e40af)` }}>
              <h3 className="text-2xl font-bold mb-6">The Future of Code Understanding</h3>
              <p className="text-xl opacity-90 leading-relaxed">
                "Every repository tells a story. Our AI helps you read that story, understand its plot, 
                and find your place in it—all in the time it takes to grab a coffee."
              </p>
              <div className="mt-8 flex items-center justify-center space-x-4">
                <Users className="w-8 h-8 opacity-80" />
                <span className="text-lg font-medium">Built by developers, for developers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who've already discovered the power of AI-assisted code understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 hover:transform hover:scale-105"
              style={{ backgroundColor: '#1E3A8A' }}
            >
              Get Started Today
            </button>
            {/* <button className="px-8 py-4 border-2 rounded-lg font-semibold text-gray-700 border-gray-300 hover:border-gray-400 transition-all duration-300">
              Watch Demo
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;