export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
  result.setDate(diff);
  return result;
};

export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = [];
  
  for (let i = start.getDate(); i <= end.getDate(); i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }
  
  return days;
};

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date);
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  
  return days;
};

export const eachDayOfInterval = (start: Date, end: Date): Date[] => {
  const days = [];
  const current = new Date(start.getTime());
  const endTime = end.getTime();
  
  while (current.getTime() <= endTime) {
    days.push(new Date(current.getTime()));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

export const subMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
};

export const format = (date: Date, formatStr: string): string => {
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const dayNames = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
  ];

  switch (formatStr) {
    case 'MMMM yyyy':
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    case 'd':
      return date.getDate().toString();
    
    case "EEEE, d 'de' MMMM, yyyy":
      return `${dayNames[date.getDay()]}, ${date.getDate()} de ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
    
    case "d 'de' MMMM":
      return `${date.getDate()} de ${monthNames[date.getMonth()]}`;
    
    default:
      return date.toLocaleDateString('es-ES');
  }
};

// Función para calcular el número de semana de una fecha
export const getWeekNumber = (date: Date, startDate: Date): number => {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const timeDiff = date.getTime() - startDate.getTime();
  return Math.floor(timeDiff / msPerWeek);
};

// Función para determinar si un día específico está disponible según configuración intermitente
export const isDayIntermittentlyAvailable = (
  date: Date,
  dayOfWeek: number,
  pattern: 'even-weeks' | 'odd-weeks',
  startDate: Date
): boolean => {
  // Si no es el día de la semana configurado, no aplica
  if (date.getDay() !== dayOfWeek) {
    return true; // No afecta la disponibilidad
  }

  const weekNumber = getWeekNumber(date, startDate);
  const isEvenWeek = weekNumber % 2 === 0;

  // Si es semanas pares y estamos en semana par, está disponible
  // Si es semanas impares y estamos en semana impar, está disponible
  if (pattern === 'even-weeks') {
    return isEvenWeek;
  } else {
    return !isEvenWeek;
  }
};