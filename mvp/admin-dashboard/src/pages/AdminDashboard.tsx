import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, ShoppingBag, Truck, BarChart3, Map, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalErrands: 0,
    activeRunners: 0,
    revenue: 0,
  });
  const [recentErrands, setRecentErrands] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [silentRunners, setSilentRunners] = useState<any[]>([]);

  const fetchData = async () => {
    try {
        const errandsResponse = await api.get('/errands/available'); 
        setRecentErrands(errandsResponse.data);
        
        setPendingPayments(errandsResponse.data.filter((e: any) => e.payment_status === 'pending_verification'));

        const runnersResponse = await api.get('/runners/status');
        setSilentRunners(runnersResponse.data.filter((r: any) => r.is_silent));

        // Mocking stats for MVP
        setStats({
          totalUsers: 150,
          totalErrands: errandsResponse.data.length,
          activeRunners: runnersResponse.data.length,
          revenue: errandsResponse.data
            .filter((e: any) => e.payment_status === 'completed')
            .reduce((acc: number, e: any) => acc + Number(e.estimated_price), 0),
        });
    } catch (err) {
        console.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleVerifyPayment = async (errandId: string) => {
      try {
          // This endpoint needs to be implemented in the backend
          await api.post(`/payments/verify/${errandId}`);
          alert('Payment verified successfully');
          fetchData();
      } catch (err) {
          alert('Failed to verify payment');
      }
  };

  const phase1Zones = [
    { name: 'CBD', active: 15, runners: 4 },
    { name: 'Westlands', active: 10, runners: 3 },
    { name: 'Karen', active: 8, runners: 2 },
    { name: 'Kilimani', active: 7, runners: 2 },
    { name: 'Kileleshwa', active: 5, runners: 1 },
    { name: 'Lavington', active: 4, runners: 1 },
  ];

  const chartData = [
    { name: 'Mon', errands: 4 },
    { name: 'Tue', errands: 7 },
    { name: 'Wed', errands: 5 },
    { name: 'Thu', errands: 9 },
    { name: 'Fri', errands: 12 },
    { name: 'Sat', errands: 6 },
    { name: 'Sun', errands: 2 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Control Room</h1>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium text-gray-600">
            <Map className="w-4 h-4" />
            <span>Phase 1 Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4">
            <ShoppingBag className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Errands</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalErrands}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <Truck className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Runners</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeRunners}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4">
            <BarChart3 className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Revenue (KES)</p>
            <p className="text-2xl font-bold text-gray-900">{stats.revenue}</p>
          </div>
        </div>
      </div>

      {silentRunners.length > 0 && (
        <div className="mb-8 bg-red-900 text-white p-6 rounded-xl shadow-lg border border-red-800 animate-pulse">
            <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 mr-2 text-red-300" />
                <h2 className="text-lg font-bold">CRITICAL: Runners Offline During Errand</h2>
            </div>
            <div className="space-y-4">
                {silentRunners.map((runner) => (
                    <div key={runner.user_id} className="bg-red-800 p-4 rounded-lg flex items-center justify-between border border-red-700">
                        <div>
                            <p className="text-sm font-bold">{runner.full_name}</p>
                            <p className="text-xs text-red-200">Phone: {runner.phone} | Last Active: {new Date(runner.last_active).toLocaleTimeString()}</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-red-900 rounded-lg text-xs font-bold">
                            Contact Runner
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}

      {pendingPayments.length > 0 && (
        <div className="mb-8 bg-indigo-900 text-white p-6 rounded-xl shadow-lg border border-indigo-800">
            <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 mr-2 text-indigo-300" />
                <h2 className="text-lg font-bold">Action Required: Pending Payment Verifications</h2>
            </div>
            <div className="space-y-4">
                {pendingPayments.map((errand) => (
                    <div key={errand.id} className="bg-indigo-800 p-4 rounded-lg flex items-center justify-between border border-indigo-700">
                        <div>
                            <p className="text-sm font-bold">{errand.category}</p>
                            <p className="text-xs text-indigo-200">M-Pesa Code: <span className="font-mono text-white">{errand.mpesa_receipt_number}</span> | Amount: KES {Number(errand.estimated_price) + Number(errand.goods_cost || 0)}</p>
                            {errand.completion_photo_url && (
                                <a href={errand.completion_photo_url} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-300 underline mt-1 block">View Completion Proof</a>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleVerifyPayment(errand.id)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-bold flex items-center"
                            >
                                <CheckCircle className="w-4 h-4 mr-1" /> Verify
                            </button>
                            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold flex items-center">
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Weekly Errands</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="errands" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Clusters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Zone Utilization</h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">PHASE 1</span>
          </div>
          <div className="space-y-4">
            {phase1Zones.map((zone) => (
              <div key={zone.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{zone.name}</p>
                  <p className="text-xs text-gray-500">{zone.active} active errands</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{zone.runners} Runners</p>
                  <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full" 
                      style={{ width: `${(zone.runners / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Order Board */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Live Order Board</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider border-b">
                <th className="pb-3 font-medium">Errand</th>
                <th className="pb-3 font-medium">Zone</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Amount (Fee + Goods)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentErrands.map((errand) => (
                <tr key={errand.id}>
                  <td className="py-4">
                    <p className="text-sm font-medium text-gray-900">{errand.category}</p>
                    <p className="text-xs text-gray-500">{errand.pickup_address.slice(0, 30)}...</p>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {errand.pickup_zone}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                        errand.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                        errand.payment_status === 'pending_verification' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                      {errand.payment_status === 'completed' ? 'Paid' : 
                       errand.payment_status === 'pending_verification' ? 'Verifying' : errand.status}
                    </span>
                    {errand.completion_photo_url && (
                        <a href={errand.completion_photo_url} target="_blank" rel="noreferrer" className="block text-[8px] text-blue-600 underline mt-1">View Proof</a>
                    )}
                  </td>
                  <td className="py-4 text-sm text-gray-900">
                    KES {Number(errand.estimated_price) + Number(errand.goods_cost || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
