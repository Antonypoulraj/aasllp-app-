
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: 'Login Failed',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to AERO AUTOSPACE LLP',
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid username or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/verification-mail');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 text-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Company Branding */}
        <div className="text-center mb-8">
          <h1 className="font-times text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            AERO AUTOSPACE LLP
          </h1>
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center shadow-inner">
            <span className="text-xl font-times font-bold text-blue-600">LOGO</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border border-gray-200">
          <CardHeader className="text-center pb-4">
            <h2 className="font-times text-xl font-semibold text-gray-800">Login</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-times text-sm text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  placeholder="Enter username"
                  className="font-times text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-times text-sm text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={20}
                    placeholder="Enter password"
                    className="font-times text-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-times text-sm py-2 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="flex justify-between text-xs pt-2">
                <button
                  type="button"
                  className="font-times text-blue-600 hover:underline"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  className="font-times text-blue-600 hover:underline"
                  onClick={() => navigate('/create-account')}
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="font-times text-xs text-gray-600 mb-2">Demo Credentials:</p>
              <p className="font-times text-xs text-gray-500">Admin: admin / admin123</p>
              <p className="font-times text-xs text-gray-500">Guest: guest / guest123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
