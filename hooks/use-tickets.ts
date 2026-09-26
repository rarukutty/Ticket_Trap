'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateBookingId, generateTicketId } from '@/lib/data';

export interface StoredTicket {
  bookingId: string;
  ticketId: string;
  eventId: string;
  eventName: string;
  eventImage: string;
  date: string;
  dateLabel: string;
  venue: string;
  city: string;
  seats: string[];
  pricePerSeat: number;
  total: number;
  createdAt: string;
}

const STORAGE_KEY = 'tickettrap-tickets';

export function useTickets() {
  const [tickets, setTickets] = useState<StoredTicket[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTickets(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const addTicket = useCallback((ticket: Omit<StoredTicket, 'bookingId' | 'ticketId' | 'createdAt'>) => {
    const newTicket: StoredTicket = {
      ...ticket,
      bookingId: generateBookingId(),
      ticketId: generateTicketId(),
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => {
      const updated = [newTicket, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    return newTicket;
  }, []);

  const clearTickets = useCallback(() => {
    setTickets([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { tickets, addTicket, clearTickets };
}
