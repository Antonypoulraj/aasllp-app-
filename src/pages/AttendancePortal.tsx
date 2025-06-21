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
import { ArrowLeft, Plus, Edit, Trash2, Search, BarChart3, X, Clock, CheckCircle, AlertCircle, Calendar, Upload } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  managerEmail: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const AttendancePortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'attendance');
  
  const [leaveFormData, setLeaveFormData] = useState({
    employeeName: '',
    employeeId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    managerEmail: ''
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    if (searchParams.get('tab') === 'analytics') {
      setActiveTab('analytics');
    }
  }, [searchParams]);

  // Analytics data
  const attendanceData = [
    { name: 'Present', count: 85, percentage: 85 },
    { name: 'Late', count: 10, percentage: 10 },
    { name: 'Absent', count: 5, percentage: 5 }
  ];

  const weeklyTrendData = [
    { day: 'Mon', present: 95, absent: 5 },
    { day: 'Tue', present: 92, absent: 8 },
    { day: 'Wed', present: 88, absent: 12 },
    { day: 'Thu', present: 90, absent: 10 },
    { day: 'Fri', present: 87, absent: 13 }
  ];

  const statusOptions = ['Present', 'Absent', 'Late', 'Half Day'];
  const leaveTypes = ['Sick Leave', 'Annual Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave'];

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const resetLeaveForm = () => {
    setLeaveFormData({
      employeeName: '',
      employeeId: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      managerEmail: ''
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
    const mockData: AttendanceRecord[] = [
      {
        id: '1',
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        date: '2024-06-01',
        status: 'Present',
        checkIn: '09:00',
        checkOut: '17:00',
        notes: 'On time'
      },
      {
        id: '2',
        employeeName: 'Sarah Johnson',
        employeeId: 'EMP002',
        date: '2024-06-01',
        status: 'Late',
        checkIn: '09:30',
        checkOut: '17:30',
        notes: 'Traffic delay'
      },
      {
        id: '3',
        employeeName: 'Mike Davis',
        employeeId: 'EMP003',
        date: '2024-06-01',
        status: 'Absent',
        notes: 'Sick leave'
      }
    ];

    setAttendanceRecords(mockData);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been processed and data populated.`
    });

    // Reset file input
    event.target.value = '';
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLeaveRequest: LeaveRequest = {
      ...leaveFormData,
      id: Date.now().toString(),
      status: 'Pending'
    };
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
    toast({
      title: "Leave Request Submitted",
      description: "Leave request has been submitted successfully.",
    });
    
    resetLeaveForm();
    setIsLeaveDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
    toast({
      title: "Record Deleted",
      description: "Attendance record has been removed.",
    });
  };

  const handleEdit = (record: AttendanceRecord) => {
    // Navigate to add page with edit mode and record data
    navigate(`/attendance/add?edit=true&id=${record.id}`, {
      state: { record }
    });
  };

  const handleLeaveAction = (id: string, action: 'Approved' | 'Rejected') => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: action } : request
    ));
    toast({
      title: `Leave Request ${action}`,
      description: `The leave request has been ${action.toLowerCase()}.`,
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Absent':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'Half Day':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return null;
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
                className="font-times p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-times text-xl font-bold text-gray-800">
                Attendance Portal
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
            <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
            <TabsTrigger value="leaves">Leave Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px] font-times">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={() => navigate('/attendance/add')} className="font-times">
                <Plus className="h-4 w-4 mr-2" />
                Add Attendance
              </Button>
            </div>

            {/* Attendance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-times">Attendance Records ({filteredRecords.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-times">Employee Name</TableHead>
                      <TableHead className="font-times">Employee ID</TableHead>
                      <TableHead className="font-times">Date</TableHead>
                      <TableHead className="font-times">Status</TableHead>
                      <TableHead className="font-times">Check In</TableHead>
                      <TableHead className="font-times">Check Out</TableHead>
                      <TableHead className="font-times">Notes</TableHead>
                      <TableHead className="font-times">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500 font-times">
                          No attendance records found. Upload a file or add records manually.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-times font-medium">{record.employeeName}</TableCell>
                          <TableCell className="font-times">{record.employeeId}</TableCell>
                          <TableCell className="font-times">{record.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(record.status)}
                              <Badge 
                                variant={record.status === 'Present' ? 'default' : record.status === 'Late' ? 'secondary' : 'destructive'}
                                className="font-times"
                              >
                                {record.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-times">{record.checkIn || '-'}</TableCell>
                          <TableCell className="font-times">{record.checkOut || '-'}</TableCell>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-6">
            {/* Leave Management Controls */}
            <div className="flex justify-between items-center">
              <h3 className="font-times text-lg font-semibold">Leave Requests</h3>
              <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetLeaveForm} className="font-times">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Leave Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-times">Submit Leave Request</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLeaveSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="leaveEmployeeName" className="font-times">Employee Name</Label>
                      <Input
                        id="leaveEmployeeName"
                        value={leaveFormData.employeeName}
                        onChange={(e) => setLeaveFormData({...leaveFormData, employeeName: e.target.value})}
                        required
                        className="font-times"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leaveEmployeeId" className="font-times">Employee ID</Label>
                      <Input
                        id="leaveEmployeeId"
                        value={leaveFormData.employeeId}
                        onChange={(e) => setLeaveFormData({...leaveFormData, employeeId: e.target.value})}
                        required
                        className="font-times"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leaveType" className="font-times">Leave Type</Label>
                      <Select value={leaveFormData.leaveType} onValueChange={(value) => setLeaveFormData({...leaveFormData, leaveType: value})}>
                        <SelectTrigger className="font-times">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          {leaveTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startDate" className="font-times">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={leaveFormData.startDate}
                        onChange={(e) => setLeaveFormData({...leaveFormData, startDate: e.target.value})}
                        required
                        className="font-times"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="font-times">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={leaveFormData.endDate}
                        onChange={(e) => setLeaveFormData({...leaveFormData, endDate: e.target.value})}
                        required
                        className="font-times"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason" className="font-times">Reason</Label>
                      <Input
                        id="reason"
                        value={leaveFormData.reason}
                        onChange={(e) => setLeaveFormData({...leaveFormData, reason: e.target.value})}
                        required
                        className="font-times"
                        placeholder="Reason for leave"
                      />
                    </div>
                    <div>
                      <Label htmlFor="managerEmail" className="font-times">Manager Email ID</Label>
                      <Input
                        id="managerEmail"
                        type="email"
                        value={leaveFormData.managerEmail}
                        onChange={(e) => setLeaveFormData({...leaveFormData, managerEmail: e.target.value})}
                        required
                        className="font-times"
                        placeholder="manager@company.com"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 font-times">
                        Submit Request
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsLeaveDialogOpen(false)}
                        className="font-times"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Leave Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-times">Leave Requests ({leaveRequests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-times">Employee Name</TableHead>
                      <TableHead className="font-times">Employee ID</TableHead>
                      <TableHead className="font-times">Leave Type</TableHead>
                      <TableHead className="font-times">Start Date</TableHead>
                      <TableHead className="font-times">End Date</TableHead>
                      <TableHead className="font-times">Reason</TableHead>
                      <TableHead className="font-times">Manager Email</TableHead>
                      <TableHead className="font-times">Status</TableHead>
                      <TableHead className="font-times">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500 font-times">
                          No leave requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaveRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-times">{request.employeeName}</TableCell>
                          <TableCell className="font-times">{request.employeeId}</TableCell>
                          <TableCell className="font-times">{request.leaveType}</TableCell>
                          <TableCell className="font-times">{request.startDate}</TableCell>
                          <TableCell className="font-times">{request.endDate}</TableCell>
                          <TableCell className="font-times">{request.reason}</TableCell>
                          <TableCell className="font-times">{request.managerEmail}</TableCell>
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
                                  onClick={() => handleLeaveAction(request.id, 'Approved')}
                                  className="font-times text-green-600 hover:text-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleLeaveAction(request.id, 'Rejected')}
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
                    Attendance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
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
                  <CardTitle className="font-times">Weekly Attendance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="day" 
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
                        <Line type="monotone" dataKey="present" stroke="#10b981" name="Present" strokeWidth={2} />
                        <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-times">Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-times text-sm text-gray-600">Present Today</p>
                            <p className="font-times text-2xl font-bold text-green-600">85</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Clock className="h-8 w-8 text-yellow-600" />
                          <div>
                            <p className="font-times text-sm text-gray-600">Late Today</p>
                            <p className="font-times text-2xl font-bold text-yellow-600">10</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-8 w-8 text-red-600" />
                          <div>
                            <p className="font-times text-sm text-gray-600">Absent Today</p>
                            <p className="font-times text-2xl font-bold text-red-600">5</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-times text-sm text-gray-600">On Leave</p>
                            <p className="font-times text-2xl font-bold text-blue-600">3</p>
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

export default AttendancePortal;
