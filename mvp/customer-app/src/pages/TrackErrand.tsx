import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { MapPin, Phone, MessageSquare, CreditCard, CheckCircle2, Info } from 'lucide-react';

const TrackErrand: React.FC = () => {
  const { id } = useParams();
  const [errand, setErrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [transactionRef, setTransactionRef] = useState('');

  const fetchErrand = async () => {
    try {
      const response = await api.get('/errands/my');
      const found = response.data.find((e: any) => e.id === id);
      setErrand(found);
    } catch (err) {
      console.error('Failed to fetch errand');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrand();
    
    const fetchPaymentSettings = async () => {
        try {
            const response = await api.get('/payments/settings');
            setPaymentSettings(response.data);
        } catch (err) {
            console.error('Failed to fetch payment settings');
        }
    };
    fetchPaymentSettings();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchErrand, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const totalCost = errand ? Number(errand.estimated_price) + Number(errand.goods_cost || 0) : 0;

  const handleSTKPush = async () => {
    setPaying(true);
    try {
      await api.post('/payments/stk-push', {
        errandId: errand.id,
        phone: errand.customer_phone || '254700000000',
        amount: totalCost,
      });
      alert(`M-Pesa STK Push for KES ${totalCost} sent to your phone. Please enter PIN.`);
    } catch (err) {
      alert('Failed to initiate payment.');
    } finally {
      setPaying(false);
    }
  };

  const handleManualConfirm = async () => {
    if (!transactionRef) {
        alert('Please enter the M-Pesa Transaction Reference (e.g. RBT8...).');
        return;
    }
    setPaying(true);
    try {
        await api.post('/payments/confirm-manual', {
            errandId: errand.id,
            transactionReference: transactionRef
        });
        alert('Payment reference submitted. An admin will verify it shortly.');
        fetchErrand();
    } catch (err) {
        alert('Failed to submit payment confirmation.');
    } finally {
        setPaying(false);
    }
  };

  const handleConfirmReceipt = async () => {
    setPaying(true);
    try {
        await api.post(`/errands/${id}/confirm-receipt`);
        alert('Errand confirmed as completed! Thank you.');
        fetchErrand();
    } catch (err) {
        alert('Failed to confirm receipt.');
    } finally {
        setPaying(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!errand) return <div className="text-center py-20 text-red-500">Errand not found.</div>;

  const statuses = [
    { key: 'requested', label: 'Requested' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'arrived', label: 'Arrived' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'awaiting_confirmation', label: 'Finished' },
    { key: 'completed', label: 'Completed' },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === errand.status);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">{errand.category}</h1>
              <p className="text-indigo-100 text-sm mt-1">Order #{errand.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">KES {totalCost}</p>
              <p className="text-xs text-indigo-100">
                {errand.payment_status === 'completed' ? 'Paid' : 
                 errand.payment_status === 'pending_verification' ? 'Pending Verification' : 'Payment Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        {Number(errand.goods_cost) > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-b flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Service: KES {errand.estimated_price}</span>
            <span>Goods: KES {errand.goods_cost}</span>
          </div>
        )}

        {/* Status Timeline */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Status Tracking</h2>
          <div className="relative">
            {statuses.map((status, index) => (
              <div key={status.key} className="flex items-center mb-4 last:mb-0">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    index <= currentStatusIndex ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
                  }`}>
                    {index < currentStatusIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : index === currentStatusIndex ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    ) : null}
                  </div>
                  {index < statuses.length - 1 && (
                    <div className={`w-0.5 h-6 ${index < currentStatusIndex ? 'bg-indigo-600' : 'bg-gray-200'}`}  />
                  )}
                </div>
                <span className={`text-sm ${index <= currentStatusIndex ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {status.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Location</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Pickup ({errand.pickup_zone})</p>
                    <p className="text-sm text-gray-800">{errand.pickup_address}</p>
                  </div>
                </div>
                {errand.delivery_address && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Delivery ({errand.delivery_zone})</p>
                      <p className="text-sm text-gray-800">{errand.delivery_address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-gray-800">{errand.description}</p>
            </div>
          </div>

          {errand.runner_id && (
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold mr-4">
                  R
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Your Runner</p>
                  <p className="text-sm font-bold text-gray-900">Runner Assigned</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-white border rounded-full text-indigo-600 hover:bg-indigo-50">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white border rounded-full text-indigo-600 hover:bg-indigo-50">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {errand.payment_status === 'pending' && (
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <Info className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-xs font-medium">
                  Notice: All costs (service fee + goods cost) must be paid upfront before the runner starts the task.
                </p>
              </div>

              {paymentSettings?.mode === 'paybill' ? (
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-indigo-700 font-bold uppercase tracking-widest">M-Pesa Paybill</p>
                    <p className="text-3xl font-black text-indigo-900 my-1">{paymentSettings.paybillNumber}</p>
                    <p className="text-sm text-indigo-700">Account: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded">{paymentSettings.accountPrefix}-{errand.id.slice(0, 4).toUpperCase()}</span></p>
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-indigo-900 mb-1">Transaction Code (e.g. RBT8...)</label>
                    <input 
                        type="text" 
                        placeholder="Enter M-Pesa Code"
                        className="w-full p-3 rounded-lg border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleManualConfirm}
                    disabled={paying}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                  >
                    {paying ? 'Submitting...' : 'I Have Paid'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSTKPush}
                  disabled={paying}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {paying ? 'Initiating M-Pesa...' : `Pay KES ${totalCost} via STK Push`}
                </button>
              )}
            </div>
          )}

          {errand.payment_status === 'pending_verification' && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                <p className="text-sm font-bold text-blue-900">Payment Verification In Progress</p>
                <p className="text-xs text-blue-700 mt-1">Reference: {errand.mpesa_receipt_number}</p>
                <p className="text-xs text-blue-600 mt-2 italic">Our team is confirming your transaction with M-Pesa. Your runner will be notified once verified.</p>
            </div>
          )}

          {errand.status === 'awaiting_confirmation' && (
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center space-y-4">
                <p className="text-indigo-900 font-bold">Runner has finished! Please confirm you've received your items/service.</p>
                {errand.completion_photo_url && (
                    <div className="my-2">
                        <img src={errand.completion_photo_url} alt="Proof of Completion" className="max-w-xs mx-auto rounded-lg shadow-sm" />
                    </div>
                )}
                <button
                    onClick={handleConfirmReceipt}
                    disabled={paying}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                    {paying ? 'Confirming...' : 'Mark as Received'}
                </button>
                <p className="text-xs text-indigo-600 italic">Note: If you don't confirm within 2 hours, it will be automatically marked as completed.</p>
            </div>
          )}

          {errand.status === 'completed' && (
            <div className="text-center pt-6 border-t">
              <p className="text-green-600 font-medium flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 mr-1" />
                Task Completed
              </p>
              <button className="mt-2 text-indigo-600 text-sm hover:underline">
                Download Invoice (PDF)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackErrand;
