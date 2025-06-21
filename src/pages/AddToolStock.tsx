import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AddToolStockHeader from '../components/AddToolStockHeader';
import ToolStockForm from '../components/ToolStockForm';

const AddToolStock = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const isEdit = searchParams.get('edit') === 'true';
  const editData = location.state?.tool;

  console.log('Edit mode:', isEdit);
  console.log('Tool data received:', editData);

  return (
    <div className="min-h-screen bg-gray-50">
      <AddToolStockHeader isEdit={isEdit} />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToolStockForm isEdit={isEdit} editData={editData} />
      </main>
    </div>
  );
};

export default AddToolStock;
