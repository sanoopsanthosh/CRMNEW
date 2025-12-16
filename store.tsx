import React, { createContext, useContext, useState } from 'react';
import { Customer, Quotation, Receipt, CustomerStatus, Car, Lead, VerificationDetails } from './types';
import { MOCK_CUSTOMERS, MOCK_QUOTATIONS, MOCK_RECEIPTS, MOCK_CARS, MOCK_LEADS } from './constants';

interface AppContextType {
  customers: Customer[];
  quotations: Quotation[];
  receipts: Receipt[];
  cars: Car[];
  leads: Lead[];
  addCustomer: (customer: Customer) => void;
  submitDocuments: (id: string, details: VerificationDetails) => void;
  verifyCustomer: (id: string) => void;
  addQuotation: (quotation: Quotation) => void;
  addReceipt: (receipt: Receipt) => void;
  addCar: (car: Car) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [quotations, setQuotations] = useState<Quotation[]>(MOCK_QUOTATIONS);
  const [receipts, setReceipts] = useState<Receipt[]>(MOCK_RECEIPTS);
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const addCustomer = (customer: Customer) => setCustomers(prev => [customer, ...prev]);
  
  const submitDocuments = (id: string, details: VerificationDetails) => {
    setCustomers(prev => prev.map(c => c.id === id ? { 
      ...c, 
      status: CustomerStatus.ACTION_REQUIRED,
      verificationDetails: details 
    } : c));
  };

  const verifyCustomer = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: CustomerStatus.VERIFIED } : c));
  };

  const addQuotation = (quotation: Quotation) => setQuotations(prev => [quotation, ...prev]);
  const addReceipt = (receipt: Receipt) => setReceipts(prev => [receipt, ...prev]);

  const addCar = (car: Car) => setCars(prev => [car, ...prev]);
  
  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  return (
    <AppContext.Provider value={{ customers, quotations, receipts, cars, leads, addCustomer, submitDocuments, verifyCustomer, addQuotation, addReceipt, addCar, updateLead }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};