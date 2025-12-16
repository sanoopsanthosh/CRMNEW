import React, { useState } from 'react';
import { useAppStore } from '../store.tsx';
import { Customer, CustomerStatus, QuestionnaireItem } from '../types';
import { Plus, Search, Mail, Check, AlertCircle, X, Send, Upload, ShieldCheck, FileText, Link as LinkIcon, Copy, ExternalLink, HelpCircle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Customers: React.FC = () => {
  const { customers, addCustomer, verifyCustomer, submitDocuments } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  
  // Verification Flow State
  const [isGenerateLinkModalOpen, setIsGenerateLinkModalOpen] = useState(false);
  const [isCustomerPortalModalOpen, setIsCustomerPortalModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConfirmVerifyOpen, setIsConfirmVerifyOpen] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Customer Form
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ name: '', email: '', phone: '', notes: '' });

  // Verification Config (Admin Side)
  const [customQuestions, setCustomQuestions] = useState<string[]>(['Are you a resident of UAE?', 'Do you have a valid Emirates ID?']);
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  // Customer Portal Data (Simulation)
  const [verificationData, setVerificationData] = useState({ idNumber: '', expiryDate: '' });
  const [portalAnswers, setPortalAnswers] = useState<string[]>([]);

  // Filter
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.email) {
      addCustomer({
        id: uuidv4(),
        name: newCustomer.name!,
        email: newCustomer.email!,
        phone: newCustomer.phone || '',
        status: CustomerStatus.PENDING,
        notes: newCustomer.notes || '',
        joinedDate: new Date().toISOString().split('T')[0]
      });
      setIsModalOpen(false);
      setNewCustomer({ name: '', email: '', phone: '', notes: '' });
    }
  };

  const openMailModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsMailModalOpen(true);
  };

  // Step 1: Open Generate Link Modal
  const openGenerateLinkModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setGeneratedLink(null);
    setCustomQuestions(['Are you a resident of UAE?', 'Do you have a valid Emirates ID?']); // Reset defaults
    setIsGenerateLinkModalOpen(true);
  };

  const handleAddQuestion = () => {
    if (newQuestionInput.trim()) {
      setCustomQuestions([...customQuestions, newQuestionInput.trim()]);
      setNewQuestionInput('');
    }
  };

  const removeQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleGenerateLink = () => {
    const mockLink = `https://etimad.crm/verify/${selectedCustomer?.id || 'xyz'}?token=${uuidv4().substring(0,8)}`;
    setGeneratedLink(mockLink);
  };

  const handleSimulateCustomerView = () => {
    setIsGenerateLinkModalOpen(false);
    // Initialize empty answers for the portal
    setPortalAnswers(new Array(customQuestions.length).fill(''));
    setVerificationData({ idNumber: '', expiryDate: '' });
    setIsCustomerPortalModalOpen(true);
  };

  // Step 2: Customer Portal Submit
  const handlePortalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomer) {
      const questionnaire: QuestionnaireItem[] = customQuestions.map((q, i) => ({
        question: q,
        answer: portalAnswers[i]
      }));

      submitDocuments(selectedCustomer.id, {
        idNumber: verificationData.idNumber,
        expiryDate: verificationData.expiryDate,
        documentUrl: 'mock-doc-url',
        questionnaire: questionnaire
      });
      setIsCustomerPortalModalOpen(false);
    }
  };

  // Step 3: Admin Review
  const openReviewModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsReviewModalOpen(true);
  };

  const handleTriggerVerify = () => {
    setIsConfirmVerifyOpen(true);
  };

  const handleFinalVerify = () => {
    if (selectedCustomer) {
      verifyCustomer(selectedCustomer.id);
      setIsConfirmVerifyOpen(false);
      setIsReviewModalOpen(false);
    }
  };

  const handleSendMail = () => {
    alert(`Confirmation email sent to ${selectedCustomer?.email}`);
    setIsMailModalOpen(false);
  };

  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.VERIFIED: return 'bg-emerald-100 text-emerald-900 border border-emerald-200';
      case CustomerStatus.ACTION_REQUIRED: return 'bg-amber-100 text-amber-900 border border-amber-200';
      default: return 'bg-stone-100 text-stone-600 border border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-stone-900 font-serif">Customers</h1>
           <p className="text-stone-500">Directory & Verification</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-red-900 text-white px-5 py-2.5 rounded hover:bg-red-950 transition-colors shadow-sm uppercase tracking-wider text-sm font-medium"
        >
          <Plus size={18} />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-sm border border-stone-100 flex items-center">
        <Search className="text-stone-400 mr-2" size={20} />
        <input 
          type="text"
          placeholder="Search by name or phone..."
          className="flex-1 outline-none text-stone-700 placeholder-stone-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-stone-900">{customer.name}</td>
                  <td className="px-6 py-4 text-stone-600">
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.email}</span>
                      <span className="text-stone-400 text-xs">{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${getStatusColor(customer.status)}`}>
                      {customer.status === CustomerStatus.VERIFIED && <Check size={12} className="mr-1"/>}
                      {customer.status === CustomerStatus.ACTION_REQUIRED && <AlertCircle size={12} className="mr-1"/>}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500 truncate max-w-xs">{customer.notes}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {customer.status === CustomerStatus.PENDING && (
                       <button 
                       onClick={() => openGenerateLinkModal(customer)}
                       className="text-stone-600 hover:text-red-800 font-bold text-xs uppercase tracking-wider border border-stone-200 hover:border-red-800 px-3 py-1.5 rounded inline-flex items-center gap-1 transition-colors"
                       title="Initiate Verification"
                     >
                       <ShieldCheck size={14}/> Verify
                     </button>
                    )}
                    {customer.status === CustomerStatus.ACTION_REQUIRED && (
                       <button 
                       onClick={() => openReviewModal(customer)}
                       className="text-amber-700 hover:text-amber-900 font-bold text-xs uppercase tracking-wider border border-amber-200 hover:border-amber-500 px-3 py-1.5 rounded inline-flex items-center gap-1 transition-colors"
                     >
                       <ShieldCheck size={14}/> Review
                     </button>
                    )}
                    <button 
                      onClick={() => openMailModal(customer)}
                      className="text-red-900 hover:text-red-700 font-bold text-xs uppercase tracking-wider border border-red-100 hover:border-red-900 px-3 py-1.5 rounded transition-colors"
                    >
                      Mail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center text-stone-500 italic">No customers found.</div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-md">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-bold text-lg font-serif text-stone-900">Add New Customer</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-stone-400 hover:text-stone-900"/></button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Full Name</label>
                <input required className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-800 focus:ring-0" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Email</label>
                <input required type="email" className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-800 focus:ring-0" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Phone</label>
                <input className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-800 focus:ring-0" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Notes</label>
                <textarea className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-800 focus:ring-0" value={newCustomer.notes} onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-red-900 text-white py-3 rounded-sm hover:bg-red-950 font-bold uppercase tracking-wider text-sm shadow-md">Save Customer</button>
            </form>
          </div>
        </div>
      )}

      {/* Generate Link Modal */}
      {isGenerateLinkModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
           <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden">
             <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
               <h3 className="font-bold text-lg flex items-center gap-2 text-stone-900 font-serif">
                 <LinkIcon size={20} className="text-red-900"/> Verification Link
               </h3>
               <button onClick={() => setIsGenerateLinkModalOpen(false)} className="text-stone-400 hover:text-stone-900"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-6">
                <div>
                   <label className="block text-sm font-bold text-stone-900 mb-2 font-serif">Security Questions</label>
                   <div className="space-y-2 mb-3">
                     {customQuestions.map((q, idx) => (
                       <div key={idx} className="flex items-center justify-between bg-stone-50 px-3 py-2 rounded border border-stone-200">
                          <span className="text-sm text-stone-700">{q}</span>
                          <button onClick={() => removeQuestion(idx)} className="text-stone-400 hover:text-red-900"><Trash2 size={14}/></button>
                       </div>
                     ))}
                   </div>
                   <div className="flex gap-2">
                     <input 
                       className="flex-1 border border-stone-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-red-900"
                       placeholder="Add a question..."
                       value={newQuestionInput}
                       onChange={(e) => setNewQuestionInput(e.target.value)}
                       disabled={!!generatedLink}
                     />
                     <button 
                      onClick={handleAddQuestion}
                      disabled={!!generatedLink}
                      className="px-3 py-2 bg-stone-200 text-stone-700 rounded-sm hover:bg-stone-300 disabled:opacity-50"
                     >
                       <Plus size={16}/>
                     </button>
                   </div>
                </div>

                {!generatedLink ? (
                  <button 
                    onClick={handleGenerateLink}
                    className="w-full py-3 bg-red-900 text-white font-bold rounded-sm hover:bg-red-950 transition-colors shadow-lg uppercase tracking-wider text-sm"
                  >
                    Generate Link
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-sm">
                       <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Unique Link Generated</label>
                       <div className="flex items-center gap-2">
                         <code className="flex-1 bg-white px-2 py-1 rounded border border-emerald-100 text-xs text-emerald-800 break-all">{generatedLink}</code>
                         <button className="text-emerald-700 hover:text-emerald-900" title="Copy"><Copy size={16}/></button>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={handleSimulateCustomerView}
                        className="w-full py-3 bg-stone-800 text-white font-bold rounded-sm hover:bg-stone-900 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                      >
                         <ExternalLink size={18}/> Simulate Portal
                      </button>
                    </div>
                  </div>
                )}
             </div>
           </div>
        </div>
      )}

      {/* Customer Portal Modal (Simulation) */}
      {isCustomerPortalModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <div>
                 <h3 className="font-bold text-xl text-stone-900 font-serif">ETIMAD Portal</h3>
                 <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Identity Verification</p>
              </div>
              <button onClick={() => setIsCustomerPortalModalOpen(false)} className="text-stone-500"><X size={20}/></button>
            </div>
            <form onSubmit={handlePortalSubmit} className="p-8 space-y-8">
               {/* Questionnaire Section */}
               {customQuestions.length > 0 && (
                 <div className="space-y-4">
                   <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2 font-serif uppercase tracking-wide">1. Security Questions</h4>
                   {customQuestions.map((q, idx) => (
                     <div key={idx}>
                       <label className="block text-sm font-medium text-stone-700 mb-1">{q}</label>
                       <input 
                         required
                         className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-900 focus:ring-0 text-sm"
                         value={portalAnswers[idx]}
                         onChange={(e) => {
                           const newAnswers = [...portalAnswers];
                           newAnswers[idx] = e.target.value;
                           setPortalAnswers(newAnswers);
                         }}
                         placeholder="Your answer"
                       />
                     </div>
                   ))}
                 </div>
               )}

               {/* Document Upload Section */}
               <div className="space-y-4">
                 <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2 font-serif uppercase tracking-wide">2. Document Upload</h4>
                 <div className="bg-stone-50 p-5 rounded-sm border border-stone-200">
                   <p className="text-sm text-stone-600 mb-3 font-medium">Please provide your Emirates ID details.</p>
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">ID Number</label>
                        <input 
                          required 
                          placeholder="784-XXXX-XXXXXXX-X"
                          className="w-full border border-stone-300 rounded-sm p-2 text-sm focus:border-red-900 focus:ring-0" 
                          value={verificationData.idNumber} 
                          onChange={e => setVerificationData({...verificationData, idNumber: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Expiry Date</label>
                        <input 
                          required 
                          type="date"
                          className="w-full border border-stone-300 rounded-sm p-2 text-sm focus:border-red-900 focus:ring-0" 
                          value={verificationData.expiryDate} 
                          onChange={e => setVerificationData({...verificationData, expiryDate: e.target.value})} 
                        />
                      </div>
                      <div className="border-2 border-dashed border-stone-300 rounded-sm p-6 text-center bg-white cursor-pointer hover:border-red-900 transition-colors group">
                         <Upload size={24} className="mx-auto text-stone-400 mb-2 group-hover:text-red-900"/>
                         <span className="text-xs text-stone-500 group-hover:text-red-900 font-bold uppercase">Upload Front/Back of ID</span>
                      </div>
                   </div>
                 </div>
               </div>

               <div className="pt-2">
                 <button type="submit" className="w-full bg-red-900 text-white py-3 rounded-sm hover:bg-red-950 font-bold uppercase tracking-wider shadow-lg">
                   Submit Verification
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal (Admin View) */}
      {isReviewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-amber-50">
              <h3 className="font-bold text-lg flex items-center gap-2 text-amber-900 font-serif">
                <ShieldCheck size={20} /> Review Verification
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-amber-900"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
               <div className="flex items-start gap-4 pb-4 border-b border-stone-100">
                  <div className="h-12 w-12 bg-stone-900 text-white rounded-full flex items-center justify-center text-xl font-bold font-serif">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-stone-900 font-serif">{selectedCustomer.name}</h4>
                    <p className="text-sm text-stone-500">{selectedCustomer.email}</p>
                  </div>
               </div>

               {/* Answers Review */}
               {selectedCustomer.verificationDetails?.questionnaire && (
                 <div className="bg-stone-50 border border-stone-200 rounded-sm p-4 space-y-3">
                   <h5 className="font-bold text-xs text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-2 flex items-center gap-2">
                     <HelpCircle size={14}/> Questionnaire
                   </h5>
                   <div className="space-y-3">
                      {selectedCustomer.verificationDetails.questionnaire.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="text-stone-500 text-xs mb-0.5">{item.question}</p>
                          <p className="font-medium text-stone-900">{item.answer}</p>
                        </div>
                      ))}
                   </div>
                 </div>
               )}

               {/* ID Review */}
               <div className="bg-stone-50 border border-stone-200 rounded-sm p-4 space-y-3">
                 <h5 className="font-bold text-xs text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-2 flex items-center gap-2">
                   <FileText size={14}/> Documents
                 </h5>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <p className="text-stone-500 text-xs">ID Number</p>
                     <p className="font-bold text-stone-900">{selectedCustomer.verificationDetails?.idNumber || 'N/A'}</p>
                   </div>
                   <div>
                     <p className="text-stone-500 text-xs">Expiry Date</p>
                     <p className="font-bold text-stone-900">{selectedCustomer.verificationDetails?.expiryDate || 'N/A'}</p>
                   </div>
                   <div className="col-span-2">
                     <p className="text-stone-500 text-xs mb-1">Attachment</p>
                     <div className="flex items-center gap-2 p-2 bg-white border border-stone-200 rounded-sm text-stone-700">
                       <FileText size={16}/>
                       <span className="font-medium">emirates_id_scan.pdf</span>
                       <span className="text-xs text-stone-400 ml-auto">(Mock)</span>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="flex gap-3 pt-4">
                 <button onClick={() => setIsReviewModalOpen(false)} className="flex-1 border border-stone-300 text-stone-700 py-2.5 rounded-sm hover:bg-stone-50 font-bold uppercase tracking-wider text-xs">
                   Reject
                 </button>
                 <button onClick={handleTriggerVerify} className="flex-1 bg-emerald-700 text-white py-2.5 rounded-sm hover:bg-emerald-800 font-bold uppercase tracking-wider text-xs shadow-md">
                   Approve
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {isConfirmVerifyOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-sm p-8 transform transition-all scale-100 text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 mx-auto mb-5 border border-emerald-100">
              <ShieldCheck className="text-emerald-700" size={32} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 font-serif">Confirm Verification</h3>
            <p className="text-sm text-stone-500 mb-8 leading-relaxed">
              Are you sure you want to verify <strong>{selectedCustomer?.name}</strong>?<br/>This will grant them verified status.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsConfirmVerifyOpen(false)}
                className="flex-1 px-4 py-2 bg-white border border-stone-300 rounded-sm text-stone-700 hover:bg-stone-50 font-bold uppercase text-xs tracking-wider"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalVerify}
                className="flex-1 px-4 py-2 bg-emerald-700 text-white rounded-sm hover:bg-emerald-800 font-bold uppercase text-xs tracking-wider shadow-md"
              >
                Yes, Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mail Modal */}
      {isMailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg">
             <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-bold text-lg flex items-center gap-2 font-serif text-stone-900"><Mail size={18} className="text-red-900" /> Send Mail</h3>
              <button onClick={() => setIsMailModalOpen(false)}><X size={20} className="text-stone-400 hover:text-stone-900"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-stone-50 p-3 rounded-sm text-sm text-stone-600 border border-stone-100">
                <span className="font-bold uppercase text-xs tracking-wider text-stone-400 mr-2">To:</span> {selectedCustomer.name} &lt;{selectedCustomer.email}&gt;
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Subject</label>
                <input className="w-full border border-stone-300 rounded-sm p-2 focus:border-red-900 focus:ring-0" defaultValue="Showroom Visit Confirmation" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Message</label>
                <textarea 
                  className="w-full border border-stone-300 rounded-sm p-3 h-32 focus:border-red-900 focus:ring-0" 
                  defaultValue={`Dear ${selectedCustomer.name},\n\nThis is to confirm your verification with ETIMAD Showroom. We are excited to do business with you.\n\nBest Regards,\nSales Team`}
                />
              </div>
              <button onClick={handleSendMail} className="w-full bg-red-900 text-white py-3 rounded-sm hover:bg-red-950 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm shadow-md">
                <Send size={16} /> Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;