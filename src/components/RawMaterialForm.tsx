import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useData } from '../contexts/DataContext';

interface RawMaterialFormData {
  materialName: string;
  materialCode: string;
  category: string;
  quantity: string;
  unit: string;
  minStock: string;
  maxStock: string;
  supplier: string;
  costPerUnit: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock' | 'On Order';
}

interface RawMaterialFormProps {
  isEdit: boolean;
  editData?: any;
}

const RawMaterialForm: React.FC<RawMaterialFormProps> = ({ isEdit, editData }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addRawMaterial, updateRawMaterial } = useData();

  const [formData, setFormData] = useState<RawMaterialFormData>({
    materialName: '',
    materialCode: '',
    category: '',
    quantity: '',
    unit: '',
    minStock: '',
    maxStock: '',
    supplier: '',
    costPerUnit: '',
    status: 'Available'
  });

  const categories = ['Aluminum', 'Steel', 'Titanium', 'Composite Materials', 'Fasteners', 'Electronics'];
  const units = ['kg', 'lbs', 'pieces', 'meters', 'feet', 'liters'];

  useEffect(() => {
    console.log('UseEffect triggered - isEdit:', isEdit, 'editData:', editData);
    if (isEdit && editData) {
      setFormData({
        materialName: editData.name || '',
        materialCode: editData.code || editData.id || '',
        category: editData.category || '',
        quantity: editData.quantity?.toString() || '',
        unit: editData.unit || '',
        minStock: editData.minStock?.toString() || editData.minThreshold?.toString() || '',
        maxStock: editData.maxStock?.toString() || editData.maxThreshold?.toString() || (editData.minThreshold ? (editData.minThreshold * 5).toString() : ''),
        supplier: editData.supplier || '',
        costPerUnit: editData.costPerUnit?.toString() || editData.unitCost?.toString() || '',
        status: editData.status || mapStatusToFormStatus(editData.status) || 'Available'
      });
    }
  }, [isEdit, editData]);

  const mapStatusToFormStatus = (status: string): 'Available' | 'Low Stock' | 'Out of Stock' | 'On Order' => {
    switch (status) {
      case 'In Stock': return 'Available';
      case 'Low Stock': return 'Low Stock';
      case 'Out of Stock': return 'Out of Stock';
      case 'Expired': return 'Out of Stock';
      default: return 'Available';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const materialData = {
      name: formData.materialName,
      code: formData.materialCode,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      minStock: parseInt(formData.minStock),
      maxStock: parseInt(formData.maxStock),
      supplier: formData.supplier,
      costPerUnit: parseFloat(formData.costPerUnit),
      status: formData.status
    };

    if (isEdit && editData?.id) {
      updateRawMaterial(editData.id, materialData);
    } else {
      addRawMaterial(materialData);
    }
    
    toast({
      title: isEdit ? "Raw Material Updated" : "Raw Material Added",
      description: isEdit ? "Raw material record has been updated successfully." : "Raw material record has been added successfully.",
    });
    
    navigate('/rawmaterials');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-times">Raw Material Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="materialName" className="font-times">Material Name</Label>
              <Input
                id="materialName"
                value={formData.materialName}
                onChange={(e) => setFormData({...formData, materialName: e.target.value})}
                required
                className="font-times"
              />
            </div>
            <div>
              <Label htmlFor="materialCode" className="font-times">Material Code</Label>
              <Input
                id="materialCode"
                value={formData.materialCode}
                onChange={(e) => setFormData({...formData, materialCode: e.target.value})}
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
              <Label htmlFor="unit" className="font-times">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                <SelectTrigger className="font-times">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="supplier" className="font-times">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                required
                className="font-times"
              />
            </div>
            <div>
              <Label htmlFor="costPerUnit" className="font-times">Cost Per Unit</Label>
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({...formData, costPerUnit: e.target.value})}
                required
                className="font-times"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="font-times">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Available' | 'Low Stock' | 'Out of Stock' | 'On Order') => setFormData({...formData, status: value})}>
              <SelectTrigger className="font-times">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                <SelectItem value="On Order">On Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 font-times">
              {isEdit ? 'Update Raw Material' : 'Add Raw Material'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/rawmaterials')}
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

export default RawMaterialForm;
