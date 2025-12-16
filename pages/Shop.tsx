import React, { useState } from 'react';
import { useAppStore } from '../store.tsx';
import { CarStatus } from '../types';
import { Search, Filter, Phone, MessageCircle, AlignJustify, ArrowRight } from 'lucide-react';

const Shop: React.FC = () => {
  const { cars } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('All');

  // Get unique makes for filter
  const makes = ['All', ...Array.from(new Set(cars.map(c => c.make)))];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMake = selectedMake === 'All' || car.make === selectedMake;
    // Only show available or reserved cars, hide sold ones usually, or show them as sold
    return matchesSearch && matchesMake;
  });

  const handleWhatsApp = (carName: string) => {
    // In a real app, this would be a real number
    const message = `Hi ETIMAD, I am interested in the ${carName}.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Navbar */}
      <nav className="bg-stone-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
             <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-red-700 flex items-center justify-center shadow-lg shadow-red-900/50 flex-shrink-0">
                   <AlignJustify className="text-white" size={24} strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-widest uppercase leading-none">ETIMAD</span>
                  <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1">Used Car Leasing L.L.C</span>
                </div>
             </div>
             <div className="hidden md:flex items-center space-x-8">
               <a href="#" className="text-stone-300 hover:text-white uppercase tracking-wider text-xs font-bold transition-colors">Home</a>
               <a href="#" className="text-white uppercase tracking-wider text-xs font-bold border-b-2 border-red-700 pb-1">Inventory</a>
               <a href="#" className="text-stone-300 hover:text-white uppercase tracking-wider text-xs font-bold transition-colors">Services</a>
               <button className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-sm uppercase tracking-wider text-xs font-bold transition-colors">
                 Contact Us
               </button>
             </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-stone-800 text-white py-20 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-black opacity-40"></div>
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Discover Luxury</h1>
            <p className="text-stone-200 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Experience the finest selection of premium pre-owned vehicles in Dubai. Quality, Trust, and ETIMAD.
            </p>
         </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
           <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {makes.map(make => (
                <button
                  key={make}
                  onClick={() => setSelectedMake(make)}
                  className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
                    selectedMake === make 
                    ? 'bg-red-900 text-white shadow-md' 
                    : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {make}
                </button>
              ))}
           </div>
           
           <div className="relative w-full md:w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
             <input 
                type="text" 
                placeholder="Search models..." 
                className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredCars.map(car => (
             <div key={car.id} className="bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 group border border-stone-100 flex flex-col h-full">
                <div className="relative h-64 overflow-hidden bg-stone-200">
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                     <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                        car.status === CarStatus.AVAILABLE ? 'bg-emerald-900 text-white' : 
                        car.status === CarStatus.RESERVED ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white'
                     }`}>
                       {car.status}
                     </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                     <p className="text-white font-serif text-lg font-bold">{car.year} {car.make} {car.model}</p>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-end mb-4 border-b border-stone-100 pb-4">
                      <div>
                        <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Price</p>
                        <p className="text-2xl font-serif font-bold text-red-900">AED {car.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Mileage</p>
                         <p className="text-sm font-bold text-stone-700">{car.mileage.toLocaleString()} km</p>
                      </div>
                   </div>
                   
                   <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                     {car.description}
                   </p>

                   <div className="mt-auto pt-2">
                      <button 
                        onClick={() => handleWhatsApp(`${car.year} ${car.make} ${car.model}`)}
                        className="w-full py-3 bg-stone-900 text-white hover:bg-red-900 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold rounded-sm"
                      >
                        <MessageCircle size={16} />
                        <span>Inquire via WhatsApp</span>
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-20">
             <p className="text-stone-400 text-lg">No vehicles found matching your criteria.</p>
             <button 
               onClick={() => {setSearchTerm(''); setSelectedMake('All');}}
               className="mt-4 text-red-900 font-bold hover:underline"
             >
               Clear Filters
             </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
               <div className="flex items-center space-x-2 mb-4">
                  <AlignJustify className="text-white" size={20} strokeWidth={3} />
                  <span className="text-lg font-bold text-white tracking-widest uppercase">ETIMAD</span>
               </div>
               <p className="text-sm leading-relaxed max-w-xs">
                 ETIMAD Used Car Leasing L.L.C is your premier destination for luxury pre-owned vehicles in the UAE. We ensure quality, transparency, and satisfaction.
               </p>
            </div>
            <div>
               <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Contact</h4>
               <ul className="space-y-2 text-sm">
                 <li className="flex items-center gap-2"><Phone size={14}/> +971 4 123 4567</li>
                 <li className="flex items-center gap-2"><MessageCircle size={14}/> +971 50 123 4567</li>
                 <li>Showroom 12, Sheikh Zayed Road, Dubai</li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Opening Hours</h4>
               <ul className="space-y-2 text-sm">
                 <li className="flex justify-between"><span>Mon - Sat:</span> <span>9:00 AM - 9:00 PM</span></li>
                 <li className="flex justify-between"><span>Friday:</span> <span>4:00 PM - 9:00 PM</span></li>
                 <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-800 text-center text-xs uppercase tracking-wider">
            &copy; {new Date().getFullYear()} ETIMAD USED CAR LEASING L.L.C. All Rights Reserved.
         </div>
      </footer>
    </div>
  );
};

export default Shop;