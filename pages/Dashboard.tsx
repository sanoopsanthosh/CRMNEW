import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../store.tsx';
import { REVENUE_DATA } from '../constants';
import { DollarSign, FileText, Users, CheckCircle } from 'lucide-react';
import { CustomerStatus } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; colorClass: string; iconBgClass: string }> = ({ title, value, icon: Icon, colorClass, iconBgClass }) => (
  <div className="rounded-sm bg-white p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{title}</p>
        <h3 className={`mt-2 text-2xl font-serif font-bold ${colorClass}`}>{value}</h3>
      </div>
      <div className={`rounded-full p-3 ${iconBgClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { customers, quotations, receipts } = useAppStore();

  const totalRevenue = receipts.reduce((sum, r) => sum + r.amount, 0);
  const verifiedCustomers = customers.filter(c => c.status === CustomerStatus.VERIFIED).length;
  const pendingQuotations = quotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-4 border-b border-stone-200">
        <div>
           <h1 className="text-3xl font-bold text-stone-900 font-serif">Dashboard</h1>
           <p className="text-stone-500 mt-1">Performance overview & statistics.</p>
        </div>
        <div className="text-sm text-stone-400 italic">
            Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value={`AED ${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          colorClass="text-stone-900"
          iconBgClass="bg-red-900" 
        />
        <StatCard 
          title="Active Quotations" 
          value={pendingQuotations} 
          icon={FileText} 
          colorClass="text-stone-900"
          iconBgClass="bg-stone-600" 
        />
        <StatCard 
          title="Total Customers" 
          value={customers.length} 
          icon={Users} 
          colorClass="text-stone-900"
          iconBgClass="bg-stone-400" 
        />
        <StatCard 
          title="Verified Profiles" 
          value={verifiedCustomers} 
          icon={CheckCircle} 
          colorClass="text-stone-900"
          iconBgClass="bg-amber-600" 
        />
      </div>

      <div className="rounded-sm bg-white p-8 shadow-sm border border-stone-100">
        <h2 className="mb-6 text-lg font-bold text-stone-900 font-serif uppercase tracking-widest border-b border-stone-100 pb-2">Revenue Overview (AED)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
              <XAxis dataKey="month" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f5f5f4' }}
                contentStyle={{ backgroundColor: '#1c1917', borderRadius: '0px', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#7f1d1d" radius={[0, 0, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;