import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Search, Package, AlertTriangle, CheckCircle, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RawMaterial {
  id: string;
  materialName: string;
  specification: string;
  grade: string;
  quantity: number;
  unit: string;
  supplierName: string;
  dateReceived: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const RawMaterialsPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [materials, setMaterials] = useState<RawMaterial[]>([]);

  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.specification.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || material.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (material: RawMaterial) => {
    navigate(`/rawmaterials/add?edit=true&id=${material.id}`, {
      state: { material }
    });
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(material => material.id !== id));
    toast({
      title: "Material Deleted",
      description: "Raw material has been removed from inventory.",
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'default';
      case 'Low Stock':
        return 'secondary';
      case 'Out of Stock':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="h-4 w-4" />;
      case 'Low Stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Out of Stock':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
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
        // Simulate data population after file upload
        const mockData: RawMaterial[] = [
          {
            id: '1',
            materialName: 'Steel Rod',
            specification: '10mm diameter',
            grade: 'Grade A',
            quantity: 100,
            unit: 'pieces',
            supplierName: 'Steel Works Ltd',
            dateReceived: '2024-06-01',
            status: 'In Stock'
          },
          {
            id: '2',
            materialName: 'Aluminum Sheet',
            specification: '2mm thickness',
            grade: 'Grade B',
            quantity: 50,
            unit: 'sheets',
            supplierName: 'Metal Suppliers Inc',
            dateReceived: '2024-06-02',
            status: 'Low Stock'
          }
        ];
        
        setMaterials(mockData);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully and data populated.`,
        });
        console.log('File uploaded and data populated:', file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload only PDF, DOC, or Excel files.",
          variant: "destructive"
        });
      }
    }
  };

  // Analytics data
  const statusData = [
    { 
      name: 'In Stock', 
      count: materials.filter(m => m.status === 'In Stock').length,
      color: '#10b981'
    },
    { 
      name: 'Low Stock', 
      count: materials.filter(m => m.status === 'Low Stock').length,
      color: '#f59e0b'
    },
    { 
      name: 'Out of Stock', 
      count: materials.filter(m => m.status === 'Out of Stock').length,
      color: '#ef4444'
    }
  ];

  const supplierData = materials.reduce((acc, material) => {
    const existing = acc.find(item => item.name === material.supplierName);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: material.supplierName, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

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
                Raw Materials Portal
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
        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="font-times">
            <TabsTrigger value="materials">Material Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search materials..."
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[200px] font-times">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => navigate('/rawmaterials/add')} 
                className="font-times"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-times text-sm text-gray-600">Total Materials</p>
                      <p className="font-times text-2xl font-bold text-blue-600">{materials.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-times text-sm text-gray-600">In Stock</p>
                      <p className="font-times text-2xl font-bold text-green-600">
                        {materials.filter(m => m.status === 'In Stock').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="font-times text-sm text-gray-600">Low Stock</p>
                      <p className="font-times text-2xl font-bold text-orange-600">
                        {materials.filter(m => m.status === 'Low Stock').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Materials Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-times">Raw Materials ({filteredMaterials.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-times">Material Name</TableHead>
                        <TableHead className="font-times">Specification</TableHead>
                        <TableHead className="font-times">Grade</TableHead>
                        <TableHead className="font-times">Quantity</TableHead>
                        <TableHead className="font-times">Unit</TableHead>
                        <TableHead className="font-times">Supplier</TableHead>
                        <TableHead className="font-times">Date Received</TableHead>
                        <TableHead className="font-times">Status</TableHead>
                        <TableHead className="font-times">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 font-times text-gray-500">
                            No raw materials found. Add your first material or upload a file to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMaterials.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell className="font-times font-medium">{material.materialName}</TableCell>
                            <TableCell className="font-times">{material.specification}</TableCell>
                            <TableCell className="font-times">{material.grade}</TableCell>
                            <TableCell className="font-times">{material.quantity}</TableCell>
                            <TableCell className="font-times">{material.unit}</TableCell>
                            <TableCell className="font-times">{material.supplierName}</TableCell>
                            <TableCell className="font-times">{material.dateReceived}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={getStatusBadgeVariant(material.status)}
                                className="font-times flex items-center gap-1"
                              >
                                {getStatusIcon(material.status)}
                                {material.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(material)}
                                  className="font-times"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(material.id)}
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
                  <CardTitle className="font-times">Stock Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="count"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-times">Materials by Supplier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={supplierData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontFamily: 'Times New Roman' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontFamily: 'Times New Roman' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Times New Roman' }} />
                        <Bar dataKey="count" fill="#3b82f6" name="Materials Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="font-times text-2xl font-bold text-blue-600">{materials.length}</p>
                    <p className="font-times text-sm text-gray-600">Total Materials</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="font-times text-2xl font-bold text-green-600">
                      {materials.filter(m => m.status === 'In Stock').length}
                    </p>
                    <p className="font-times text-sm text-gray-600">In Stock</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="font-times text-2xl font-bold text-orange-600">
                      {new Set(materials.map(m => m.supplierName)).size}
                    </p>
                    <p className="font-times text-sm text-gray-600">Suppliers</p>
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

export default RawMaterialsPortal;