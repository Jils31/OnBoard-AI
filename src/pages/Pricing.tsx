
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";
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
    productId: ""
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
    productId: "16c1bcc2-bac7-4444-85e8-e0872f90e224"
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
    productId: "843c09eb-c979-4946-a9db-5e58baf9b560"
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
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose the plan that's right for you and start accelerating your development team's onboarding process.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const buttonProps = getButtonProps(plan);
          const isCurrentPlan = subscription && subscription.plan_type === plan.name.toLowerCase();
          
          return (
            <Card 
              key={plan.name} 
              className={`flex flex-col ${plan.highlight ? 'border-blue-500 dark:border-blue-400 shadow-lg' : ''} ${isCurrentPlan ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlight && <Badge>Popular</Badge>}
                  {isCurrentPlan && <Badge variant="outline">Current</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400"> {plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  {...buttonProps}
                  onClick={() => handlePlanSelection(plan.name, plan.productId)}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <div>
            <h3 className="font-bold mb-2">Can I upgrade or downgrade at any time?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, you can upgrade your plan at any time. Downgrades will take effect at the end of your current billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Do unused analyses roll over?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              No, the analysis quota resets at the beginning of each billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We accept all major credit cards and PayPal through our secure payment processor.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Is there a contract or commitment?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              No, all plans are month-to-month and you can cancel at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
