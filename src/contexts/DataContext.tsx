import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ToolStock {
  id: string;
  name: string;
  code: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  location: string;
  supplier: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Stock';
  dateAdded: string;
}

interface RawMaterial {
  id: string;
  name: string;
  code: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  supplier: string;
  costPerUnit: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock' | 'On Order';
  dateAdded: string;
}

interface DataContextType {
  toolStocks: ToolStock[];
  rawMaterials: RawMaterial[];
  addToolStock: (toolStock: Omit<ToolStock, 'id' | 'dateAdded'>) => void;
  updateToolStock: (id: string, toolStock: Omit<ToolStock, 'id' | 'dateAdded'>) => void;
  deleteToolStock: (id: string) => void;
  addRawMaterial: (material: Omit<RawMaterial, 'id' | 'dateAdded'>) => void;
  updateRawMaterial: (id: string, material: Omit<RawMaterial, 'id' | 'dateAdded'>) => void;
  deleteRawMaterial: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [toolStocks, setToolStocks] = useState<ToolStock[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);

  const addToolStock = (toolStock: Omit<ToolStock, 'id' | 'dateAdded'>) => {
    const newToolStock: ToolStock = {
      ...toolStock,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setToolStocks(prev => [...prev, newToolStock]);
  };

  const updateToolStock = (id: string, toolStock: Omit<ToolStock, 'id' | 'dateAdded'>) => {
    setToolStocks(prev => prev.map(item => 
      item.id === id ? { ...item, ...toolStock } : item
    ));
  };

  const deleteToolStock = (id: string) => {
    setToolStocks(prev => prev.filter(item => item.id !== id));
  };

  const addRawMaterial = (material: Omit<RawMaterial, 'id' | 'dateAdded'>) => {
    const newMaterial: RawMaterial = {
      ...material,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setRawMaterials(prev => [...prev, newMaterial]);
  };

  const updateRawMaterial = (id: string, material: Omit<RawMaterial, 'id' | 'dateAdded'>) => {
    setRawMaterials(prev => prev.map(item => 
      item.id === id ? { ...item, ...material } : item
    ));
  };

  const deleteRawMaterial = (id: string) => {
    setRawMaterials(prev => prev.filter(item => item.id !== id));
  };

  const value: DataContextType = {
    toolStocks,
    rawMaterials,
    addToolStock,
    updateToolStock,
    deleteToolStock,
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
