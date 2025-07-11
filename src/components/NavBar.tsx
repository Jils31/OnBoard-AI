import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { Menu, X, LogOut, User } from 'lucide-react';
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl rounded-2xl bg-white/90 backdrop-blur-lg shadow-2xl border border-blue-100 transition-all">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2">
          <span>Onboard AI</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-blue-900 font-medium">
          <Link to="/" className={`hover:text-blue-700 transition ${location.pathname === '/' ? 'text-blue-700' : ''}`}>
            Home
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className={`hover:text-blue-700 transition ${location.pathname === '/dashboard' ? 'text-blue-700' : ''}`}>
                Dashboard
              </Link>
              <Link to="/history" className={`hover:text-blue-700 transition ${location.pathname === '/history' ? 'text-blue-700' : ''}`}>
                History
              </Link>
            </>
          )}
          <Link to="/pricing" className={`hover:text-blue-700 transition ${location.pathname === '/pricing' ? 'text-blue-700' : ''}`}>
            Pricing
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Badge
                className={`rounded-full px-3 py-1 text-xs font-medium border border-blue-200 text-blue-800 bg-blue-50`}
              >
                {subscription?.plan_type.charAt(0).toUpperCase() + subscription?.plan_type.slice(1) || "Free"} Plan
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-blue-50 text-blue-900 rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-xl rounded-xl border border-blue-100 bg-white">
                  <DropdownMenuLabel className="text-blue-900 font-semibold">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>
                  <Link to="/pricing"><DropdownMenuItem>Subscription</DropdownMenuItem></Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="text-blue-900 hover:bg-blue-50 font-semibold rounded-xl px-5 py-2"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/auth">
                <Button
                  className="bg-blue-900 text-white hover:bg-blue-800 font-semibold rounded-xl px-6 py-2 shadow-md"
                >
                  Start Now
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 shadow-lg px-4 py-4 space-y-2 rounded-b-2xl">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-blue-900 font-medium">Home</Link>
          {user && (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-blue-900 font-medium">Dashboard</Link>
              <Link to="/history" onClick={() => setIsMenuOpen(false)} className="block text-blue-900 font-medium">History</Link>
            </>
          )}
          <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="block text-blue-900 font-medium">Pricing</Link>

          <div className="border-t pt-2 mt-2">
            {user ? (
              <>
                <div className="text-sm text-blue-800 mb-1">{user.email}</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-blue-900 hover:bg-blue-50"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-blue-900">Log In</Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-blue-900 text-white hover:bg-blue-800">Start Now</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
