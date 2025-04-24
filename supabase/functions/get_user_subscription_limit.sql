
CREATE OR REPLACE FUNCTION public.get_user_subscription_limit(user_uuid uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  plan TEXT;
  limit_value INTEGER;
BEGIN
  SELECT plan_type INTO plan 
  FROM public.subscriptions 
  WHERE user_id = user_uuid 
  AND (expires_at IS NULL OR expires_at > NOW()) 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF plan = 'free' THEN
    limit_value := 2;
  ELSIF plan = 'premium' THEN
    limit_value := 7;
  ELSIF plan = 'unlimited' THEN
    limit_value := 30;
  ELSE 
    limit_value := 0;
  END IF;
  
  RETURN limit_value;
END;
$function$;
