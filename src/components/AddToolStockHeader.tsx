import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddToolStockHeaderProps {
  isEdit: boolean;
}

const AddToolStockHeader: React.FC<AddToolStockHeaderProps> = ({ isEdit }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/toolstocks')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-times text-xl font-bold text-gray-800">
              {isEdit ? 'Edit Tool Stock' : 'Add Tool Stock'}
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
  );
};

export default AddToolStockHeader;