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
import { ArrowLeft, Plus, Edit, Trash2, Search, BarChart3, X, PackagePlus, PackageSearch, Upload } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ToolStockRecord {
  id: string;
  toolName: string;
  toolId: string;
  category: string;
  quantity: number;
  location: string;
  status: 'In Stock' | 'Out of Stock' | 'Reserved';
  lastUpdated: string;
  notes?: string;
}

interface StockRequest {
  id: string;
  toolName: string;
  toolId: string;
  quantity: number;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const ToolStocksPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'stocks');

  const [requestFormData, setRequestFormData] = useState({
    toolName: '',
    toolId: '',
    quantity: 0,
    requestDate: ''
  });

  const [toolStockRecords, setToolStockRecords] = useState<ToolStockRecord[]>([]);
  const [stockRequests, setStockRequests] = useState<StockRequest[]>([]);

  useEffect(() => {
    if (searchParams.get('tab') === 'analytics') {
      setActiveTab('analytics');
    }
  }, [searchParams]);

  // Analytics data
  const stockStatusData = [
    { name: 'In Stock', count: 120, percentage: 60 },
    { name: 'Out of Stock', count: 50, percentage: 25 },
    { name: 'Reserved', count: 30, percentage: 15 }
  ];

  const monthlyTrendData = [
    { month: 'Jan', inStock: 110, outOfStock: 40 },
    { month: 'Feb', inStock: 115, outOfStock: 35 },
    { month: 'Mar', inStock: 120, outOfStock: 30 },
    { month: 'Apr', inStock: 125, outOfStock: 25 },
    { month: 'May', inStock: 130, outOfStock: 20 }
  ];

  const categoryOptions = ['Electronics', 'Hand Tools', 'Power Tools', 'Measuring Tools', 'Safety Gear'];

  const filteredRecords = toolStockRecords.filter(record => {
    const matchesSearch = record.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.toolId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || record.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetRequestForm = () => {
    setRequestFormData({
      toolName: '',
      toolId: '',
      quantity: 0,
      requestDate: ''
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload only PDF, DOC, or Excel files.",
        variant: "destructive"
      });
      return;
    }

    // Simulate file processing and data population
    const mockData: ToolStockRecord[] = [
      {
        id: '1',
        toolName: 'Hammer',
        toolId: 'TOOL001',
        category: 'Hand Tools',
        quantity: 50,
        location: 'Warehouse A',
        status: 'In Stock',
        lastUpdated: '2024-06-01',
        notes: 'Standard hammer'
      },
      {
        id: '2',
        toolName: 'Screwdriver Set',
        toolId: 'TOOL002',
        category: 'Hand Tools',
        quantity: 30,
        location: 'Warehouse A',
        status: 'Out of Stock',
        lastUpdated: '2024-06-01',
        notes: 'Phillips and flathead screwdrivers'
      },
      {
        id: '3',
        toolName: 'Drill Machine',
        toolId: 'TOOL003',
        category: 'Power Tools',
        quantity: 20,
        location: 'Warehouse B',
        status: 'In Stock',
        lastUpdated: '2024-06-01',
        notes: 'Cordless drill machine'
      }
    ];

    setToolStockRecords(mockData);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been processed and data populated.`
    });

    // Reset file input
    event.target.value = '';
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStockRequest: StockRequest = {
      ...requestFormData,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setStockRequests([...stockRequests, newStockRequest]);
    toast({
      title: "Stock Request Submitted",
      description: "Stock request has been submitted successfully.",
    });
    
    resetRequestForm();
    setIsRequestDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setToolStockRecords(toolStockRecords.filter(record => record.id !== id));
    toast({
      title: "Record Deleted",
      description: "Tool stock record has been removed.",
    });
  };

  const handleEdit = (record: ToolStockRecord) => {
    // Navigate to add page with edit mode and record data
    navigate(`/toolstocks/add?edit=true&id=${record.id}`, {
      state: { record }
    });
  };

  const handleRequestAction = (id: string, action: 'Approved' | 'Rejected') => {
    setStockRequests(stockRequests.map(request => 
      request.id === id ? { ...request, status: action } : request
    ));
    toast({
      title: `Stock Request ${action}`,
      description: `The stock request has been ${action.toLowerCase()}.`,
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
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
                className="font-times p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-times text-xl font-bold text-gray-800">
                Tool Stocks Portal
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
            <TabsTrigger value="stocks">Tool Stocks</TabsTrigger>
            <TabsTrigger value="requests">Stock Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="stocks" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tools..."
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
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] font-times">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={() => navigate('/toolstocks/add')} className="font-times">
                <PackagePlus className="h-4 w-4 mr-2" />
                Add Tool Stock
              </Button>
            </div>

            {/* Tool Stocks Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-times">Tool Stock Records ({filteredRecords.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-times">Tool Name</TableHead>
                      <TableHead className="font-times">Tool ID</TableHead>
                      <TableHead className="font-times">Category</TableHead>
                      <TableHead className="font-times">Quantity</TableHead>
                      <TableHead className="font-times">Location</TableHead>
                      <TableHead className="font-times">Status</TableHead>
                      <TableHead className="font-times">Last Updated</TableHead>
                      <TableHead className="font-times">Notes</TableHead>
                      <TableHead className="font-times">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500 font-times">
                          No tool stock records found. Upload a file or add records manually.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-times font-medium">{record.toolName}</TableCell>
                          <TableCell className="font-times">{record.toolId}</TableCell>
                          <TableCell className="font-times">{record.category}</TableCell>
                          <TableCell className="font-times">{record.quantity}</TableCell>
                          <TableCell className="font-times">{record.location}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={record.status === 'In Stock' ? 'default' : record.status === 'Out of Stock' ? 'destructive' : 'secondary'}
                              className="font-times"
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-times">{record.lastUpdated}</TableCell>
                          <TableCell className="font-times">{record.notes || '-'}</TableCell>
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
                    <Label htmlFor="file-upload" className="font-times text-sm text-gray-600">
                      Upload File:
                    </Label>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            {/* Stock Requests Controls */}
            <div className="flex justify-between items-center">
              <h3 className="font-times text-lg font-semibold">Stock Requests</h3>
              <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetRequestForm} className="font-times">
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Submit Stock Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-times">Submit Stock Request</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="requestToolName" className="font-times">Tool Name</Label>
                      <Input
                        id="requestToolName"
                        value={requestFormData.toolName}
                        onChange={(e) => setRequestFormData({...requestFormData, toolName: e.target.value})}
                        required
                        className="font-times"
                      />
                    </div>
                    <div>
                      <Label htmlFor="requestToolId" className="font-times">Tool ID</Label>
                      <Input
                        id="requestToolId"
                        value={requestFormData.toolId}
                        onChange={(e) => setRequestFormData({...requestFormData, toolId: e.target.value})}
                        required
                        className="font-times"
                      />
                    </div>
                    <div>
                      <Label htmlFor="requestQuantity" className="font-times">Quantity</Label>
                      <Input
                        id="requestQuantity"
                        type="number"
                        value={requestFormData.quantity}
                        onChange={(e) => setRequestFormData({...requestFormData, quantity: parseInt(e.target.value)})}
                        required
                        className="font-times"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 font-times">
                        Submit Request
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsRequestDialogOpen(false)}
                        className="font-times"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stock Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-times">Stock Requests ({stockRequests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-times">Tool Name</TableHead>
                      <TableHead className="font-times">Tool ID</TableHead>
                      <TableHead className="font-times">Quantity</TableHead>
                      <TableHead className="font-times">Request Date</TableHead>
                      <TableHead className="font-times">Status</TableHead>
                      <TableHead className="font-times">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500 font-times">
                          No stock requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      stockRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-times">{request.toolName}</TableCell>
                          <TableCell className="font-times">{request.toolId}</TableCell>
                          <TableCell className="font-times">{request.quantity}</TableCell>
                          <TableCell className="font-times">{request.requestDate}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={request.status === 'Approved' ? 'default' : request.status === 'Rejected' ? 'destructive' : 'secondary'}
                              className="font-times"
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === 'Pending' && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRequestAction(request.id, 'Approved')}
                                  className="font-times text-green-600 hover:text-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRequestAction(request.id, 'Rejected')}
                                  className="font-times text-red-600 hover:text-red-700"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-times flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Stock Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stockStatusData}>
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
                        <Bar dataKey="count" fill="#3b82f6" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-times">Monthly Stock Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
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
                        <Line type="monotone" dataKey="inStock" stroke="#10b981" name="In Stock" strokeWidth={2} />
                        <Line type="monotone" dataKey="outOfStock" stroke="#ef4444" name="Out of Stock" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-times">Stock Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <PackageSearch className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-times text-sm text-gray-600">Total Tools in Stock</p>
                            <p className="font-times text-2xl font-bold text-green-600">120</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <PackagePlus className="h-8 w-8 text-yellow-600" />
                          <div>
                            <p className="font-times text-sm text-gray-600">Tools Out of Stock</p>
                            <p className="font-times text-2xl font-bold text-yellow-600">50</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <PackageSearch className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-times text-sm text-gray-600">Reserved Tools</p>
                            <p className="font-times text-2xl font-bold text-blue-600">30</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

export default ToolStocksPortal;
