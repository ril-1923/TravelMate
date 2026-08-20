import type { Trip, TripStatus, Expense, ItineraryItem, PackingItem, CategoryTotal } from '@/types';
import { todayISO, daysBetween } from './dateUtils';

export function getTripStatus(trip: Trip, today: string = todayISO()): TripStatus {
  if (!trip.startDate || !trip.endDate) return 'upcoming';
  if (today < trip.startDate) return 'upcoming';
  if (today > trip.endDate) return 'completed';
  return 'ongoing';
}

export function tripDuration(trip: Trip): number {
  return daysBetween(trip.startDate, trip.endDate) + 1;
}

export function expensesForTrip(expenses: Expense[], tripId: string): Expense[] {
  return expenses.filter((e) => e.tripId === tripId);
}

export function itineraryForTrip(items: ItineraryItem[], tripId: string): ItineraryItem[] {
  return items.filter((i) => i.tripId === tripId);
}

export function packingForTrip(items: PackingItem[], tripId: string): PackingItem[] {
  return items.filter((i) => i.tripId === tripId || i.tripId === 'all');
}

export function totalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
}

export function totalBudget(trips: Trip[]): number {
  return trips.reduce((sum, t) => sum + (t.budget || 0), 0);
}

export function remainingBudget(budget: number, spent: number): number {
  return budget - spent;
}

export function spendingPct(budget: number, spent: number): number {
  if (budget <= 0) return spent > 0 ? 100 : 0;
  return Math.min(100, Math.round((spent / budget) * 100));
}

export function isOverBudget(budget: number, spent: number): boolean {
  return spent > budget && budget > 0;
}

export function averageTripCost(trips: Trip[], expenses: Expense[]): number {
  if (trips.length === 0) return 0;
  const totalSpent = trips.reduce((sum, t) => {
    return sum + totalExpenses(expensesForTrip(expenses, t.id));
  }, 0);
  return Math.round(totalSpent / trips.length);
}

export function expensesByCategory(expenses: Expense[]): CategoryTotal[] {
  const total = totalExpenses(expenses);
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) || 0) + e.amount);
  }
  const result: CategoryTotal[] = [];
  for (const [category, value] of map.entries()) {
    result.push({
      category,
      total: value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    });
  }
  return result.sort((a, b) => b.total - a.total);
}

export function packingProgress(items: PackingItem[]): number {
  if (items.length === 0) return 0;
  const packed = items.filter((i) => i.packed).length;
  return Math.round((packed / items.length) * 100);
}

export function averageDailySpending(expenses: Expense[], trip: Trip): number {
  const spent = totalExpenses(expensesForTrip(expenses, trip.id));
  const days = tripDuration(trip);
  if (days === 0) return 0;
  return Math.round(spent / days);
}

export function destinationStats(trips: Trip[]): { destination: string; count: number }[] {
  const map = new Map<string, number>();
  for (const t of trips) {
    const key = `${t.destination}, ${t.country}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([destination, count]) => ({ destination, count }))
    .sort((a, b) => b.count - a.count);
}
