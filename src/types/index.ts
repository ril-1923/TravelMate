export type TravelType = 'Solo' | 'Family' | 'Couple' | 'Friends' | 'Business';

export type TripStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  country: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;
  travelers: number;
  budget: number;
  travelType: TravelType;
  notes: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  dailyCost: number;
  bestSeason: string;
  attractions: string[];
}

export type ItineraryCategory =
  | 'Sightseeing'
  | 'Food'
  | 'Hotel'
  | 'Shopping'
  | 'Adventure'
  | 'Transport'
  | 'Other';

export interface ItineraryItem {
  id: string;
  tripId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  activity: string;
  location: string;
  category: ItineraryCategory;
  estimatedCost: number;
  notes: string;
  completed: boolean;
}

export type ExpenseCategory =
  | 'Flights'
  | 'Hotel'
  | 'Food'
  | 'Transport'
  | 'Activities'
  | 'Shopping'
  | 'Other';

export interface Expense {
  id: string;
  tripId: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes: string;
}

export type PackingCategory = 'Documents' | 'Clothing' | 'Electronics' | 'Personal';

export interface PackingItem {
  id: string;
  tripId: string | 'all';
  name: string;
  category: PackingCategory;
  packed: boolean;
}

export type Theme = 'light' | 'dark';

export type SortKey = 'startDate' | 'name' | 'budget' | 'destination';
export type StatusFilter = 'all' | TripStatus;

export interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
}
