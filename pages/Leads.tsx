import React, { useState } from 'react';
import { useAppStore } from '../store.tsx';
import { LeadStatus } from '../types';
import { Mail, Phone, Clock, MessageSquare, Send, Check, X, Sparkles } from 'lucide-react';
import { generateLeadEmail } from '../services/geminiService';

const Leads: React.FC = () => {
  const { leads, cars, updateLead } = useAppStore();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [draftEmail, setDraftEmail] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState(false);

  const getCarName = (id: string | null) => {
    if (!id) return 'General Inquiry';
    const car = cars.find(c => c.id === id);
    return car ? `${car.year} ${car.make} ${car.model}` : 'Unknown Vehicle';
  };

  const handleGenerateEmail = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setIsDrafting(true);
    setSelectedLeadId(leadId);
    const carInfo = getCarName(lead.interestedInId);
    const email = await generateLeadEmail(lead.name, carInfo, lead.status);
    setDraftEmail(email);
    setIsDrafting(false);
  };

  const statusColors: Record<LeadStatus, string> = {
    [LeadStatus.NEW]: 'bg-stone-200 text-stone-800',
    [LeadStatus.CONTACTED]: 'bg-amber-100 text-amber-900',
    [LeadStatus.NEGOTIATION]: 'bg-red-100 text-red-900',
    [LeadStatus.CLOSED_WON]: 'bg-emerald-100 text-emerald-900',
    [LeadStatus.CLOSED_LOST]: 'bg-stone-100 text-stone-400',
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-stone-900 font-serif">Leads & CRM</h1>
            <p className="text-stone-500">Track inquiries and communications.</p>
        </div>
        <div className="text-sm font-bold text-stone-400 uppercase tracking-widest border px-3 py-1 rounded-sm border-stone-200">
            Total Leads: {leads.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-2 space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-sm p-6 shadow-sm border border-stone-100 transition-all hover:shadow-md border-l-4 border-l-red-900">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-serif font-bold text-xl border border-stone-200">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 font-serif">{lead.name}</h3>
                    <div className="flex items-center space-x-3 text-sm text-stone-500 mt-1">
                      <div className="flex items-center gap-1"><Mail size={14} /> <span>{lead.email}</span></div>
                      <span className="text-stone-300">|</span>
                      <div className="flex items-center gap-1"><Phone size={14} /> <span>{lead.phone}</span></div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </div>

              <div className="mt-5 p-4 bg-stone-50 rounded-sm border border-stone-100">
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Interested In</p>
                <p className="text-sm font-bold text-stone-800 font-serif">{getCarName(lead.interestedInId)}</p>
              </div>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-stone-100">
                <div className="text-xs text-stone-400 flex items-center space-x-1 font-medium">
                  <Clock size={14} />
                  <span>Last Contact: {lead.lastContact}</span>
                </div>
                <div className="flex space-x-2">
                   <button 
                     onClick={() => handleGenerateEmail(lead.id)}
                     className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-stone-100 text-stone-700 hover:text-red-900 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-colors border border-stone-200"
                   >
                     <MessageSquare size={14} />
                     <span>Draft Email</span>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Email Drafter / Detail View */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white rounded-sm shadow-lg border border-stone-100 overflow-hidden">
             <div className="p-4 bg-stone-900 text-white flex justify-between items-center">
               <h3 className="font-bold flex items-center space-x-2 font-serif">
                 <Sparkles size={18} className="text-amber-500" />
                 <span>AI Email Assistant</span>
               </h3>
             </div>
             
             <div className="p-6">
               {selectedLeadId ? (
                 <>
                   {isDrafting ? (
                     <div className="h-40 flex flex-col items-center justify-center text-stone-500 space-y-4">
                       <div className="animate-spin h-8 w-8 border-4 border-red-900 border-t-transparent rounded-full"></div>
                       <p className="text-sm font-medium animate-pulse">Gemini is crafting a response...</p>
                     </div>
                   ) : (
                     <div className="space-y-5">
                       <div>
                         <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest">Subject</label>
                         <input className="w-full text-sm font-bold border-b border-stone-200 pb-2 focus:outline-none focus:border-red-900 text-stone-900" defaultValue={`Regarding your interest in ${getCarName(leads.find(l => l.id === selectedLeadId)?.interestedInId || null)}`} />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest">Body</label>
                          <textarea 
                            className="w-full h-64 text-sm p-4 bg-stone-50 rounded-sm border border-stone-200 focus:outline-none focus:border-red-900 font-medium leading-relaxed"
                            value={draftEmail}
                            onChange={(e) => setDraftEmail(e.target.value)}
                          />
                       </div>
                       <div className="flex space-x-2 pt-2">
                         <button className="flex-1 bg-red-900 text-white py-2.5 rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-red-950 flex items-center justify-center space-x-2 shadow-md">
                           <Send size={16} /> <span>Send Email</span>
                         </button>
                         <button onClick={() => setSelectedLeadId(null)} className="px-3 py-2 border border-stone-200 rounded-sm text-stone-500 hover:bg-stone-50 hover:text-red-900">
                           <X size={18} />
                         </button>
                       </div>
                     </div>
                   )}
                 </>
               ) : (
                 <div className="h-64 flex flex-col items-center justify-center text-center text-stone-400 p-4">
                   <div className="bg-stone-100 p-4 rounded-full mb-4">
                        <Mail size={32} className="text-stone-300" />
                   </div>
                   <p className="text-sm font-medium">Select a lead to generate<br/>a personalized follow-up.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;