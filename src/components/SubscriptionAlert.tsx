
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { polarService } from "@/services/PolarService";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionAlertProps {
  currentPlan: 'free' | 'premium' | 'unlimited';
  analysisCounts: number;
  analysisLimit: number;
}

export const SubscriptionAlert: React.FC<SubscriptionAlertProps> = ({ 
  currentPlan, 
  analysisCounts, 
  analysisLimit 
}) => {
  const { toast } = useToast();

  const handleUpgrade = async (productId: string) => {
    try {
      const checkoutUrl = await polarService.createCheckout(productId);
      window.location.href = checkoutUrl;
    } catch (error) {
      toast({
        title: "Upgrade Error",
        description: "Could not initiate checkout. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (currentPlan === 'free' && analysisCounts >= analysisLimit) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Analysis Limit Reached</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>You have reached the analysis limit for your current plan. Upgrade to continue analyzing repositories.</span>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              onClick={() => handleUpgrade('16c1bcc2-bac7-4444-85e8-e0872f90e224')}
            >
              Upgrade to Premium
            </Button>
            <Button 
              onClick={() => handleUpgrade('843c09eb-c979-4946-a9db-5e58baf9b560')}
            >
              Upgrade to Unlimited
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (currentPlan === 'premium' && analysisCounts >= analysisLimit) {
    return (
      <Alert variant="default" className="mb-4">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertTitle>Premium Plan Limit Reached</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>You have reached the monthly analysis limit for your Premium plan. Upgrade to continue analyzing repositories.</span>
          <Button 
            onClick={() => handleUpgrade('843c09eb-c979-4946-a9db-5e58baf9b560')}
          >
            Upgrade to Unlimited
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
