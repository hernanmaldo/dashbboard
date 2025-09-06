import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Appointment, CalendarView, serviceColors, serviceLabels, DayAvailability, IntermittentAvailability } from '../types/barbershop';
import { 
  formatDate, 
  formatShortDate, 
  isSameDay, 
  isToday, 
  addDays, 
  addWeeks, 
  addMonths, 
  getDaysInMonth, 
  getWeekDays,
  isDayIntermittentlyAvailable
} from '../utils/dateUtils';

interface CalendarProps {
  appointments: Appointment[];
  dayAvailability?: DayAvailability[];
  intermittentAvailability?: IntermittentAvailability[];
  onAppointmentUpdate: (appointment: Appointment) => void;
  onAppointmentDelete: (id: string) => void;
}

export function Calendar({ appointments, dayAvailability = [], intermittentAvailability = [], onAppointmentUpdate, onAppointmentDelete }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [, setSelectedAppointment] = useState<Appointment | null>(null);


  const navigateDate = (direction: 'prev' | 'next') => {
    switch (view) {
      case 'month':
        setCurrentDate(prev => addMonths(prev, direction === 'next' ? 1 : -1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, direction === 'next' ? 1 : -1));
        break;
      case 'day':
        setCurrentDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
        break;
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const getDayAvailability = (date: Date) => {
    return dayAvailability.find(availability => isSameDay(availability.date, date));
  };

  const isDayUnavailable = (date: Date) => {
    const availability = getDayAvailability(date);
    return availability && !availability.isAvailable;
  };

  const isDayIntermittentlyClosed = (date: Date) => {
    return intermittentAvailability.some(config => {
      if (!config.isActive) return false;
      return !isDayIntermittentlyAvailable(date, config.dayOfWeek, config.pattern, config.startDate);
    });
  };

  const getIntermittentConfig = (date: Date) => {
    return intermittentAvailability.find(config => {
      if (!config.isActive) return false;
      return date.getDay() === config.dayOfWeek;
    });
  };

  const getTodaysSummary = () => {
    const today = new Date();
    const todaysAppointments = getAppointmentsForDate(today);
    const confirmed = todaysAppointments.filter(apt => apt.status === 'confirmado').length;
    const pending = todaysAppointments.filter(apt => apt.status === 'pendiente').length;
    
    return { total: todaysAppointments.length, confirmed, pending };
  };

  const renderAppointmentCard = (appointment: Appointment | null) => {
     if(!appointment) return null; // o un "slot vacío"
  return(
    <Sheet key={appointment.id}>
      <SheetTrigger asChild>
        <div 
          className={`p-2 rounded cursor-pointer hover:opacity-80 transition-opacity ${serviceColors[appointment.service]} text-white mb-1`}
          onClick={() => setSelectedAppointment(appointment)}
        >
          <div className="text-xs opacity-90">{appointment.time}</div>
          <div className="text-sm truncate">{appointment.clientName}</div>
          <div className="text-xs opacity-90">{serviceLabels[appointment.service]}</div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalles del Turno</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{appointment.clientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{appointment.time}</span>
          </div>
          {appointment.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{appointment.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>Servicio:</span>
            <Badge className={serviceColors[appointment.service]}>{serviceLabels[appointment.service]}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Estado:</span>
            <Badge variant={appointment.status === 'confirmado' ? 'default' : appointment.status === 'pendiente' ? 'secondary' : 'destructive'}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </div>
          {appointment.notes && (
            <div>
              <span className="block mb-1">Notas:</span>
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            {appointment.status === 'pendiente' && (
              <Button 
                size="sm" 
                onClick={() => onAppointmentUpdate({...appointment, status: 'confirmado'})}
              >
                Confirmar
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAppointmentUpdate({...appointment, status: appointment.status === 'confirmado' ? 'pendiente' : 'confirmado'})}
            >
              {appointment.status === 'confirmado' ? 'Marcar Pendiente' : 'Confirmar'}
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onAppointmentDelete(appointment.id)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )};

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay(); // Lunes = 1
    const emptyDays = Array.from({ length: startDay - 1 }, (_, i) => i);

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="p-2 text-center text-sm text-muted-foreground border-b">
            {day}
          </div>
        ))}
        {emptyDays.map(day => (
          <div key={`empty-${day}`} className="h-24 p-1"></div>
        ))}
        {days.map(day => {
          const dayAppointments = getAppointmentsForDate(day);
          const isUnavailable = isDayUnavailable(day);
          const isIntermittentlyClosed = isDayIntermittentlyClosed(day);
          const availability = getDayAvailability(day);
          const intermittentConfig = getIntermittentConfig(day);
          
          let dayClass = 'border-border';
          if (isToday(day)) {
            dayClass = 'bg-primary/10 border-primary';
          } else if (isUnavailable) {
            dayClass = 'bg-muted/50 border-muted';
          } else if (isIntermittentlyClosed) {
            dayClass = 'bg-orange-50 border-orange-200 border-dashed';
          } else if (intermittentConfig) {
            dayClass = 'bg-blue-50 border-blue-200 border-dotted';
          }
          
          return (
            <div key={day.toISOString()} className={`h-24 p-1 border ${dayClass} overflow-hidden relative`}>
              <div className={`text-sm mb-1 flex items-center gap-1 ${(isUnavailable || isIntermittentlyClosed) ? 'text-muted-foreground line-through' : ''}`}>
                <span>{day.getDate()}</span>
                {intermittentConfig && (
                  <div className={`w-2 h-2 rounded-full ${isIntermittentlyClosed ? 'bg-orange-400' : 'bg-blue-400'}`} 
                       title={`Día intermitente: ${intermittentConfig.pattern === 'even-weeks' ? 'semanas pares' : 'semanas impares'}`} />
                )}
              </div>
              
              {isUnavailable && availability ? (
                <div className="absolute inset-0 p-1 flex flex-col justify-center items-center text-xs">
                  <div className="text-muted-foreground font-medium">Cerrado</div>
                  {availability.reason && (
                    <div className="text-xs text-muted-foreground capitalize truncate max-w-full">
                      {availability.reason}
                    </div>
                  )}
                </div>
              ) : isIntermittentlyClosed && intermittentConfig ? (
                <div className="absolute inset-0 p-1 flex flex-col justify-center items-center text-xs">
                  <div className="text-orange-600 font-medium">Cerrado</div>
                  <div className="text-xs text-orange-500 capitalize truncate max-w-full">
                    {intermittentConfig.reason || 'Día alterno'}
                  </div>
                </div>
              ) : (
                <div className="space-y-1 max-h-16 overflow-y-auto">
                  {dayAppointments.map(renderAppointmentCard)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => {
          const dayAppointments = getAppointmentsForDate(day);
          const isUnavailable = isDayUnavailable(day);
          const isIntermittentlyClosed = isDayIntermittentlyClosed(day);
          const availability = getDayAvailability(day);
          const intermittentConfig = getIntermittentConfig(day);
          
          let dayClass = '';
          if (isToday(day)) {
            dayClass = 'bg-primary/10';
          } else if (isUnavailable) {
            dayClass = 'bg-muted/50';
          } else if (isIntermittentlyClosed) {
            dayClass = 'bg-orange-50 border-dashed border-orange-200';
          } else if (intermittentConfig) {
            dayClass = 'bg-blue-50 border-dotted border-blue-200';
          }
          
          return (
            <div key={day.toISOString()} className={`p-2 border rounded ${dayClass} relative`}>
              <div className="text-center mb-2">
                <div className="text-sm text-muted-foreground">
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </div>
                <div className={`text-lg flex items-center justify-center gap-1 ${(isUnavailable || isIntermittentlyClosed) ? 'text-muted-foreground line-through' : ''}`}>
                  <span>{day.getDate()}</span>
                  {intermittentConfig && (
                    <div className={`w-2 h-2 rounded-full ${isIntermittentlyClosed ? 'bg-orange-400' : 'bg-blue-400'}`} />
                  )}
                </div>
              </div>
              
              {isUnavailable && availability ? (
                <div className="text-xs text-center text-muted-foreground">
                  <div className="font-medium">Cerrado</div>
                  {availability.reason && (
                    <div className="capitalize truncate">
                      {availability.reason}
                    </div>
                  )}
                </div>
              ) : isIntermittentlyClosed && intermittentConfig ? (
                <div className="text-xs text-center text-orange-600">
                  <div className="font-medium">Cerrado</div>
                  <div className="capitalize truncate">
                    {intermittentConfig.reason || 'Día alterno'}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {dayAppointments.map(renderAppointmentCard)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate)
      .sort((a, b) => a.time.localeCompare(b.time));
    const isUnavailable = isDayUnavailable(currentDate);
    const isIntermittentlyClosed = isDayIntermittentlyClosed(currentDate);
    const availability = getDayAvailability(currentDate);
    const intermittentConfig = getIntermittentConfig(currentDate);
    
    let dayClass = '';
    if (isUnavailable) {
      dayClass = 'bg-muted/50';
    } else if (isIntermittentlyClosed) {
      dayClass = 'bg-orange-50 border-orange-200';
    } else if (intermittentConfig) {
      dayClass = 'bg-blue-50 border-blue-200';
    }
    
    return (
      <div className="space-y-2">
        <div className={`text-center p-4 border rounded ${dayClass}`}>
          <h3 className={`flex items-center justify-center gap-2 ${(isUnavailable || isIntermittentlyClosed) ? 'text-muted-foreground line-through' : ''}`}>
            <span>{formatDate(currentDate)}</span>
            {intermittentConfig && (
              <div className={`w-3 h-3 rounded-full ${isIntermittentlyClosed ? 'bg-orange-400' : 'bg-blue-400'}`} 
                   title={`Día intermitente: ${intermittentConfig.pattern === 'even-weeks' ? 'semanas pares' : 'semanas impares'}`} />
            )}
          </h3>
          {isUnavailable && availability && (
            <div className="mt-2 text-sm text-muted-foreground">
              <div className="font-medium">Día cerrado - {availability.reason}</div>
              {availability.notes && (
                <div className="text-xs mt-1">{availability.notes}</div>
              )}
            </div>
          )}
          {isIntermittentlyClosed && intermittentConfig && (
            <div className="mt-2 text-sm text-orange-600">
              <div className="font-medium">Día cerrado - {intermittentConfig.reason || 'Día alterno'}</div>
              {intermittentConfig.notes && (
                <div className="text-xs mt-1">{intermittentConfig.notes}</div>
              )}
            </div>
          )}
        </div>
        
        {!isUnavailable && !isIntermittentlyClosed && (
          <div className="grid gap-2">
            {dayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay turnos programados para este día
              </div>
            ) : (
              dayAppointments.map(renderAppointmentCard)
            )}
          </div>
        )}
      </div>
    );
  };

  const summary = getTodaysSummary();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Agenda</CardTitle>
          
          {/* Resumen del día */}
          <div className="flex gap-2 text-sm">
            <Badge variant="outline">Hoy: {summary.total} turnos</Badge>
            <Badge variant="default">{summary.confirmed} confirmados</Badge>
            <Badge variant="secondary">{summary.pending} pendientes</Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Navegación */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg min-w-48 text-center">
              {view === 'month' && currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              {view === 'week' && `Semana del ${formatShortDate(getWeekDays(currentDate)[0])}`}
              {view === 'day' && formatShortDate(currentDate)}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Selector de vista */}
          <Select value={view} onValueChange={(value: CalendarView) => setView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Día</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </CardContent>
    </Card>
  );
}