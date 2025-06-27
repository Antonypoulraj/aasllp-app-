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
        description: "Please fill in all fields.",
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
          description: `Welcome ${username}`,
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-times text-gray-800">AERO AUTOSPACE LLP</h1>
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto my-4 flex items-center justify-center text-xl text-gray-600 font-semibold font-times">
            LOGO
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-md">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-bold font-times">Login</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <Label htmlFor="username" className="text-sm font-times">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  maxLength={20}
                  className="mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-sm font-times">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    maxLength={20}
                    className="pr-10 mt-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-times"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              {/* Links */}
              <div className="flex justify-between text-sm text-blue-600 pt-2">
                <button type="button" onClick={() => navigate('/verification-mail')} className="hover:underline">
                  Forgot Password?
                </button>
                <button type="button" onClick={() => navigate('/create-account')} className="hover:underline">
                  Create Account
                </button>
              </div>

              {/* Demo Credentials */}
              <div className="mt-5 bg-gray-50 p-3 rounded-lg text-xs text-gray-600 font-times">
                <p className="mb-1">Demo Credentials:</p>
                <p>Admin: <code>admin / admin123</code></p>
                <p>Guest: <code>guest / guest123</code></p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;