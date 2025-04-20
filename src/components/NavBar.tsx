
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const subscription = useSubscription();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-lg font-bold">
          Onboarding Buddy
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {subscription && (
                <Badge variant={subscription.plan_type === 'free' ? 'outline' : (subscription.plan_type === 'premium' ? 'secondary' : 'default')}>
                  {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan
                </Badge>
              )}
              
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </div>
              
              <Button variant="ghost" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
