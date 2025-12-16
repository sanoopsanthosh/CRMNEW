import React, { useState } from 'react';
import { useAppStore } from '../store.tsx';
import { Receipt } from '../types';
import { Plus, Printer, Receipt as ReceiptIcon, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Receipts: React.FC = () => {
  const { receipts, addReceipt } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewReceipt, setViewReceipt] = useState<Receipt | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    amount: 0,
    vehicleDescription: '',
    paymentMethod: 'Cash' as 'Cash' | 'Card' | 'Cheque' | 'Bank Transfer'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt: Receipt = {
      id: uuidv4(),
      customerName: formData.customerName,
      amount: formData.amount,
      vehicleDescription: formData.vehicleDescription,
      paymentMethod: formData.paymentMethod,
      date: new Date().toISOString().split('T')[0]
    };
    addReceipt(newReceipt);
    setIsModalOpen(false);
    setFormData({ customerName: '', amount: 0, vehicleDescription: '', paymentMethod: 'Cash' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
            <h1 className="text-3xl font-bold text-stone-900 font-serif">Receipts</h1>
            <p className="text-stone-500">Transaction history and proofs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-red-900 text-white px-5 py-2.5 rounded-sm hover:bg-red-950 transition-colors shadow-sm uppercase tracking-wider text-sm font-bold"
        >
          <Plus size={18} />
          <span>New Receipt</span>
        </button>
      </div>

       {/* List */}
       <div className="bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden print:hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Receipt #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {receipts.map(r => (
              <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono text-stone-500 text-xs">{r.id.substring(0,8).toUpperCase()}</td>
                <td className="px-6 py-4 font-bold text-stone-900">{r.customerName}</td>
                <td className="px-6 py-4 text-stone-600">{r.vehicleDescription}</td>
                <td className="px-6 py-4 text-stone-500">{r.date}</td>
                <td className="px-6 py-4 font-bold text-red-900 font-serif text-base">AED {r.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => setViewReceipt(r)} className="text-stone-600 hover:text-red-900 font-bold text-xs uppercase tracking-wider border border-stone-200 hover:border-red-900 px-3 py-1 rounded transition-colors">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Receipt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-bold text-lg font-serif text-stone-900">Generate Receipt</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-stone-400 hover:text-stone-900"/></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Customer Name</label>
                <input required className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-900 focus:ring-0" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Vehicle Description</label>
                <input required className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-900 focus:ring-0" placeholder="e.g. 2023 BMW X5" value={formData.vehicleDescription} onChange={e => setFormData({...formData, vehicleDescription: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Amount (AED)</label>
                   <input required type="number" className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-900 focus:ring-0" value={formData.amount} onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Payment Method</label>
                   <select className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-900 focus:ring-0" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})}>
                     <option>Cash</option>
                     <option>Card</option>
                     <option>Cheque</option>
                     <option>Bank Transfer</option>
                   </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-red-900 text-white py-3 rounded-sm hover:bg-red-950 font-bold uppercase tracking-wider text-sm shadow-md">Issue Receipt</button>
            </form>
          </div>
        </div>
      )}

      {/* View Receipt */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
           <div className="bg-white w-full max-w-md rounded-none shadow-2xl overflow-hidden">
             <div className="bg-stone-900 text-white p-4 flex justify-between items-center print:hidden">
               <span className="font-bold font-serif tracking-wide">Receipt Preview</span>
               <div className="flex gap-2">
                 <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1 bg-red-800 text-white rounded-sm hover:bg-red-900 text-xs font-bold uppercase tracking-wider"><Printer size={16}/> Print</button>
                 <button onClick={() => setViewReceipt(null)} className="px-3 py-1 bg-stone-700 hover:bg-stone-600 rounded-sm text-white text-xs font-bold uppercase tracking-wider">Close</button>
               </div>
             </div>
             
             <div className="p-10 border border-stone-200 m-6 rounded-sm bg-stone-50 relative">
               {/* Watermark-ish effect */}
               <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                   <ReceiptIcon size={200} className="text-stone-900"/>
               </div>

               <div className="text-center mb-8 relative z-10">
                 <h2 className="text-2xl font-bold text-stone-900 font-serif tracking-widest uppercase border-b-2 border-stone-900 inline-block pb-1">Receipt</h2>
                 <p className="text-xs font-bold text-red-900 mt-2 uppercase tracking-widest">ETIMAD USED CAR LEASING L.L.C</p>
                 <p className="text-[10px] text-stone-400 mt-1 font-mono uppercase">ID: {viewReceipt.id.substring(0,8)}</p>
               </div>

               <div className="space-y-4 mb-8 relative z-10 text-sm">
                 <div className="flex justify-between border-b border-stone-200 pb-2">
                   <span className="text-stone-500 uppercase text-xs font-bold tracking-wider">Date</span>
                   <span className="font-bold text-stone-900">{viewReceipt.date}</span>
                 </div>
                 <div className="flex justify-between border-b border-stone-200 pb-2">
                   <span className="text-stone-500 uppercase text-xs font-bold tracking-wider">Customer</span>
                   <span className="font-bold text-stone-900">{viewReceipt.customerName}</span>
                 </div>
                 <div className="flex justify-between border-b border-stone-200 pb-2">
                   <span className="text-stone-500 uppercase text-xs font-bold tracking-wider">Mode</span>
                   <span className="font-bold text-stone-900">{viewReceipt.paymentMethod}</span>
                 </div>
                 <div className="pt-2">
                   <p className="text-xs text-stone-500 mb-1 uppercase font-bold tracking-wider">For Vehicle</p>
                   <p className="font-serif text-lg text-stone-800 italic">{viewReceipt.vehicleDescription}</p>
                 </div>
               </div>

               <div className="bg-red-900 p-4 rounded-sm text-center relative z-10 shadow-md">
                 <p className="text-[10px] text-red-200 uppercase mb-1 font-bold tracking-widest">Total Amount Received</p>
                 <p className="text-3xl font-bold text-white font-serif">AED {viewReceipt.amount.toLocaleString()}</p>
               </div>

               <div className="mt-10 text-center relative z-10">
                 <div className="inline-block border-b border-stone-400 w-40 mb-2"></div>
                 <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Authorized Signature</p>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;