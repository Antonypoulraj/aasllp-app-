import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { MoreVertical, Users, Clock, Wrench, Package, Factory, BarChart3, LogOut } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Portal {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  accessLevel?: 'full' | 'input' | 'none';
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const allPortals: Portal[] = [
    {
      id: 'employee',
      title: 'Employee Portal',
      icon: <Users className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      description: 'Manage employee information and records'
    },
    {
      id: 'attendance',
      title: 'Attendance Portal',
      icon: <Clock className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      description: 'Track employee attendance and leaves'
    },
    {
      id: 'toolstocks',
      title: 'Tool Stocks Portal',
      icon: <Wrench className="h-8 w-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      description: 'Manage tool inventory and stock levels'
    },
    {
      id: 'rawmaterials',
      title: 'Raw Materials Portal',
      icon: <Package className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      description: 'Track raw material inventory'
    },
    {
      id: 'production',
      title: 'Production Portal',
      icon: <Factory className="h-8 w-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      description: 'Monitor production activities'
    },
    {
      id: 'analytics',
      title: 'Analytics Portal',
      icon: <BarChart3 className="h-8 w-8" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      description: 'View reports and analytics'
    }
  ];

  // Filter portals based on user role with specific access levels
  const getPortalsWithAccess = () => {
    if (user?.role === 'guest') {
      return allPortals.filter(portal => {
        if (portal.id === 'attendance' || portal.id === 'production') {
          portal.accessLevel = 'input';
          return true;
        }
        return false;
      });
    } else if (user?.role === 'admin') {
      return allPortals.map(portal => {
        portal.accessLevel = 'full';
        return portal;
      });
    }
    return [];
  };

  const accessiblePortals = getPortalsWithAccess();

  const handlePortalClick = (portalId: string) => {
    // Navigate to the specific portal
    navigate(`/${portalId}`);
  };

  const handleMenuAction = (portalId: string, action: string) => {
    if (user?.role === 'guest' && action === 'analytics') {
      toast({
        title: "Access Denied",
        description: "Guest users don't have access to analytics features",
        variant: "destructive",
      });
      return;
    }

    if (action === 'view') {
      navigate(`/${portalId}`);
    } else if (action === 'analytics') {
      if (portalId === 'analytics') {
        navigate('/analytics');
      } else {
        // Navigate to the specific portal's analytics tab
        navigate(`/${portalId}?tab=analytics`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const getAccessLevelDisplay = (portal: Portal) => {
    if (portal.accessLevel === 'full') {
      return (
        <div className="mt-3 px-2 py-1 bg-green-100 text-green-600 text-xs font-times rounded">
          Full Access
        </div>
      );
    } else if (portal.accessLevel === 'input') {
      return (
        <div className="mt-3 px-2 py-1 bg-yellow-100 text-yellow-600 text-xs font-times rounded">
          Input Access Only
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-times font-bold text-gray-600">AL</span>
              </div>
              <h1 className="font-times text-xl font-bold text-gray-800">
                AERO AUTOSPACE LLP
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-times text-sm text-gray-600">
                  {currentTime.toLocaleDateString()}
                </p>
                <p className="font-times text-sm text-gray-600">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-times text-sm font-medium text-gray-800">
                  {user?.username}
                </p>
                <p className="font-times text-xs text-gray-500 capitalize">
                  {user?.role} Account
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="font-times"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="font-times text-3xl font-bold text-gray-800 mb-2">
            Management Portal Dashboard
          </h2>
          <p className="font-times text-gray-600">
            Welcome to your management dashboard. Select a portal to get started.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessiblePortals.map((portal) => (
            <Card 
              key={portal.id} 
              className={`${portal.bgColor} border-2 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              onClick={() => handlePortalClick(portal.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${portal.color} group-hover:scale-110 transition-transform duration-200`}>
                    {portal.icon}
                  </div>
                  
                  {portal.accessLevel === 'full' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuAction(portal.id, 'view');
                          }}
                        >
                          View Portal
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuAction(portal.id, 'analytics');
                          }}
                        >
                          Analytics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                <h3 className={`font-times text-lg font-semibold ${portal.color} mb-2`}>
                  {portal.title}
                </h3>
                <p className="font-times text-sm text-gray-600">
                  {portal.description}
                </p>
                
                {/* Access Level Indicator */}
                {getAccessLevelDisplay(portal)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Information */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-times text-xl font-bold text-gray-800 mb-4">
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-times text-lg font-semibold text-gray-700 mb-2">
                About AERO AUTOSPACE LLP
              </h4>
              <p className="font-times text-gray-600 mb-4">
                Leading aerospace manufacturing company specializing in precision components 
                and advanced manufacturing solutions for the aviation industry.
              </p>
              <p className="font-times text-gray-600">
                Our state-of-the-art facilities and experienced team ensure the highest 
                quality standards in aerospace component manufacturing.
              </p>
            </div>
            <div>
              <h4 className="font-times text-lg font-semibold text-gray-700 mb-2">
                Contact Information
              </h4>
              <div className="space-y-2 font-times text-gray-600">
                <p>📧 info@aeroautospace.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 Aerospace Industrial Park, Suite 100</p>
                <p>🌐 www.aeroautospace.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;