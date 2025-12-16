import React, { useState } from 'react';
import { useAppStore } from '../store.tsx';
import { Car, CarStatus } from '../types';
import { Plus, Search, Filter, Sparkles, Loader2, ImagePlus, ExternalLink, Copy } from 'lucide-react';
import { generateCarDescription, generateCarImage } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const Inventory: React.FC = () => {
  const { cars, addCar } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<Partial<Car>>({
    make: '', model: '', year: 2024, mileage: 0, price: 0, status: CarStatus.AVAILABLE,
    condition: 'Excellent', description: '', imageUrl: '', vin: ''
  });

  const filteredCars = cars.filter(car => 
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateDescription = async () => {
    if (!formData.make || !formData.model) return;
    setIsGenerating(true);
    const desc = await generateCarDescription(
      formData.make!, formData.model!, formData.year || 2020, 
      `${formData.condition} condition, ${formData.mileage} miles`
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleGenerateImage = async () => {
     if (!formData.make || !formData.model) return;
     setIsGeneratingImage(true);
     const prompt = `${formData.year} ${formData.make} ${formData.model}, ${formData.condition}, studio lighting`;
     const b64 = await generateCarImage(prompt);
     if (b64) {
       setFormData(prev => ({ ...prev, imageUrl: b64 }));
     }
     setIsGeneratingImage(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.make && formData.model) {
      addCar({
        id: uuidv4(),
        ...formData as Car,
        imageUrl: formData.imageUrl || `https://picsum.photos/seed/${Date.now()}/800/600`
      });
      setIsModalOpen(false);
      setFormData({ make: '', model: '', year: 2024, mileage: 0, price: 0, status: CarStatus.AVAILABLE, condition: 'Excellent', description: '', imageUrl: '', vin: '' });
    }
  };

  const openShop = () => {
    window.open('#/shop', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-stone-900 font-serif">Inventory</h1>
            <p className="text-stone-500">Manage vehicle stock and details.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={openShop}
            className="flex items-center justify-center space-x-2 bg-white text-stone-700 border border-stone-300 px-5 py-2.5 rounded hover:bg-stone-50 transition-colors shadow-sm uppercase tracking-wider text-sm font-bold"
          >
            <ExternalLink size={18} />
            <span>Public Shop</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-red-900 text-white px-5 py-2.5 rounded hover:bg-red-950 transition-colors shadow-sm uppercase tracking-wider text-sm font-medium"
          >
            <Plus size={18} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-sm shadow-sm border border-stone-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input 
            type="text"
            placeholder="Search make, model..."
            className="w-full pl-10 pr-4 py-2 rounded border border-stone-200 focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 bg-stone-50 text-stone-900 placeholder-stone-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 px-4 py-2 rounded border border-stone-200 hover:bg-stone-50">
          <Filter size={18} />
          <span className="hidden sm:inline font-medium">Filter</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div key={car.id} className="group bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative h-56 w-full overflow-hidden bg-stone-200">
              <img 
                src={car.imageUrl} 
                alt={`${car.make} ${car.model}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                 <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                   car.status === CarStatus.AVAILABLE ? 'bg-white text-emerald-800' :
                   car.status === CarStatus.SOLD ? 'bg-stone-900 text-white' : 'bg-amber-500 text-white'
                 }`}>
                   {car.status}
                 </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                   <h3 className="font-bold text-xl text-stone-900 font-serif">{car.year} {car.make} {car.model}</h3>
                   <p className="text-sm text-stone-500">{car.mileage.toLocaleString()} miles</p>
                </div>
                <p className="font-bold text-red-900 text-lg font-serif">AED {car.price.toLocaleString()}</p>
              </div>
              <p className="text-stone-600 text-sm line-clamp-2 mb-5 h-10 leading-relaxed">{car.description}</p>
              <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                 <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-stone-100 text-stone-600 rounded-sm">{car.condition}</span>
                 <button className="text-red-900 text-sm font-bold uppercase tracking-wide hover:underline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Car Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white rounded shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="text-xl font-bold text-stone-900 font-serif">Add New Vehicle</h2>
              <button onClick={() => setIsModalOpen(false)}><span className="text-2xl text-stone-400 hover:text-red-800">&times;</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Make</label>
                  <input required className="w-full border border-stone-300 rounded-sm p-2.5 focus:border-red-800 focus:ring-0" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} placeholder="e.g. BMW" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Model</label>
                  <input required className="w-full border border-stone-300 rounded-sm p-2.5 focus:border-red-800 focus:ring-0" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. X5" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Year</label>
                  <input required type="number" className="w-full border border-stone-300 rounded-sm p-2.5 focus:border-red-800 focus:ring-0" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Price (AED)</label>
                  <input required type="number" className="w-full border border-stone-300 rounded-sm p-2.5 focus:border-red-800 focus:ring-0" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Mileage</label>
                  <input required type="number" className="w-full border border-stone-300 rounded-sm p-2.5 focus:border-red-800 focus:ring-0" value={formData.mileage} onChange={e => setFormData({...formData, mileage: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Condition</label>
                  <select className="w-full border border-stone-300 rounded-sm p-2.5 focus:border-red-800 focus:ring-0" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value as any})}>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
              </div>

               {/* AI Image Generation Section */}
               <div className="border border-stone-200 rounded-sm p-5 bg-stone-50">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide">Vehicle Image</label>
                  <button 
                    type="button" 
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !formData.make}
                    className="flex items-center space-x-1 text-xs text-red-800 font-bold hover:text-red-900 uppercase tracking-wide"
                  >
                    {isGeneratingImage ? <Loader2 className="animate-spin" size={14}/> : <ImagePlus size={14}/>}
                    <span>Generate AI Image</span>
                  </button>
                </div>
                {formData.imageUrl ? (
                   <div className="relative h-48 w-full rounded-sm overflow-hidden border border-stone-300 shadow-sm">
                     <img src={formData.imageUrl} alt="Vehicle" className="w-full h-full object-cover"/>
                     <button 
                      type="button"
                      className="absolute top-2 right-2 bg-red-900 text-white rounded-full p-1 hover:bg-black"
                      onClick={() => setFormData({...formData, imageUrl: ''})}
                     >
                       &times;
                     </button>
                   </div>
                ) : (
                  <div className="h-48 w-full rounded-sm border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-sm bg-white">
                    No image generated or uploaded
                  </div>
                )}
                <p className="text-xs text-stone-500 mt-2 italic">Requires API Key for AI generation.</p>
              </div>

              {/* Description Section with AI */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide">Description</label>
                  <button 
                    type="button" 
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="flex items-center space-x-1 text-xs text-red-800 font-bold hover:text-red-900 disabled:opacity-50 uppercase tracking-wide"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>}
                    <span>Generate with AI</span>
                  </button>
                </div>
                <textarea 
                  className="w-full border border-stone-300 rounded-sm p-3 h-28 text-sm focus:border-red-800 focus:ring-0" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the vehicle..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-sm border border-stone-300 text-stone-600 hover:bg-stone-50 font-medium uppercase tracking-wide text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-sm bg-red-900 text-white hover:bg-red-950 font-medium uppercase tracking-wide text-sm shadow-md"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;