import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AddRawMaterialHeader from '../components/AddRawMaterialHeader';
import RawMaterialForm from '../components/RawMaterialForm';

const AddRawMaterial = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const isEdit = searchParams.get('edit') === 'true';
  const editData = location.state?.material;

  console.log('Edit mode:', isEdit);
  console.log('Material data received:', editData);

  return (
    <div className="min-h-screen bg-gray-50">
      <AddRawMaterialHeader isEdit={isEdit} />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RawMaterialForm isEdit={isEdit} editData={editData} />
      </main>
    </div>
  );
};

export default AddRawMaterial;
