import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ArrowLeft, AlertTriangle, TrendingUp, Users, Clock, Wrench, Package, Factory } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sample data for the analytics chart - simplified without quantity fields
  const analyticsData = [
    {
      portal: 'Employee',
      icon: Users,
      performance: 85,
    },
    {
      portal: 'Attendance',
      icon: Clock,
      performance: 92,
    },
    {
      portal: 'Tool Stock',
      icon: Wrench,
      performance: 79,
    },
    {
      portal: 'Raw Material',
      icon: Package,
      performance: 85,
    },
    {
      portal: 'Production',
      icon: Factory,
      performance: 83,
    },
  ];

  const chartConfig = {
    performance: {
      label: "Performance Score",
      color: "#3b82f6", // blue
    },
  };

  const keyMessages = [
    {
      icon: AlertTriangle,
      title: "Tool Stock Portal Needs Attention",
      description: "Tool Stock portal shows lower performance. Consider reviewing efficiency processes.",
      severity: "high"
    },
    {
      icon: TrendingUp,
      title: "Attendance Portal Performing Well",
      description: "Attendance portal showing excellent performance at 92%. Continue current practices.",
      severity: "low"
    },
    {
      icon: Users,
      title: "Employee Portal Efficiency",
      description: "Employee portal maintaining good performance levels. Room for minor improvements.",
      severity: "medium"
    }
  ];

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-times text-xl font-bold text-gray-800">
                Analytics Portal
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-times text-sm font-medium text-gray-800">
                  {user?.username}
                </p>
                <p className="font-times text-xs text-gray-500 capitalize">
                  {user?.role} Account
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="font-times text-3xl font-bold text-gray-800 mb-2">
            Portal Performance Analytics
          </h2>
          <p className="font-times text-gray-600">
            Comprehensive analysis of all portal activities and performance metrics.
          </p>
        </div>

        {/* Analytics Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-times text-xl text-gray-800">
              Portal Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="portal" 
                    className="font-times"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis className="font-times" tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="performance" 
                    fill="var(--color-performance)" 
                    name="Performance Score"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            {/* Chart Legend */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-times text-sm text-gray-600">Performance Score</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Messages */}
        <div className="mb-8">
          <h3 className="font-times text-2xl font-bold text-gray-800 mb-6">
            Key Improvement Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyMessages.map((message, index) => (
              <Card 
                key={index} 
                className={`border-l-4 ${
                  message.severity === 'high' 
                    ? 'border-l-red-500 bg-red-50' 
                    : message.severity === 'medium'
                    ? 'border-l-yellow-500 bg-yellow-50'
                    : 'border-l-green-500 bg-green-50'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      message.severity === 'high' 
                        ? 'bg-red-100 text-red-600' 
                        : message.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      <message.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-times font-semibold text-gray-800 mb-2">
                        {message.title}
                      </h4>
                      <p className="font-times text-sm text-gray-600">
                        {message.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-times text-sm text-gray-600">Overall Performance</p>
                  <p className="font-times text-2xl font-bold text-green-600">84.8%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-times text-sm text-gray-600">Areas for Improvement</p>
                  <p className="font-times text-2xl font-bold text-yellow-600">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-times text-sm text-gray-600">Best Performing Portal</p>
                  <p className="font-times text-2xl font-bold text-blue-600">Attendance</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;