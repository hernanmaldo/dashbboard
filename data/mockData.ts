import { Appointment, WorkingHours, ContactInfo, DayAvailability, IntermittentAvailability } from '../types/barbershop';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Juan Pérez',
    date: new Date(2025, 8, 3, 10, 0), // Sept 3, 2025, 10:00
    time: '10:00',
    service: 'corte',
    status: 'confirmado',
    phone: '+54 9 11 1234-5678',
    notes: 'Corte clásico, no muy corto'
  },
  {
    id: '2',
    clientName: 'Carlos López',
    date: new Date(2025, 8, 3, 11, 30), // Sept 3, 2025, 11:30
    time: '11:30',
    service: 'barba',
    status: 'pendiente',
    phone: '+54 9 11 2345-6789'
  },
  {
    id: '3',
    clientName: 'Miguel Torres',
    date: new Date(2025, 8, 3, 14, 0), // Sept 3, 2025, 14:00
    time: '14:00',
    service: 'combo',
    status: 'confirmado',
    phone: '+54 9 11 3456-7890',
    notes: 'Combo completo + arreglo de cejas'
  },
  {
    id: '4',
    clientName: 'Roberto Silva',
    date: new Date(2025, 8, 4, 9, 0), // Sept 4, 2025, 09:00
    time: '09:00',
    service: 'corte',
    status: 'confirmado',
    phone: '+54 9 11 4567-8901'
  },
  {
    id: '5',
    clientName: 'Diego Martín',
    date: new Date(2025, 8, 4, 15, 30), // Sept 4, 2025, 15:30
    time: '15:30',
    service: 'barba',
    status: 'pendiente',
    phone: '+54 9 11 5678-9012'
  },
  {
    id: '6',
    clientName: 'Fernando García',
    date: new Date(2025, 8, 5, 11, 0), // Sept 5, 2025, 11:00
    time: '11:00',
    service: 'combo',
    status: 'confirmado',
    phone: '+54 9 11 6789-0123'
  }
];

export const mockWorkingHours: WorkingHours[] = [
  {
    day: 'lunes',
    isOpen: true,
    timeSlots: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }]
  },
  {
    day: 'martes',
    isOpen: true,
    timeSlots: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }]
  },
  {
    day: 'miercoles',
    isOpen: true,
    timeSlots: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }]
  },
  {
    day: 'jueves',
    isOpen: true,
    timeSlots: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }]
  },
  {
    day: 'viernes',
    isOpen: true,
    timeSlots: [{ start: '09:00', end: '13:00' }, { start: '16:00', end: '20:00' }]
  },
  {
    day: 'sabado',
    isOpen: true,
    timeSlots: [{ start: '09:00', end: '17:00' }]
  },
  {
    day: 'domingo',
    isOpen: false,
    timeSlots: []
  }
];

export const mockContactInfo: ContactInfo = {
  phone: '+54 9 11 1234-5678',
  whatsapp: '+54 9 11 1234-5678',
  address: 'Av. Corrientes 1234, CABA, Buenos Aires',
  instagram: '@barberia_moderna',
  facebook: 'Barbería Moderna',
  tiktok: '@barberia_moderna'
};

export const mockDayAvailability: DayAvailability[] = [
  {
    id: '1',
    date: new Date(2025, 8, 17), // Sept 17, 2025 - Ejemplo del usuario
    isAvailable: false,
    reason: 'mantenimiento',
    notes: 'Mantenimiento de equipos y limpieza profunda'
  },
  {
    id: '2',
    date: new Date(2025, 8, 25), // Sept 25, 2025
    isAvailable: false,
    reason: 'feriado',
    notes: 'Día del empleado de comercio'
  },
  {
    id: '3',
    date: new Date(2025, 9, 12), // Oct 12, 2025
    isAvailable: false,
    reason: 'feriado',
    notes: 'Día de la Raza'
  },
  {
    id: '4',
    date: new Date(2025, 8, 30), // Sept 30, 2025
    isAvailable: false,
    reason: 'vacaciones',
    notes: 'Día personal del barbero'
  }
];

export const mockIntermittentAvailability: IntermittentAvailability[] = [
  {
    id: '1',
    dayOfWeek: 6, // Sábado
    isActive: true,
    pattern: 'even-weeks', // Semanas pares
    startDate: new Date(2025, 8, 1), // 1 de septiembre 2025 como referencia
    reason: 'descanso',
    notes: 'Sábados alternos - descanso del barbero'
  },
  {
    id: '2',
    dayOfWeek: 0, // Domingo
    isActive: true,
    pattern: 'odd-weeks', // Semanas impares
    startDate: new Date(2025, 8, 1), // 1 de septiembre 2025 como referencia
    reason: 'eventos',
    notes: 'Domingos alternos para eventos especiales'
  }
];