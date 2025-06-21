import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
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
        title: "Login Failed",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to AERO AUTOSPACE LLP",
        });
        
        // Auto-close toast after 3 seconds and navigate
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/verification-mail');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Company Name */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-times text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            AERO AUTOSPACE LLP
          </h1>
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center">
            <span className="text-lg md:text-2xl font-times font-bold text-gray-600">LOGO</span>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4 md:pb-6">
            <h2 className="font-times text-xl md:text-2xl font-bold">Login</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="username" className="font-times text-sm md:text-lg">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  className="font-times text-sm md:text-base h-10 md:h-auto"
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="password" className="font-times text-sm md:text-lg">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={20}
                    className="font-times text-sm md:text-base pr-10 h-10 md:h-auto"
                    placeholder="Enter password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Eye className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center pt-2 md:pt-4">
                <Button
                  type="submit"
                  className="font-times text-sm md:text-lg py-2 md:py-3 px-8 md:px-12 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>

              <div className="flex justify-between text-xs md:text-sm pt-2">
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

            {/* Demo Credentials */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
              <p className="font-times text-xs md:text-sm text-gray-600 mb-2">Demo Credentials:</p>
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
