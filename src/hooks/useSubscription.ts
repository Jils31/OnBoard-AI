// import { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client';

// type PlanType = 'free' | 'premium' | 'unlimited';

// export const useSubscription = () => {
//   const [subscription, setSubscription] = useState<{
//     plan_type: PlanType;
//     analysisCounts: number;
//     analysisLimit: number;
//   } | null>(null);

//   const fetchSubscriptionInfo = async () => {
//     const { data: { user }, error: userError } = await supabase.auth.getUser();
    
//     if (!user) {
//       console.warn("No user found", userError);
//       return null;
//     }

//     console.log("User ID:", user.id);

//     const { data: subscriptionData, error: subscriptionError } = await supabase
//       .from('subscriptions')
//       .select('plan_type')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false })
//       .limit(1)
//       .maybeSingle();

//     if (subscriptionError) {
//       console.error('Subscription fetch error:', subscriptionError);
//       return null;
//     }

//     if (!subscriptionData) {
//       console.warn('No subscription found for user:', user.id);
//       return {
//         plan_type: 'free' as PlanType,
//         analysisCounts: 0,
//         analysisLimit: 5,
//       };
//     }

//     const { data: analysisCountData, error: analysisCountError } = await supabase
//       .rpc('get_user_analysis_count', { user_uuid: user.id });

//     const { data: subscriptionLimitData, error: subscriptionLimitError } = await supabase
//       .rpc('get_user_subscription_limit', { user_uuid: user.id });

//     if (analysisCountError || subscriptionLimitError) {
//       console.error('Analysis count/limit error', analysisCountError, subscriptionLimitError);
//       return null;
//     }

//     const planType = subscriptionData.plan_type;
//     if (planType !== 'free' && planType !== 'premium' && planType !== 'unlimited') {
//       console.error('Invalid plan type:', planType);
//       return null;
//     }

//     console.log("Returning subscription info:", {
//       plan_type: planType,
//       analysisCounts: analysisCountData ?? 0,
//       analysisLimit: subscriptionLimitData ?? 0,
//     });

//     return {
//       plan_type: planType as PlanType,
//       analysisCounts: analysisCountData ?? 0,
//       analysisLimit: subscriptionLimitData ?? 0,
//     };
//   };

//   useEffect(() => {
//     const load = async () => {
//       const result = await fetchSubscriptionInfo();
//       setSubscription(result);
//     };
//     load();
//   }, []);

//   return subscription;
// };
