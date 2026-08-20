import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Trip, Expense, ItineraryItem, PackingItem, Theme } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { demoTrips, demoExpenses, demoItinerary, demoPacking, defaultTheme } from '@/data/demoData';

interface AppContextValue {
  trips: Trip[];
  setTrips: (v: Trip[] | ((prev: Trip[]) => Trip[])) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;

  expenses: Expense[];
  setExpenses: (v: Expense[] | ((prev: Expense[]) => Expense[])) => void;
  addExpense: (e: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  itinerary: ItineraryItem[];
  setItinerary: (v: ItineraryItem[] | ((prev: ItineraryItem[]) => ItineraryItem[])) => void;
  addItinerary: (i: ItineraryItem) => void;
  updateItinerary: (id: string, updates: Partial<ItineraryItem>) => void;
  deleteItinerary: (id: string) => void;

  packing: PackingItem[];
  setPacking: (v: PackingItem[] | ((prev: PackingItem[]) => PackingItem[])) => void;
  addPacking: (p: PackingItem) => void;
  togglePacking: (id: string) => void;
  deletePacking: (id: string) => void;

  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;

  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useLocalStorage<Trip[]>('tm_trips', demoTrips);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('tm_expenses', demoExpenses);
  const [itinerary, setItinerary] = useLocalStorage<ItineraryItem[]>('tm_itinerary', demoItinerary);
  const [packing, setPacking] = useLocalStorage<PackingItem[]>('tm_packing', demoPacking);
  const [theme, setThemeState] = useLocalStorage<Theme>('tm_theme', defaultTheme);

  const value = useMemo<AppContextValue>(() => {
    const addTrip = (trip: Trip) => setTrips((prev) => [...prev, trip]);
    const updateTrip = (id: string, updates: Partial<Trip>) =>
      setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    const deleteTrip = (id: string) => {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      setExpenses((prev) => prev.filter((e) => e.tripId !== id));
      setItinerary((prev) => prev.filter((i) => i.tripId !== id));
      setPacking((prev) => prev.filter((p) => p.tripId !== id));
    };

    const addExpense = (e: Expense) => setExpenses((prev) => [...prev, e]);
    const updateExpense = (id: string, updates: Partial<Expense>) =>
      setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    const deleteExpense = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id));

    const addItinerary = (i: ItineraryItem) => setItinerary((prev) => [...prev, i]);
    const updateItinerary = (id: string, updates: Partial<ItineraryItem>) =>
      setItinerary((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    const deleteItinerary = (id: string) => setItinerary((prev) => prev.filter((i) => i.id !== id));

    const addPacking = (p: PackingItem) => setPacking((prev) => [...prev, p]);
    const togglePacking = (id: string) =>
      setPacking((prev) => prev.map((p) => (p.id === id ? { ...p, packed: !p.packed } : p)));
    const deletePacking = (id: string) => setPacking((prev) => prev.filter((p) => p.id !== id));

    const setTheme = (t: Theme) => setThemeState(t);
    const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));

    const resetDemoData = () => {
      setTrips(demoTrips);
      setExpenses(demoExpenses);
      setItinerary(demoItinerary);
      setPacking(demoPacking);
    };

    return {
      trips, setTrips, addTrip, updateTrip, deleteTrip,
      expenses, setExpenses, addExpense, updateExpense, deleteExpense,
      itinerary, setItinerary, addItinerary, updateItinerary, deleteItinerary,
      packing, setPacking, addPacking, togglePacking, deletePacking,
      theme, setTheme, toggleTheme,
      resetDemoData,
    };
  }, [trips, expenses, itinerary, packing, theme, setTrips, setExpenses, setItinerary, setPacking, setThemeState]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
