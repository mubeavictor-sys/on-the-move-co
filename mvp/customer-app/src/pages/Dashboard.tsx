import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, Package, Clock, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [errands, setErrands] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchErrands = async () => {
      try {
        const response = await api.get('/errands/my');
        setErrands(response.data);
      } catch (err) {
        console.error('Failed to fetch errands');
      }
    };
    fetchErrands();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name}</h1>
        <Link
          to="/book"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-1" />
          Book Errand
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Errands</h2>
        {errands.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            You haven't booked any errands yet.
          </div>
        ) : (
          errands.map((errand) => (
            <Link
              key={errand.id}
              to={`/track/${errand.id}`}
              className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{errand.category}</h3>
                  <p className="text-gray-600 text-sm mt-1">{errand.description}</p>
                  <div className="flex items-center mt-3 text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(errand.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(errand.status)}`}>
                  {errand.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
