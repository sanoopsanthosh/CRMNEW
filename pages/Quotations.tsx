import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store.tsx';
import { Quotation } from '../types';
import { Plus, Printer, FileText, Search, X, Calculator, CheckSquare, Wrench, Sparkles, CarFront, Settings, Edit3, User, UserPlus, AlignJustify } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ADD_ON_OPTIONS = [
  "Free Service",
  "Change Tyres",
  "Registration",
  "Polishing",
  "Interior Deep Clean",
  "Exterior Clean"
];

const DEFAULT_TERMS = "All prices are in UAE Dirhams (AED).\nThis quotation is valid for 7 days from the date of issue.\nVehicle delivery is subject to clearance of full payment.\nRegistration and insurance fees are not included unless specified.";

const Quotations: React.FC = () => {
  const { quotations, customers, addQuotation } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewQuotation, setViewQuotation] = useState<Quotation | null>(null);
  
  // Terms & Conditions State
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [standardTerms, setStandardTerms] = useState(DEFAULT_TERMS);

  // Form State
  const [isManualCustomer, setIsManualCustomer] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    manualName: '',
    manualPhone: '',
    manualEmail: '',
    make: '', 
    model: '', 
    year: new Date().getFullYear(), 
    price: 0,
    // Finance fields
    downPayment: 0,
    tenure: 12, // Default 12 months
    // Add-ons
    addOns: [] as string[]
  });

  // Derived calculations for the form
  const balanceAmount = Math.max(0, formData.price - formData.downPayment);
  const monthlyPayment = formData.tenure > 0 ? balanceAmount / formData.tenure : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    let customerId = formData.customerId;
    let customerName = '';
    let customerPhone = '';
    let customerEmail = '';

    if (isManualCustomer) {
        if (!formData.manualName) return;
        customerId = 'MANUAL';
        customerName = formData.manualName;
        customerPhone = formData.manualPhone;
        customerEmail = formData.manualEmail;
    } else {
        const customer = customers.find(c => c.id === formData.customerId);
        if (!customer) return;
        customerName = customer.name;
        customerPhone = customer.phone;
        customerEmail = customer.email;
    }

    const newQuotation: Quotation = {
      id: uuidv4(),
      customerId: customerId,
      customerName: customerName,
      customerPhone: customerPhone,
      customerEmail: customerEmail,
      vehicleMake: formData.make,
      vehicleModel: formData.model,
      vehicleYear: formData.year,
      price: formData.price,
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      downPayment: formData.downPayment,
      tenure: formData.tenure,
      monthlyPayment: monthlyPayment,
      addOns: formData.addOns
    };
    addQuotation(newQuotation);
    setIsModalOpen(false);
    setFormData({ 
      customerId: '', 
      manualName: '',
      manualPhone: '',
      manualEmail: '',
      make: '', 
      model: '', 
      year: new Date().getFullYear(), 
      price: 0, 
      downPayment: 0, 
      tenure: 12,
      addOns: []
    });
    setIsManualCustomer(false);
  };

  const toggleAddOn = (addOn: string) => {
    setFormData(prev => {
      if (prev.addOns.includes(addOn)) {
        return { ...prev, addOns: prev.addOns.filter(a => a !== addOn) };
      } else {
        return { ...prev, addOns: [...prev.addOns, addOn] };
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const saveTerms = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTerms = formData.get('terms') as string;
    setStandardTerms(newTerms);
    setIsTermsModalOpen(false);
  };

  return (
    <div className="space-y-6">
        {/* Style block for print optimization */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-area, #printable-area * {
              visibility: visible;
            }
            #printable-area {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background: white;
              z-index: 9999;
              overflow: visible;
            }
            /* Hide UI elements that shouldn't print */
            .no-print {
              display: none !important;
            }
          }
        `}</style>

       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Quotations</h1>
        <div className="flex gap-3">
            <button 
              onClick={() => setIsTermsModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Settings size={20} />
              <span>Edit Terms</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span>Create Quotation</span>
            </button>
        </div>
      </div>

      {/* List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
        {quotations.map(q => (
          <div key={q.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewQuotation(q)}>
             <div className="flex justify-between items-start mb-3">
               <div>
                 <h3 className="font-bold text-slate-900">{q.vehicleYear} {q.vehicleMake} {q.vehicleModel}</h3>
                 <p className="text-sm text-slate-500">To: {q.customerName}</p>
               </div>
               <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">{q.status}</span>
             </div>
             <div className="flex justify-between items-center pt-3 border-t border-slate-50">
               <span className="text-sm text-slate-400">{q.date}</span>
               <div className="text-right">
                  <span className="block font-bold text-red-700">AED {q.price.toLocaleString()}</span>
                  {q.monthlyPayment && q.monthlyPayment > 0 && (
                    <span className="text-xs text-slate-500">AED {Math.round(q.monthlyPayment).toLocaleString()}/mo</span>
                  )}
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Terms Modal */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm print:hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <FileText size={20} /> Standard Terms & Conditions
                    </h3>
                    <button onClick={() => setIsTermsModalOpen(false)}><X size={20}/></button>
                </div>
                <form onSubmit={saveTerms} className="p-5">
                    <p className="text-sm text-slate-500 mb-4">
                        Edit the default terms and conditions that appear on all printed quotations.
                    </p>
                    <textarea 
                        name="terms"
                        className="w-full h-48 border border-slate-200 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
                        defaultValue={standardTerms}
                        placeholder="Enter terms and conditions here..."
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsTermsModalOpen(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                        >
                            Save Terms
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50 rounded-t-xl">
              <h2 className="text-xl font-bold text-red-900">New Quotation</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-red-900"><X size={24}/></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              
              {/* Customer Section */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Customer Details</label>
                    <button 
                        type="button"
                        onClick={() => setIsManualCustomer(!isManualCustomer)}
                        className="text-xs font-bold text-red-800 hover:underline flex items-center gap-1 uppercase tracking-wider"
                    >
                        {isManualCustomer ? <><User size={14}/> Select Existing</> : <><UserPlus size={14}/> Manual Entry</>}
                    </button>
                </div>
                
                {!isManualCustomer ? (
                     <select 
                        required
                        className="w-full border rounded-lg p-3 focus:ring-red-500 focus:border-red-500 bg-white"
                        value={formData.customerId}
                        onChange={e => setFormData({...formData, customerId: e.target.value})}
                     >
                        <option value="">-- Select Customer --</option>
                        {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                        ))}
                     </select>
                ) : (
                    <div className="space-y-3 animate-fade-in">
                        <input 
                            required
                            placeholder="Full Name"
                            className="w-full border rounded-lg p-3 bg-white focus:border-red-500"
                            value={formData.manualName}
                            onChange={e => setFormData({...formData, manualName: e.target.value})}
                        />
                         <div className="grid grid-cols-2 gap-3">
                            <input 
                                placeholder="Phone Number (Optional)"
                                className="w-full border rounded-lg p-3 bg-white focus:border-red-500"
                                value={formData.manualPhone}
                                onChange={e => setFormData({...formData, manualPhone: e.target.value})}
                            />
                             <input 
                                type="email"
                                placeholder="Email (Optional)"
                                className="w-full border rounded-lg p-3 bg-white focus:border-red-500"
                                value={formData.manualEmail}
                                onChange={e => setFormData({...formData, manualEmail: e.target.value})}
                            />
                         </div>
                    </div>
                )}
              </div>

              {/* Vehicle Section */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FileText size={16}/> Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Make</label>
                    <input required className="w-full border rounded-lg p-2 bg-white" placeholder="Toyota" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                    <input required className="w-full border rounded-lg p-2 bg-white" placeholder="Camry" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                    <input required type="number" className="w-full border rounded-lg p-2 bg-white" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
                  </div>
                </div>
              </div>

              {/* Finance Section */}
              <div className="bg-red-50 p-4 rounded-lg space-y-4 border border-red-100">
                <h3 className="font-semibold text-red-900 flex items-center gap-2"><Calculator size={16}/> Payment Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-red-900 mb-1">Vehicle Price (AED)</label>
                    <input 
                      required 
                      type="number" 
                      className="w-full border border-red-200 rounded-lg p-2 bg-white font-bold" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-900 mb-1">Down Payment</label>
                    <input 
                      type="number" 
                      className="w-full border border-red-200 rounded-lg p-2 bg-white" 
                      value={formData.downPayment} 
                      onChange={e => setFormData({...formData, downPayment: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-900 mb-1">Tenure (Months)</label>
                    <input 
                      type="number" 
                      className="w-full border border-red-200 rounded-lg p-2 bg-white" 
                      value={formData.tenure} 
                      onChange={e => setFormData({...formData, tenure: parseInt(e.target.value) || 1})} 
                    />
                  </div>
                </div>
                
                {/* Calculation Preview */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-red-200 mt-2">
                   <div>
                      <span className="text-xs text-red-700 uppercase font-bold">Balance Amount</span>
                      <p className="text-lg font-medium text-red-900">AED {balanceAmount.toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                      <span className="text-xs text-red-700 uppercase font-bold">Monthly Payment</span>
                      <p className="text-xl font-bold text-red-900">AED {Math.round(monthlyPayment).toLocaleString()}</p>
                   </div>
                </div>
              </div>

              {/* Add-ons Section */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2"><CheckSquare size={16}/> Included Add-ons</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ADD_ON_OPTIONS.map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer p-2 bg-white border border-slate-200 rounded hover:border-red-300">
                      <input 
                        type="checkbox" 
                        className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                        checked={formData.addOns.includes(option)}
                        onChange={() => toggleAddOn(option)}
                      />
                      <span className="text-sm text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-red-800 text-white py-3 rounded-lg hover:bg-red-900 font-medium text-lg shadow-lg shadow-red-200">Generate Quotation</button>
            </form>
          </div>
        </div>
      )}

      {/* View/Print Modal - Luxury Red Theme */}
      {viewQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm print:p-0 print:bg-white print:static print:block">
           <div className="bg-white w-full max-w-4xl min-h-[600px] rounded-none shadow-2xl flex flex-col overflow-hidden max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:w-full print:h-full">
             {/* Print Controls */}
             <div className="bg-stone-900 text-white p-4 flex justify-between items-center print:hidden">
               <span className="font-bold tracking-widest uppercase text-sm">Quotation Preview</span>
               <div className="flex gap-2">
                 <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 text-sm font-medium uppercase tracking-wide"><Printer size={16}/> Print</button>
                 <button onClick={() => setViewQuotation(null)} className="px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded text-white text-sm font-medium uppercase tracking-wide">Close</button>
               </div>
             </div>

             {/* Printable Area - Luxury Red Design */}
             <div className="p-12 flex-1 bg-white relative" id="printable-area">
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-red-800 flex">
                    <div className="w-1/3 h-full bg-red-900"></div>
                    <div className="w-1/3 h-full bg-red-800"></div>
                    <div className="w-1/3 h-full bg-black"></div>
                </div>

                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-red-900 pb-8 mb-10 mt-4">
                   <div className="flex items-center gap-4">
                      {/* Brand Logo Area */}
                      <div className="h-16 w-16 bg-red-800 flex items-center justify-center shadow-sm">
                         <AlignJustify className="text-white" size={40} strokeWidth={3} />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold text-stone-900 uppercase tracking-widest leading-none">ETIMAD</h1>
                        <div className="bg-red-800 text-white px-2 py-1 mt-1 inline-block">
                             <p className="text-xs font-bold tracking-[0.2em] uppercase">Used Car Leasing L.L.C</p>
                        </div>
                     </div>
                   </div>
                   <div className="text-right">
                     <h2 className="text-4xl font-light text-red-900 uppercase tracking-widest">Quotation</h2>
                     <p className="text-stone-500 mt-2 font-mono">REF: {viewQuotation.id.substring(0,8).toUpperCase()}</p>
                   </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-widest mb-4 border-b border-red-100 pb-1">Customer Details</h3>
                    <p className="font-serif text-2xl text-stone-900 mb-1">{viewQuotation.customerName}</p>
                    <p className="text-stone-600">{viewQuotation.customerPhone || customers.find(c => c.id === viewQuotation.customerId)?.phone}</p>
                    <p className="text-stone-600">{viewQuotation.customerEmail || customers.find(c => c.id === viewQuotation.customerId)?.email}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-widest mb-4 border-b border-red-100 pb-1 justify-end flex">Quotation Info</h3>
                    <div className="inline-block text-left">
                        <div className="flex justify-between gap-8 mb-1">
                            <span className="text-stone-500 text-sm uppercase tracking-wide">Date:</span>
                            <span className="font-medium text-stone-900">{viewQuotation.date}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-stone-500 text-sm uppercase tracking-wide">Valid Until:</span>
                            <span className="font-medium text-stone-900">7 Days</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Table */}
                <div className="mb-10">
                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-widest mb-3">Vehicle Specification</h3>
                    <table className="w-full">
                        <thead className="bg-stone-900 text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="py-3 px-4 text-left font-medium">Description</th>
                                <th className="py-3 px-4 text-left font-medium">Model Year</th>
                                <th className="py-3 px-4 text-right font-medium">Unit Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-stone-200">
                                <td className="py-4 px-4">
                                    <p className="font-bold text-lg text-stone-900">{viewQuotation.vehicleMake} {viewQuotation.vehicleModel}</p>
                                    <p className="text-sm text-stone-500 italic mt-1">Luxury Edition / Full Option</p>
                                </td>
                                <td className="py-4 px-4 text-stone-700">{viewQuotation.vehicleYear}</td>
                                <td className="py-4 px-4 text-right font-serif text-lg">AED {viewQuotation.price.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-2 gap-10">
                    {/* Left Column: Add-ons & Services */}
                    <div>
                         {viewQuotation.addOns && viewQuotation.addOns.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-red-900 uppercase tracking-widest mb-3 border-b border-red-100 pb-2">Complimentary Services</h3>
                                <div className="bg-stone-50 p-4 border-l-4 border-red-900">
                                    <ul className="space-y-2">
                                        {viewQuotation.addOns.map((addon, index) => (
                                            <li key={index} className="flex items-center gap-3 text-sm text-stone-700">
                                                <div className="w-1.5 h-1.5 bg-red-900 rounded-full"></div>
                                                <span className="uppercase tracking-wide text-xs font-medium">{addon}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                         )}
                         
                         {/* Terms Snippet */}
                         <div className="text-xs text-stone-400 leading-relaxed mt-8">
                            <p className="font-bold text-stone-500 uppercase mb-1">Terms & Conditions</p>
                            <p className="whitespace-pre-wrap">{standardTerms}</p>
                         </div>
                    </div>

                    {/* Right Column: Financials */}
                    <div>
                         <div className="bg-stone-50 p-6 rounded-sm border border-stone-100">
                            <h3 className="text-xs font-bold text-red-900 uppercase tracking-widest mb-6 text-center">Financial Breakdown</h3>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Vehicle Price</span>
                                    <span className="font-medium text-stone-900">AED {viewQuotation.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Down Payment</span>
                                    <span className="font-medium text-red-700">- AED {(viewQuotation.downPayment || 0).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-stone-200 my-2"></div>
                                <div className="flex justify-between text-base">
                                    <span className="font-bold text-stone-800 uppercase text-xs tracking-wider pt-1">Balance Amount</span>
                                    <span className="font-bold text-stone-900">AED {Math.max(0, viewQuotation.price - (viewQuotation.downPayment || 0)).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-red-900 text-white p-4 text-center rounded-sm shadow-md">
                                <p className="text-xs uppercase tracking-widest text-red-200 mb-1">Estimated Monthly Installment</p>
                                <p className="text-3xl font-serif">AED {Math.round(viewQuotation.monthlyPayment || 0).toLocaleString()}</p>
                                <p className="text-xs text-red-200 mt-1">for {viewQuotation.tenure || 0} Months</p>
                            </div>
                         </div>
                         
                         <div className="mt-8 pt-4 border-t-2 border-stone-100 text-right">
                             <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-8">Authorized Signature</p>
                             <div className="h-px bg-stone-300 w-48 ml-auto"></div>
                         </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-stone-900 text-stone-400 text-[10px] py-3 px-12 flex justify-between uppercase tracking-widest">
                    <span>ETIMAD USED CAR LEASING L.L.C</span>
                    <span>Dubai, United Arab Emirates</span>
                    <span>+971 4 123 4567</span>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Quotations;