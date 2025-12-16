import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Receipt, Menu, X, Car, AlignJustify } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Inventory', icon: Car, path: '/inventory' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Quotations', icon: FileText, path: '/quotations' },
    { name: 'Receipts', icon: Receipt, path: '/receipts' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden print:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-stone-900 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} print:hidden`}>
        <div className="flex h-24 items-center justify-between px-6 border-b border-stone-800">
          <div className="flex items-center space-x-3">
            {/* Logo Mark mimicking the Red Square with white lines */}
            <div className="h-10 w-10 bg-red-700 flex items-center justify-center shadow-lg shadow-red-900/50 flex-shrink-0">
               <AlignJustify className="text-white" size={24} strokeWidth={3} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xl font-sans font-bold tracking-widest uppercase leading-none text-white">ETIMAD</span>
              <span className="text-[9px] bg-red-700 text-white px-1 py-0.5 mt-1 uppercase font-bold tracking-wider rounded-sm w-fit whitespace-nowrap">Used Car Leasing L.L.C</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-stone-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 rounded px-4 py-3 transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-red-900 text-white border-l-4 border-red-500 shadow-lg'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? "text-red-200" : ""} />
              <span className="font-medium tracking-wide">{item.name}</span>
            </Link>
          ))}
          
           {/* Link to AI Assistant */}
           <Link
              to="/leads" 
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 rounded px-4 py-3 transition-all duration-200 ${
                isActive('/leads')
                  ? 'bg-red-900 text-white border-l-4 border-red-500 shadow-lg'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Users size={20} />
              <span className="font-medium tracking-wide">Leads & CRM</span>
           </Link>
        </nav>

        <div className="absolute bottom-8 w-full px-4">
           <div className="rounded-lg bg-stone-800 p-4 border border-stone-700">
             <div className="flex items-center space-x-3">
               <div className="h-10 w-10 rounded-full bg-stone-700 flex items-center justify-center border border-stone-600">
                  <span className="font-serif font-bold text-stone-300">JD</span>
               </div>
               <div>
                 <p className="text-sm font-semibold text-stone-200">John Doe</p>
                 <p className="text-xs text-stone-500 uppercase tracking-wide">Sales Manager</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;