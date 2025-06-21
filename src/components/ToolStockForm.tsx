import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useData } from '../contexts/DataContext';

interface ToolStockFormData {
  toolName: string;
  toolCode: string;
  category: string;
  quantity: string;
  minStock: string;
  maxStock: string;
  location: string;
  supplier: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Stock';
}

interface ToolStockFormProps {
  isEdit: boolean;
  editData?: any;
}

const ToolStockForm: React.FC<ToolStockFormProps> = ({ isEdit, editData }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToolStock, updateToolStock } = useData();

  const [formData, setFormData] = useState<ToolStockFormData>({
    toolName: '',
    toolCode: '',
    category: '',
    quantity: '',
    minStock: '',
    maxStock: '',
    location: '',
    supplier: '',
    status: 'Available'
  });

  const categories = ['Cutting Tools', 'Measuring Tools', 'Hand Tools', 'Power Tools', 'Safety Equipment'];

  useEffect(() => {
    console.log('UseEffect triggered - isEdit:', isEdit, 'editData:', editData);
    if (isEdit && editData) {
      // Map the data from the tool object to form fields
      setFormData({
        toolName: editData.name || '',
        toolCode: editData.code || editData.id || '',
        category: editData.category || '',
        quantity: editData.quantity?.toString() || '',
        minStock: editData.minStock?.toString() || editData.minThreshold?.toString() || '',
        maxStock: editData.maxStock?.toString() || editData.maxThreshold?.toString() || (editData.minThreshold ? (editData.minThreshold * 3).toString() : ''),
        location: editData.location || '',
        supplier: editData.supplier || 'Default Supplier',
        status: editData.status || mapConditionToStatus(editData.condition) || 'Available'
      });
    }
  }, [isEdit, editData]);

  const mapConditionToStatus = (condition: string): 'Available' | 'In Use' | 'Maintenance' | 'Out of Stock' => {
    switch (condition) {
      case 'Good': return 'Available';
      case 'Fair': return 'In Use';
      case 'Needs Repair': return 'Maintenance';
      default: return 'Available';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const toolStockData = {
      name: formData.toolName,
      code: formData.toolCode,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      maxStock: parseInt(formData.maxStock),
      location: formData.location,
      supplier: formData.supplier,
      status: formData.status
    };

    if (isEdit && editData?.id) {
      updateToolStock(editData.id, toolStockData);
    } else {
      addToolStock(toolStockData);
    }
    
    toast({
      title: isEdit ? "Tool Stock Updated" : "Tool Stock Added",
      description: isEdit ? "Tool stock record has been updated successfully." : "Tool stock record has been added successfully.",
    });
    
    navigate('/toolstocks');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-times">Tool Stock Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="toolName" className="font-times">Tool Name</Label>
              <Input
                id="toolName"
                value={formData.toolName}
                onChange={(e) => setFormData({...formData, toolName: e.target.value})}
                required
                className="font-times"
              />
            </div>
            <div>
              <Label htmlFor="toolCode" className="font-times">Tool Code</Label>
              <Input
                id="toolCode"
                value={formData.toolCode}
                onChange={(e) => setFormData({...formData, toolCode: e.target.value})}
                required
                className="font-times"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="font-times">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="font-times">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity" className="font-times">Current Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
                className="font-times"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minStock" className="font-times">Minimum Stock</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                required
                className="font-times"
              />
            </div>
            <div>
              <Label htmlFor="maxStock" className="font-times">Maximum Stock</Label>
              <Input
                id="maxStock"
                type="number"
                value={formData.maxStock}
                onChange={(e) => setFormData({...formData, maxStock: e.target.value})}
                required
                className="font-times"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="font-times">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                className="font-times"
              />
            </div>
            <div>
              <Label htmlFor="supplier" className="font-times">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                required
                className="font-times"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="font-times">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Available' | 'In Use' | 'Maintenance' | 'Out of Stock') => setFormData({...formData, status: value})}>
              <SelectTrigger className="font-times">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="In Use">In Use</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 font-times">
              {isEdit ? 'Update Tool Stock' : 'Add Tool Stock'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/toolstocks')}
              className="font-times"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ToolStockForm;
