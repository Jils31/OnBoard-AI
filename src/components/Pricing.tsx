import React from "react";
import { motion } from "framer-motion";
import {Button} from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react'

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Free",
      description: "For personal projects and exploration",
      price: "$0",
      period: "forever",
      features: [
        "1 repository analysis per month",
        "Basic code structure visualization",
        "Limited documentation generation",
        "Community support",
      ],
      buttonText: "Start Free",
      highlight: false,
      productId: "",
    },
    {
      name: "Premium",
      description: "For professional developers",
      price: "$19.99",
      period: "per month",
      features: [
        "7 repository analyses per month",
        "Advanced visualization tools",
        "Full documentation generation",
        "Critical path analysis",
        "Priority support",
      ],
      buttonText: "Get Premium",
      highlight: true,
      productId: import.meta.env.VITE_POLAR_PRODUCT_ID_PREMIUM,
    },
    {
      name: "Unlimited",
      description: "For teams and organizations",
      price: "$99.99",
      period: "per month",
      features: [
        "30 repository analyses per month",
        "Team collaboration features",
        "Custom onboarding workflows",
        "Advanced analytics",
        "API access",
        "Dedicated support",
      ],
      buttonText: "Contact Us",
      highlight: false,
      productId: import.meta.env.VITE_POLAR_PRODUCT_ID_UNLIMITED,
    },
  ];
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Choose the plan that works best for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                plan.highlight
                  ? "border-blue-500 dark:border-blue-400 scale-105 relative"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                  <Badge className="bg-blue-600 hover:bg-blue-700 mx-auto">
                    Most Popular
                  </Badge>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pricing">
                  <Button
                    className={`w-full ${
                      plan.highlight
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
