import { useState } from 'react';
import { CalendarDays, Edit3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isDayIntermittentlyAvailable } from '../utils/dateUtils';
import { DayAvailability, IntermittentAvailability } from '../types/barbershop';

interface AvailabilityConfigProps {
  dayAvailability: DayAvailability[];
  intermittentAvailability: IntermittentAvailability[];
  onUpdate: (availability: DayAvailability[]) => void;
  onIntermittentUpdate: (availability: IntermittentAvailability[]) => void;
}

const reasonOptions = [
  { value: 'feriado', label: 'Feriado', color: 'bg-red-100 text-red-800' },
  { value: 'mantenimiento', label: 'Mantenimiento', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'vacaciones', label: 'Vacaciones', color: 'bg-blue-100 text-blue-800' },
  { value: 'personal', label: 'Día Personal', color: 'bg-purple-100 text-purple-800' },
  { value: 'otro', label: 'Otro', color: 'bg-gray-100 text-gray-800' }
];

const intermittentReasonOptions = [
  { value: 'descanso', label: 'Descanso del barbero', color: 'bg-blue-100 text-blue-800' },
  { value: 'eventos', label: 'Eventos especiales', color: 'bg-green-100 text-green-800' },
  { value: 'mantenimiento', label: 'Mantenimiento semanal', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'formacion', label: 'Formación/Capacitación', color: 'bg-purple-100 text-purple-800' },
  { value: 'otro', label: 'Otro', color: 'bg-gray-100 text-gray-800' }
];

const dayOfWeekOptions = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' }
];

export function AvailabilityConfig({ dayAvailability, intermittentAvailability, onUpdate, onIntermittentUpdate }: AvailabilityConfigProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isIntermittentDialogOpen, setIsIntermittentDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<DayAvailability | null>(null);
  const [editingIntermittent, setEditingIntermittent] = useState<IntermittentAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    reason: 'otro',
    notes: ''
  });
  const [intermittentFormData, setIntermittentFormData] = useState({
    dayOfWeek: 6 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    pattern: 'even-weeks' as 'even-weeks' | 'odd-weeks',
    reason: 'descanso',
    notes: ''
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval(monthStart, monthEnd);

  const getReasonConfig = (reason?: string) => {
    return reasonOptions.find(option => option.value === reason) || reasonOptions[reasonOptions.length - 1];
  };

  const getIntermittentReasonConfig = (reason?: string) => {
    return intermittentReasonOptions.find(option => option.value === reason) || intermittentReasonOptions[intermittentReasonOptions.length - 1];
  };

  const getDayAvailability = (date: Date) => {
    return dayAvailability.find(availability => isSameDay(availability.date, date));
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

  const handleDateClick = (date: Date) => {
    const existing = getDayAvailability(date);
    
    if (existing) {
      setEditingDay(existing);
      setSelectedDate(null);
      setFormData({
        reason: existing.reason || 'otro',
        notes: existing.notes || ''
      });
    } else {
      setEditingDay(null);
      setSelectedDate(date);
      setFormData({
        reason: 'otro',
        notes: ''
      });
    }
    
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingDay) {
      // Editar día existente
      const updatedAvailability = dayAvailability.map(day =>
        day.id === editingDay.id
          ? {
              ...day,
              reason: formData.reason,
              notes: formData.notes
            }
          : day
      );
      onUpdate(updatedAvailability);
    } else if (selectedDate) {
      // Agregar nuevo día no disponible
      const newDay: DayAvailability = {
        id: `availability-${Date.now()}`,
        date: selectedDate,
        isAvailable: false,
        reason: formData.reason,
        notes: formData.notes
      };
      onUpdate([...dayAvailability, newDay]);
    }
    
    closeDialog();
  };


  const handleMakeAvailable = () => {
    if (editingDay) {
      onUpdate(dayAvailability.filter(day => day.id !== editingDay.id));
      closeDialog();
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingDay(null);
    setSelectedDate(null);
    setFormData({ reason: 'otro', notes: '' });
  };

  // Intermittent availability handlers
  const handleIntermittentSubmit = () => {
    if (editingIntermittent) {
      // Editar configuración existente
      const updatedConfig = intermittentAvailability.map(config =>
        config.id === editingIntermittent.id
          ? {
              ...config,
              dayOfWeek: intermittentFormData.dayOfWeek,
              pattern: intermittentFormData.pattern,
              reason: intermittentFormData.reason,
              notes: intermittentFormData.notes
            }
          : config
      );
      onIntermittentUpdate(updatedConfig);
    } else {
      // Crear nueva configuración
      const newConfig: IntermittentAvailability = {
        id: `intermittent-${Date.now()}`,
        dayOfWeek: intermittentFormData.dayOfWeek,
        isActive: true,
        pattern: intermittentFormData.pattern,
        startDate: new Date(),
        reason: intermittentFormData.reason,
        notes: intermittentFormData.notes
      };
      onIntermittentUpdate([...intermittentAvailability, newConfig]);
    }
    
    closeIntermittentDialog();
  };

  const toggleIntermittentActive = (id: string) => {
    const updatedConfig = intermittentAvailability.map(config =>
      config.id === id
        ? { ...config, isActive: !config.isActive }
        : config
    );
    onIntermittentUpdate(updatedConfig);
  };

  const deleteIntermittentConfig = (id: string) => {
    onIntermittentUpdate(intermittentAvailability.filter(config => config.id !== id));
    if (editingIntermittent?.id === id) {
      closeIntermittentDialog();
    }
  };

  const editIntermittentConfig = (config: IntermittentAvailability) => {
    setEditingIntermittent(config);
    setIntermittentFormData({
      dayOfWeek: config.dayOfWeek,
      pattern: config.pattern,
      reason: config.reason || 'descanso',
      notes: config.notes || ''
    });
    setIsIntermittentDialogOpen(true);
  };

  const createIntermittentConfig = () => {
    setEditingIntermittent(null);
    setIntermittentFormData({
      dayOfWeek: 6,
      pattern: 'even-weeks',
      reason: 'descanso',
      notes: ''
    });
    setIsIntermittentDialogOpen(true);
  };

  const closeIntermittentDialog = () => {
    setIsIntermittentDialogOpen(false);
    setEditingIntermittent(null);
    setIntermittentFormData({
      dayOfWeek: 6,
      pattern: 'even-weeks',
      reason: 'descanso',
      notes: ''
    });
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Gestión de Disponibilidad
          </CardTitle>
          <CardDescription>
            Configura los días específicos cerrados y días de la semana con disponibilidad intermitente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="specific">Días Específicos</TabsTrigger>
              <TabsTrigger value="intermittent">Días Intermitentes</TabsTrigger>
            </TabsList>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  ← Anterior
                </Button>
                <h3 className="font-medium capitalize">
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  Siguiente →
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before month start */}
                {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2" />
                ))}
                
                {/* Month days */}
                {daysInMonth.map(date => {
                  const availability = getDayAvailability(date);
                  const isUnavailable = availability && !availability.isAvailable;
                  const isIntermittentlyClosed = isDayIntermittentlyClosed(date);
                  const intermittentConfig = getIntermittentConfig(date);
                  const reasonConfig = isUnavailable ? getReasonConfig(availability.reason) : null;

                  let buttonClass = 'h-12 p-1 flex flex-col items-center justify-center relative';
                  if (isUnavailable) {
                    buttonClass += ' bg-muted hover:bg-muted/80';
                  } else if (isIntermittentlyClosed) {
                    buttonClass += ' bg-orange-50 hover:bg-orange-100 border-orange-200 border-dashed';
                  } else if (intermittentConfig) {
                    buttonClass += ' bg-blue-50 hover:bg-blue-100 border-blue-200 border-dotted';
                  } else {
                    buttonClass += ' hover:bg-accent';
                  }

                  return (
                    <Button
                      key={date.toISOString()}
                      variant="ghost"
                      size="sm"
                      className={buttonClass}
                      onClick={() => handleDateClick(date)}
                    >
                      <span className={`text-sm flex items-center gap-1 ${(isUnavailable || isIntermittentlyClosed) ? 'text-muted-foreground line-through' : ''}`}>
                        <span>{format(date, 'd')}</span>
                        {intermittentConfig && (
                          <div className={`w-2 h-2 rounded-full ${isIntermittentlyClosed ? 'bg-orange-400' : 'bg-blue-400'}`} />
                        )}
                      </span>
                      {isUnavailable && reasonConfig && (
                        <div className={`w-2 h-2 rounded-full mt-1 ${reasonConfig.color.split(' ')[0]}`} />
                      )}
                    </Button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-background border-2 border-border"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200 border-dotted"></div>
                  <span>Disponible intermitente</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-orange-50 border border-orange-200 border-dashed"></div>
                  <span>Cerrado intermitente</span>
                </div>
                {reasonOptions.map(option => (
                  <div key={option.value} className="flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded ${option.color.split(' ')[0]}`}></div>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Specific Days Tab */}
            <TabsContent value="specific" className="space-y-4">
              {dayAvailability.length > 0 ? (
                <div className="space-y-3">
                  {dayAvailability
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map(day => {
                      const reasonConfig = getReasonConfig(day.reason);
                      return (
                        <div
                          key={day.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => handleDateClick(day.date)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium">
                              {format(day.date, "EEEE, d 'de' MMMM, yyyy")}
                            </div>
                            <Badge variant="secondary" className={reasonConfig.color}>
                              {reasonConfig.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {day.notes && (
                              <span className="text-xs text-muted-foreground max-w-32 truncate">
                                {day.notes}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                
                                handleDateClick(day.date);
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay días específicos marcados como cerrados
                </div>
              )}
            </TabsContent>

            {/* Intermittent Days Tab */}
            <TabsContent value="intermittent" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Configuración de Días Intermitentes</h4>
                  <p className="text-sm text-muted-foreground">Días de la semana que alternan entre disponible/cerrado</p>
                </div>
                <Button onClick={createIntermittentConfig}>
                  Agregar Configuración
                </Button>
              </div>

              {intermittentAvailability.length > 0 ? (
                <div className="space-y-3">
                  {intermittentAvailability.map(config => {
                    const dayLabel = dayOfWeekOptions.find(d => d.value === config.dayOfWeek)?.label;
                    const reasonConfig = getIntermittentReasonConfig(config.reason);
                    
                    return (
                      <div
                        key={config.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleIntermittentActive(config.id)}
                            className={config.isActive ? 'text-green-600' : 'text-muted-foreground'}
                          >
                            {config.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                          </Button>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{dayLabel}s</span>
                              <Badge variant="outline">
                                {config.pattern === 'even-weeks' ? 'Semanas pares' : 'Semanas impares'}
                              </Badge>
                              <Badge variant="secondary" className={reasonConfig.color}>
                                {reasonConfig.label}
                              </Badge>
                              {!config.isActive && (
                                <Badge variant="destructive">Inactivo</Badge>
                              )}
                            </div>
                            {config.notes && (
                              <p className="text-xs text-muted-foreground">{config.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editIntermittentConfig(config)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteIntermittentConfig(config.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay configuraciones de días intermitentes
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit/Add Specific Day Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDay 
                ? `Editar disponibilidad - ${format(editingDay.date, "d 'de' MMMM")}`
                : selectedDate 
                ? `Marcar como cerrado - ${format(selectedDate, "d 'de' MMMM")}`
                : 'Gestionar Disponibilidad'
              }
            </DialogTitle>
            <DialogDescription>
              {editingDay 
                ? 'Modifica los detalles de este día no disponible o márcalo como disponible.'
                : 'Marca este día como cerrado y agrega información adicional.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Select
                value={formData.reason}
                onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Agrega detalles adicionales..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-start">
              {editingDay && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleMakeAvailable}
                    className="flex-1 sm:flex-initial"
                  >
                    Marcar como disponible
                  </Button>
                </div>
              )}
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={closeDialog}
                  className="flex-1 sm:flex-initial"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 sm:flex-initial"
                >
                  {editingDay ? 'Guardar cambios' : 'Marcar como cerrado'}
                </Button>
              </div>
            </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* Intermittent Configuration Dialog */}
      <Dialog open={isIntermittentDialogOpen} onOpenChange={(open) => {
        if (!open) {
          closeIntermittentDialog();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingIntermittent ? 'Editar Configuración Intermitente' : 'Nueva Configuración Intermitente'}
            </DialogTitle>
            <DialogDescription>
              Configura un día de la semana para que alterne entre disponible y cerrado cada semana.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Día de la semana</Label>
              <Select
                value={intermittentFormData.dayOfWeek.toString()}
                onValueChange={(value) => setIntermittentFormData(prev => ({ ...prev, dayOfWeek: parseInt(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6 }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {dayOfWeekOptions.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pattern">Patrón de alternancia</Label>
              <Select
                value={intermittentFormData.pattern}
                onValueChange={(value: 'even-weeks' | 'odd-weeks') => setIntermittentFormData(prev => ({ ...prev, pattern: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el patrón" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="even-weeks">Cerrado en semanas pares</SelectItem>
                  <SelectItem value="odd-weeks">Cerrado en semanas impares</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intermittentReason">Motivo</Label>
              <Select
                value={intermittentFormData.reason}
                onValueChange={(value) => setIntermittentFormData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {intermittentReasonOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intermittentNotes">Notas (opcional)</Label>
              <Textarea
                id="intermittentNotes"
                placeholder="Agrega detalles adicionales..."
                value={intermittentFormData.notes}
                onChange={(e) => setIntermittentFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={closeIntermittentDialog}
            >
              Cancelar
            </Button>
            <Button onClick={handleIntermittentSubmit}>
              {editingIntermittent ? 'Guardar cambios' : 'Crear configuración'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}