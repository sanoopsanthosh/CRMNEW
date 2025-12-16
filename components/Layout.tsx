import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // If we are on the Shop page, do not render the sidebar layout
  if (location.pathname === '/shop') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 shadow-sm lg:hidden">
           <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-stone-500 hover:text-stone-700"
              >
                <Menu size={24} />
              </button>
              <span className="font-bold text-stone-900 font-serif">ETIMAD</span>
           </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
           <div className="mx-auto max-w-7xl">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;