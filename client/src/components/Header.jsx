import { useAuth } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Search } from 'lucide-react';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();

  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    // Extract name from email or use email
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  return (
    <header className="bg-card border-b border-border p-6" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" data-testid="header-title">{title}</h2>
          <p className="text-muted-foreground" data-testid="header-subtitle">
            {subtitle}, <span className="font-medium">{getUserDisplayName()}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button variant="ghost" size="sm" data-testid="button-search">
            <Search className="w-5 h-5" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
              3
            </span>
          </Button>
          
          {/* Profile */}
          <div className="flex items-center space-x-2">
            <Avatar data-testid="avatar-user">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user?.email)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
