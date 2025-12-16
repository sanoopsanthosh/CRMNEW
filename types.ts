export enum CustomerStatus {
  PENDING = 'Pending Verification',
  ACTION_REQUIRED = 'Action Required',
  VERIFIED = 'Verified',
}

export enum CarStatus {
  AVAILABLE = 'Available',
  SOLD = 'Sold',
  RESERVED = 'Reserved'
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export interface QuestionnaireItem {
  question: string;
  answer: string;
}

export interface VerificationDetails {
  idNumber: string;
  expiryDate: string;
  documentUrl?: string;
  questionnaire?: QuestionnaireItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  notes: string;
  joinedDate: string;
  verificationDetails?: VerificationDetails;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  status: CarStatus;
  condition: string;
  description: string;
  imageUrl: string;
  vin?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  interestedInId: string | null;
  lastContact: string;
}

export interface Quotation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vin?: string;
  price: number;
  date: string;
  status: 'Draft' | 'Sent' | 'Accepted';
  // Finance details
  downPayment?: number;
  tenure?: number; // in months
  monthlyPayment?: number;
  // Add-ons
  addOns?: string[];
}

export interface Receipt {
  id: string;
  quotationId?: string; // Optional link to a quotation
  customerName: string;
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'Card' | 'Cheque' | 'Bank Transfer';
  vehicleDescription: string;
}

export interface Stats {
  month: string;
  revenue: number;
}