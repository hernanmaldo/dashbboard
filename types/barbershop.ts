export interface Appointment {
  id: string;
  clientName: string;
  date: Date;
  time: string;
  service: 'corte' | 'barba' | 'combo';
  status: 'pendiente' | 'confirmado' | 'cancelado';
  phone?: string;
  notes?: string;
}

export interface WorkingHours {
  day: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  isOpen: boolean;
  timeSlots: { start: string; end: string }[];
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface DayAvailability {
  id: string;
  date: Date;
  isAvailable: boolean;
  reason?: string;  // e.g., "feriado", "mantenimiento", "vacaciones"
  notes?: string;   // notas adicionales
}

export interface IntermittentAvailability {
  id: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo, 1 = lunes, etc.
  isActive: boolean;
  pattern: 'even-weeks' | 'odd-weeks'; // semanas pares o impares
  startDate: Date; // fecha de referencia para calcular las semanas
  reason?: string;
  notes?: string;
}

export type CalendarView = 'month' | 'week' | 'day';

export const serviceColors = {
  corte: 'bg-blue-500',
  barba: 'bg-green-500',
  combo: 'bg-orange-500'
} as const;

export const serviceLabels = {
  corte: 'Corte',
  barba: 'Barba',
  combo: 'Combo'
} as const;