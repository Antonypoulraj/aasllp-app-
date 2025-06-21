import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Search, BarChart3, X, Upload } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

const EmployeePortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'employees');
  
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    if (searchParams.get('tab') === 'analytics') {
      setActiveTab('analytics');
    }
  }, [searchParams]);

  // Analytics data
  const departmentData = [
    { name: 'Engineering', count: 0, active: 0 },
    { name: 'Production', count: 0, active: 0 },
    { name: 'Quality Control', count: 0, active: 0 },
    { name: 'Administration', count: 0, active: 0 },
    { name: 'Maintenance', count: 0, active: 0 }
  ];

  const departments = ['Engineering', 'Production', 'Quality Control', 'Administration', 'Maintenance'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleEdit = (employee: Employee) => {
    navigate(`/employee/add?edit=true&id=${employee.id}`, {
      state: { employee }
    });
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast({
      title: "Employee Deleted",
      description: "Employee has been removed and transferred to temporary database.",
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleAddEmployee = () => {
    navigate('/employee/add');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (allowedTypes.includes(file.type)) {
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
        console.log('File uploaded:', file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload only PDF, DOC, or Excel files.",
          variant: "destructive"
        });
      }
    }
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
                onClick={() => navigate('/dashboard')}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-times text-xl font-bold text-gray-800">
                Employee Portal
              </h1>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="font-times">
            <TabsTrigger value="employees">Employee Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 font-times"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px] font-times">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddEmployee} className="font-times">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>

            {/* Employee Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-times">Employee List ({filteredEmployees.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-times">Name</TableHead>
                        <TableHead className="font-times">Email</TableHead>
                        <TableHead className="font-times">Department</TableHead>
                        <TableHead className="font-times">Position</TableHead>
                        <TableHead className="font-times">Status</TableHead>
                        <TableHead className="font-times">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 font-times text-gray-500">
                            No employees found. Add your first employee to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-times font-medium">{employee.name}</TableCell>
                            <TableCell className="font-times">{employee.email}</TableCell>
                            <TableCell className="font-times">{employee.department}</TableCell>
                            <TableCell className="font-times">{employee.position}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={employee.status === 'Active' ? 'default' : 'secondary'}
                                className="font-times"
                              >
                                {employee.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(employee)}
                                  className="font-times"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(employee.id)}
                                  className="font-times text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* File Upload Section */}
                  <div className="flex justify-end mt-4">
                    <div className="flex items-center gap-3">
                      <span className="font-times text-sm text-gray-600">Upload File:</span>
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-times"
                        
                        >
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-times flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Employee Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontFamily: 'Times New Roman' }}
                      />
                      <YAxis 
                        tick={{ fontFamily: 'Times New Roman' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          fontFamily: 'Times New Roman',
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="#3b82f6" name="Total Employees" />
                      <Bar dataKey="active" fill="#10b981" name="Active Employees" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="font-times text-2xl font-bold text-blue-600">{employees.length}</p>
                        <p className="font-times text-sm text-gray-600">Total Employees</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="font-times text-2xl font-bold text-green-600">
                          {employees.filter(emp => emp.status === 'Active').length}
                        </p>
                        <p className="font-times text-sm text-gray-600">Active Employees</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="font-times text-2xl font-bold text-orange-600">{departments.length}</p>
                        <p className="font-times text-sm text-gray-600">Departments</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EmployeePortal;
