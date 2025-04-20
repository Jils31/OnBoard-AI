
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<{
    plan_type: 'free' | 'premium' | 'unlimited';
    analysisCounts: number;
    analysisLimit: number;
  } | null>(null);

  const fetchSubscriptionInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Fetch subscription type
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError) {
      console.error('Subscription fetch error:', subscriptionError);
      return null;
    }

    // Get analysis counts and limits
    const { data: analysisCountData, error: analysisCountError } = await supabase
      .rpc('get_user_analysis_count', { user_uuid: user.id });

    const { data: subscriptionLimitData, error: subscriptionLimitError } = await supabase
      .rpc('get_user_subscription_limit', { user_uuid: user.id });

    if (analysisCountError || subscriptionLimitError) {
      console.error('Analysis count/limit error', analysisCountError, subscriptionLimitError);
      return null;
    }

    return {
      plan_type: subscriptionData.plan_type,
      analysisCounts: analysisCountData,
      analysisLimit: subscriptionLimitData
    };
  };

  useEffect(() => {
    const loadSubscription = async () => {
      const subscriptionInfo = await fetchSubscriptionInfo();
      setSubscription(subscriptionInfo);
    };

    loadSubscription();
  }, []);

  return subscription;
};
