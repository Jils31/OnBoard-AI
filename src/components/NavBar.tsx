
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { Menu, X, LogOut, User } from 'lucide-react';
import Logo from './Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const subscription = useSubscription();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button variant={isActive('/') ? 'default' : 'ghost'}>
              Home
            </Button>
          </Link>
          
          {user && (
            <>
              <Link to="/dashboard">
                <Button variant={isActive('/dashboard') ? 'default' : 'ghost'}>
                  Dashboard
                </Button>
              </Link>
              
              <Link to="/history">
                <Button variant={isActive('/history') ? 'default' : 'ghost'}>
                  History
                </Button>
              </Link>
            </>
          )}
          
          <Link to="/pricing">
            <Button variant={isActive('/pricing') ? 'default' : 'ghost'}>
              Pricing
            </Button>
          </Link>
        </div>
        
        {/* User section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {subscription && (
                <Badge variant={subscription.plan_type === 'free' ? 'outline' : (subscription.plan_type === 'premium' ? 'secondary' : 'default')}>
                  {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/dashboard">
                    <DropdownMenuItem>
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/pricing">
                    <DropdownMenuItem>
                      Subscription
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t px-4 py-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <Button variant={isActive('/') ? 'default' : 'ghost'} className="w-full justify-start">
                Home
              </Button>
            </Link>
            
            {user && (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant={isActive('/dashboard') ? 'default' : 'ghost'} className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                
                <Link to="/history" onClick={() => setIsMenuOpen(false)}>
                  <Button variant={isActive('/history') ? 'default' : 'ghost'} className="w-full justify-start">
                    History
                  </Button>
                </Link>
              </>
            )}
            
            <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
              <Button variant={isActive('/pricing') ? 'default' : 'ghost'} className="w-full justify-start">
                Pricing
              </Button>
            </Link>
            
            <div className="border-t pt-2 mt-2">
              {user ? (
                <>
                  <div className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </div>
                  {subscription && (
                    <div className="px-3 py-1">
                      <Badge variant={subscription.plan_type === 'free' ? 'outline' : (subscription.plan_type === 'premium' ? 'secondary' : 'default')}>
                        {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan
                      </Badge>
                    </div>
                  )}
                  <Button variant="ghost" className="w-full justify-start mt-2" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
