import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Users, Settings } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, registerAdmin, user } = useAuth();
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    const dashboardPath = user.role === 'admin' ? '/admin-dashboard' : '/teacher-dashboard';
    setLocation(dashboardPath);
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to EduManage!",
      });
      
      // Redirect based on role - will be handled by auth context update
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await registerAdmin(adminForm.email, adminForm.password);
    
    if (result.success) {
      toast({
        title: "Admin Registered",
        description: "Admin account created successfully. You can now login.",
      });
      setAdminForm({ email: '', password: '' });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">EduManage</h1>
          <p className="text-muted-foreground">School Management System</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
            <TabsTrigger value="admin-setup" data-testid="tab-admin-setup">Admin Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Sign In
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" data-testid="label-email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" data-testid="label-password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      data-testid="input-password"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    data-testid="button-login"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin-setup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Setup
                </CardTitle>
                <CardDescription>
                  Create the first admin account for your school
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" data-testid="label-admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@school.edu"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      required
                      data-testid="input-admin-email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" data-testid="label-admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Create a secure password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      required
                      minLength={6}
                      data-testid="input-admin-password"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    data-testid="button-register-admin"
                  >
                    {loading ? "Creating Admin..." : "Create Admin Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>✓ Teacher & Student Management</p>
          <p>✓ Attendance & Grade Tracking</p>
          <p>✓ WhatsApp Integration</p>
        </div>
      </div>
    </div>
  );
}
