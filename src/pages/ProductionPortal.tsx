import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2, Search, BarChart3, Factory, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ProductionRecord {
  id: string;
  date: string;
  shift: string;
  componentName: string;
  projectName: string;
  totalMachinedQuantity: number;
  totalFinishedQuantity: number;
  totalRejectionQuantity: number;
  rejectionReason: string;
  operatorName: string;
}

const ProductionPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [records, setRecords] = useState<ProductionRecord[]>([]);

  // Calculate totals for analytics
  const totalQuantity = records.reduce((sum, record) => sum + record.totalMachinedQuantity, 0);
  const totalFinished = records.reduce((sum, record) => sum + record.totalFinishedQuantity, 0);
  const totalRejected = records.reduce((sum, record) => sum + record.totalRejectionQuantity, 0);

  // Analytics data
  const shiftData = [
    { name: 'Shift 1', machined: 0, finished: 0, rejected: 0 },
    { name: 'Shift 2', machined: 0, finished: 0, rejected: 0 }
  ];

  const rejectionData = [
    { name: 'Surface finishing', value: 0, color: '#ef4444' },
    { name: 'Inner diameter finishing', value: 0, color: '#f59e0b' },
    { name: 'Hole chipped', value: 0, color: '#3b82f6' },
    { name: 'Tool Broken', value: 0, color: '#10b981' }
  ];

  const productionTrendData = [
    { date: '2024-05-20', machined: 0, finished: 0, rejected: 0 },
    { date: '2024-05-21', machined: 0, finished: 0, rejected: 0 },
    { date: '2024-05-22', machined: 0, finished: 0, rejected: 0 },
    { date: '2024-05-23', machined: 0, finished: 0, rejected: 0 },
    { date: '2024-05-24', machined: 0, finished: 0, rejected: 0 }
  ];

  const filteredRecords = records.filter(record => 
    record.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.shift.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (record: ProductionRecord) => {
    navigate(`/production/add?edit=true&id=${record.id}`, {
      state: { record }
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Record Deleted",
      description: "Production record has been removed.",
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
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
                Production Portal
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
        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="font-times">
            <TabsTrigger value="records">Production Records</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 font-times"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/production/add')} 
                className="font-times"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Record
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Factory className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-times text-sm text-gray-600">Total Machined</p>
                      <p className="font-times text-2xl font-bold text-blue-600">{totalQuantity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-times text-sm text-gray-600">Total Finished</p>
                      <p className="font-times text-2xl font-bold text-green-600">{totalFinished}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <X className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-times text-sm text-gray-600">Total Rejected</p>
                      <p className="font-times text-2xl font-bold text-red-600">{totalRejected}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Records Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-times">Production Records ({filteredRecords.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-times">Date</TableHead>
                        <TableHead className="font-times">Shift</TableHead>
                        <TableHead className="font-times">Component Name</TableHead>
                        <TableHead className="font-times">Project Name</TableHead>
                        <TableHead className="font-times">Machined Qty</TableHead>
                        <TableHead className="font-times">Finished Qty</TableHead>
                        <TableHead className="font-times">Rejected Qty</TableHead>
                        <TableHead className="font-times">Rejection Reason</TableHead>
                        <TableHead className="font-times">Operator</TableHead>
                        <TableHead className="font-times">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 font-times text-gray-500">
                            No production records found. Add your first record to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-times">{record.date}</TableCell>
                            <TableCell className="font-times">{record.shift}</TableCell>
                            <TableCell className="font-times">{record.componentName}</TableCell>
                            <TableCell className="font-times">{record.projectName}</TableCell>
                            <TableCell className="font-times">{record.totalMachinedQuantity}</TableCell>
                            <TableCell className="font-times">{record.totalFinishedQuantity}</TableCell>
                            <TableCell className="font-times">{record.totalRejectionQuantity}</TableCell>
                            <TableCell className="font-times">{record.rejectionReason}</TableCell>
                            <TableCell className="font-times">{record.operatorName}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(record)}
                                  className="font-times"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(record.id)}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-times">Shift Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shiftData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontFamily: 'Times New Roman' }} />
                        <YAxis tick={{ fontFamily: 'Times New Roman' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Times New Roman' }} />
                        <Legend />
                        <Bar dataKey="machined" fill="#3b82f6" name="Machined" />
                        <Bar dataKey="finished" fill="#10b981" name="Finished" />
                        <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-times">Rejection Reasons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rejectionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {rejectionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-times">Production Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={productionTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontFamily: 'Times New Roman' }} />
                        <YAxis tick={{ fontFamily: 'Times New Roman' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Times New Roman' }} />
                        <Legend />
                        <Line type="monotone" dataKey="machined" stroke="#3b82f6" name="Machined" strokeWidth={2} />
                        <Line type="monotone" dataKey="finished" stroke="#10b981" name="Finished" strokeWidth={2} />
                        <Line type="monotone" dataKey="rejected" stroke="#ef4444" name="Rejected" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProductionPortal;