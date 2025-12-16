import { Customer, CustomerStatus, Quotation, Receipt, Stats, Car, CarStatus, Lead, LeadStatus } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust1',
    name: 'Ahmed Al-Mansoor',
    email: 'ahmed.m@example.com',
    phone: '+971 50 123 4567',
    status: CustomerStatus.VERIFIED,
    notes: 'VIP customer, interested in SUVs.',
    joinedDate: '2023-10-01',
  },
  {
    id: 'cust2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+971 55 987 6543',
    status: CustomerStatus.PENDING,
    notes: 'Looking for a sedan for daily commute.',
    joinedDate: '2023-10-15',
  },
  {
    id: 'cust3',
    name: 'Fatima Khaled',
    email: 'fatima.k@example.com',
    phone: '+971 52 555 1234',
    status: CustomerStatus.VERIFIED,
    notes: 'Returning customer.',
    joinedDate: '2023-10-20',
  }
];

export const MOCK_CARS: Car[] = [
  {
    id: 'car1',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2022,
    mileage: 15000,
    price: 310000,
    status: CarStatus.AVAILABLE,
    condition: 'Excellent',
    description: 'VXR Twin Turbo, White exterior, Beige interior. Full option with dealer warranty remaining.',
    imageUrl: 'https://images.unsplash.com/photo-1594502184342-28f377407278?auto=format&fit=crop&q=80&w=800',
    vin: 'JT1122334455'
  },
  {
    id: 'car2',
    make: 'BMW',
    model: 'X5 M50i',
    year: 2023,
    mileage: 5000,
    price: 385000,
    status: CarStatus.RESERVED,
    condition: 'Like New',
    description: 'M Sport package, Carbon Black metallic, Tartufo Merino leather. Panoramic sunroof.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'car3',
    make: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2021,
    mileage: 25000,
    price: 750000,
    status: CarStatus.AVAILABLE,
    condition: 'Excellent',
    description: 'Night Package, Matte Black wrap, Red interior. Full service history with agency.',
    imageUrl: 'https://images.unsplash.com/photo-1520031441872-26514dd970c3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'car4',
    make: 'Nissan',
    model: 'Patrol Platinum',
    year: 2024,
    mileage: 1200,
    price: 345000,
    status: CarStatus.AVAILABLE,
    condition: 'Like New',
    description: 'V8 engine, City Gold exterior. Zero accidents, first owner vehicle.',
    imageUrl: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'car5',
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2020,
    mileage: 18000,
    price: 520000,
    status: CarStatus.SOLD,
    condition: 'Excellent',
    description: 'Guards Red, Sports Chrono Package, RS Spyder wheels.',
    imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'car6',
    make: 'Range Rover',
    model: 'Autobiography',
    year: 2023,
    mileage: 8500,
    price: 890000,
    status: CarStatus.AVAILABLE,
    condition: 'Like New',
    description: 'Long Wheelbase, Charente Grey, Perlino interior. Executive rear seating.',
    imageUrl: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'car7',
    make: 'Audi',
    model: 'RS Q8',
    year: 2022,
    mileage: 22000,
    price: 595000,
    status: CarStatus.AVAILABLE,
    condition: 'Excellent',
    description: 'Mythos Black, Carbon Ceramic brakes, Bang & Olufsen 3D Advanced Sound System.',
    imageUrl: 'https://images.unsplash.com/photo-1614200187524-dc4b392e4c49?auto=format&fit=crop&q=80&w=800'
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead1',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '+971 50 999 8888',
    status: LeadStatus.NEW,
    interestedInId: 'car1',
    lastContact: '2023-10-28'
  },
  {
    id: 'lead2',
    name: 'Sarah Jones',
    email: 'sarah.j@example.com',
    phone: '+971 52 777 6666',
    status: LeadStatus.CONTACTED,
    interestedInId: 'car2',
    lastContact: '2023-10-27'
  }
];

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'q1',
    customerId: 'cust1',
    customerName: 'Ahmed Al-Mansoor',
    vehicleMake: 'Toyota',
    vehicleModel: 'Land Cruiser',
    vehicleYear: 2022,
    vin: 'JT1122334455',
    price: 310000,
    date: '2023-10-25',
    status: 'Sent',
  },
  {
    id: 'q2',
    customerId: 'cust2',
    customerName: 'John Smith',
    vehicleMake: 'Nissan',
    vehicleModel: 'Altima',
    vehicleYear: 2020,
    vin: '1N4AL3AP0C',
    price: 55000,
    date: '2023-10-26',
    status: 'Draft',
  }
];

export const MOCK_RECEIPTS: Receipt[] = [
  {
    id: 'r1',
    quotationId: 'q1',
    customerName: 'Ahmed Al-Mansoor',
    amount: 310000,
    date: '2023-10-27',
    paymentMethod: 'Bank Transfer',
    vehicleDescription: '2022 Toyota Land Cruiser',
  }
];

export const REVENUE_DATA: Stats[] = [
  { month: 'Jan', revenue: 450000 },
  { month: 'Feb', revenue: 320000 },
  { month: 'Mar', revenue: 550000 },
  { month: 'Apr', revenue: 400000 },
  { month: 'May', revenue: 600000 },
  { month: 'Jun', revenue: 750000 },
];