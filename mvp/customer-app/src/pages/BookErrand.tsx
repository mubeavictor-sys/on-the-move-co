import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { MapPin } from 'lucide-react';

const BookErrand: React.FC = () => {
  const [formData, setFormData] = useState({
    category: 'Parcel Pickup & Delivery',
    description: '',
    pickup_address: '',
    pickup_zone: 'CBD',
    delivery_address: '',
    delivery_zone: 'CBD',
    goods_cost: 0,
    estimated_price: 500, // Service fee
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const phase1Zones = [
    'CBD', 'Westlands', 'Karen', 'Kilimani', 'Kileleshwa', 'Lavington', 
    'Riverside', 'Parklands', 'Highridge', 'South B', 'South C', 'Langata'
  ];

  const categories = [
    'Parcel Pickup & Delivery',
    'Queue Standing',
    'Bank & Administrative Runs',
    'General Errands',
    'Shopping & Grocery Pickup',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/errands', formData);
      navigate(`/track/${response.data.id}`);
    } catch (err) {
      console.error('Booking failed');
      alert('Failed to book errand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalToPay = Number(formData.estimated_price) + Number(formData.goods_cost);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Errand</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">What needs to be done?</label>
          <textarea
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            placeholder="Describe the errand in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Goods Cost (if purchasing items)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">KES</span>
            </div>
            <input
              type="number"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              value={formData.goods_cost}
              onChange={(e) => setFormData({ ...formData, goods_cost: Number(e.target.value) })}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Runners do not handle cash. All goods must be pre-paid.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pickup Location / Start Point</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              required
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g. Westlands Commercial Center"
              value={formData.pickup_address}
              onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
            />
          </div>
          <select
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={formData.pickup_zone}
            onChange={(e) => setFormData({ ...formData, pickup_zone: e.target.value })}
          >
            {phase1Zones.map((z) => (
              <option key={z} value={z}>{z} Zone</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Location / End Point (Optional)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g. Kilimani, Galana Road"
              value={formData.delivery_address}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
            />
          </div>
          <select
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={formData.delivery_zone}
            onChange={(e) => setFormData({ ...formData, delivery_zone: e.target.value })}
          >
            {phase1Zones.map((z) => (
              <option key={z} value={z}>{z} Zone</option>
            ))}
          </select>
        </div>

        <div className="bg-indigo-50 p-4 rounded-md space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Fee:</span>
            <span className="font-medium text-gray-900">KES {formData.estimated_price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Goods Cost:</span>
            <span className="font-medium text-gray-900">KES {formData.goods_cost}</span>
          </div>
          <div className="pt-2 border-t border-indigo-100 flex justify-between items-center">
            <span className="text-base font-bold text-indigo-900">Total to Pay:</span>
            <span className="text-lg font-bold text-indigo-600">KES {totalToPay}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Booking...' : 'Confirm & Pay Upfront'}
        </button>
      </form>
    </div>
  );
};

export default BookErrand;
