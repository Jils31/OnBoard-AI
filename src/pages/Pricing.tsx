
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, Shield, Zap, Crown, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { polarService } from "@/services/PolarService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
      "Community support"
    ],
    buttonText: "Current Plan",
    highlight: false,
    productId: "",
    icon: Shield,
    color: "text-gray-600"
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
      "Priority support"
    ],
    buttonText: "Upgrade to Premium",
    highlight: true,
    productId: import.meta.env.VITE_POLAR_PRODUCT_ID_PREMIUM,
    icon: Zap,
    color: "text-blue-600"
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
      "Dedicated support"
    ],
    buttonText: "Upgrade to Unlimited",
    highlight: false,
    productId: import.meta.env.VITE_POLAR_PRODUCT_ID_UNLIMITED,
    icon: Crown,
    color: "text-purple-600"
  }
];

const Pricing = () => {
  const { user } = useAuth();
  const subscription = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handlePlanSelection = async (plan: string, productId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (plan === "Free" || (subscription && subscription.plan_type === plan.toLowerCase())) {
      return;
    }

    try {
      setProcessingPlan(plan);
      const checkoutUrl = await polarService.createCheckout(productId);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Checkout Error",
        description: "There was an error starting the checkout process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const getButtonProps = (plan: typeof plans[0]) => {
    const isCurrentPlan = subscription && subscription.plan_type === plan.name.toLowerCase();
    const isFree = plan.name === "Free";
    
    if (isCurrentPlan) {
      return {
        variant: "secondary" as const,
        disabled: true,
        children: "Current Plan"
      };
    }
    
    if (isFree) {
      return {
        variant: "outline" as const,
        disabled: subscription && subscription.plan_type !== "free",
        children: user ? (subscription && subscription.plan_type === "free" ? "Current Plan" : "Downgrade") : "Sign Up"
      };
    }
    
    return {
      variant: plan.highlight ? "default" as const : "outline" as const,
      disabled: processingPlan === plan.name,
      children: processingPlan === plan.name ? "Processing..." : plan.buttonText
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24">
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Pricing Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that's right for you and start accelerating your development team's onboarding process.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => {
            const buttonProps = getButtonProps(plan);
            const isCurrentPlan = subscription && subscription.plan_type === plan.name.toLowerCase();
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.name} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.highlight 
                    ? 'border-blue-200 dark:border-blue-700 shadow-lg scale-105' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${isCurrentPlan ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-800'}`}
              >
                {/* Subtle gradient overlay for highlighted plan */}
                {plan.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none" />
                )}
                
                <CardHeader className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                        <IconComponent className={`h-5 w-5 ${plan.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {plan.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {plan.highlight && (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-0">
                          Most Popular
                        </Badge>
                      )}
                      {isCurrentPlan && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-lg">
                      /{plan.period}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mt-0.5">
                          <CheckIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="relative">
                  <Button 
                    className={`w-full h-11 font-medium transition-all duration-200 ${
                      plan.highlight 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                        : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                    }`}
                    {...buttonProps}
                    onClick={() => handlePlanSelection(plan.name, plan.productId)}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        {/* FAQ Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about our pricing and plans.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Can I upgrade or downgrade at any time?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Yes, you can upgrade your plan at any time. Downgrades will take effect at the end of your current billing cycle.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Do unused analyses roll over?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              No, the analysis quota resets at the beginning of each billing cycle.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              We accept all major credit cards and PayPal through our secure payment processor.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Is there a contract or commitment?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              No, all plans are month-to-month and you can cancel at any time.
            </p>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 14-day free trial
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Need a custom plan? <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Contact us</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
