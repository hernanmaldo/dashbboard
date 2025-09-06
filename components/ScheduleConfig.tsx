import  { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { WorkingHours } from '../types/barbershop';

interface ScheduleConfigProps {
  workingHours: WorkingHours[];
  onUpdate: (workingHours: WorkingHours[]) => void;
}

const dayLabels = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo'
};

export function ScheduleConfig({ workingHours, onUpdate }: ScheduleConfigProps) {
  const [localHours, setLocalHours] = useState<WorkingHours[]>(workingHours);
  console.log(workingHours)
  const updateDay = (dayIndex: number, updates: Partial<WorkingHours>) => {
    const newHours = [...localHours];
    newHours[dayIndex] = { ...newHours[dayIndex], ...updates };
    setLocalHours(newHours);
    onUpdate(newHours);

    
  };

  const addTimeSlot = (dayIndex: number) => {
    const day = localHours[dayIndex];
    const newTimeSlots = [...day.timeSlots, { start: '09:00', end: '17:00' }];
    updateDay(dayIndex, { timeSlots: newTimeSlots });
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const day = localHours[dayIndex];
    const newTimeSlots = day.timeSlots.filter((_, index) => index !== slotIndex);
    updateDay(dayIndex, { timeSlots: newTimeSlots });
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    const day = localHours[dayIndex];
    const newTimeSlots = [...day.timeSlots];
    newTimeSlots[slotIndex] = { ...newTimeSlots[slotIndex], [field]: value };
    updateDay(dayIndex, { timeSlots: newTimeSlots });
  };

  const toggleDay = (dayIndex: number) => {
    const day = localHours[dayIndex];
    updateDay(dayIndex, { 
      isOpen: !day.isOpen,
      timeSlots: !day.isOpen ? [{ start: '09:00', end: '17:00' }] : []
    });
  };
{/*
  const copySchedule = (fromDayIndex: number, toDayIndex: number) => {
    const fromDay = localHours[fromDayIndex];
    updateDay(toDayIndex, {
      isOpen: fromDay.isOpen,
      timeSlots: [...fromDay.timeSlots]
    });
  };
*/}
  const applyToWeekdays = (dayIndex: number) => {
    const sourceDay = localHours[dayIndex];
    const weekdayIndices = [0, 1, 2, 3, 4]; // Lunes a Viernes
    
    weekdayIndices.forEach(index => {
      if (index !== dayIndex) {
        updateDay(index, {
          isOpen: sourceDay.isOpen,
          timeSlots: [...sourceDay.timeSlots]
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Configuración de Horarios
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Define los días y horarios de atención de la barbería
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {localHours.map((day, dayIndex) => (
          <div key={day.day} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={day.isOpen}
                  onCheckedChange={() => toggleDay(dayIndex)}
                />
                <Label className="text-base">{dayLabels[day.day]}</Label>
                {!day.isOpen && (
                  <span className="text-sm text-muted-foreground">(Cerrado)</span>
                )}
              </div>

              {day.isOpen && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyToWeekdays(dayIndex)}
                    className="text-xs"
                  >
                    Aplicar a días laborales
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addTimeSlot(dayIndex)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Horario
                  </Button>
                </div>
              )}
            </div>

            {day.isOpen && (
              <div className="space-y-3">
                {day.timeSlots.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Sin horarios configurados</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addTimeSlot(dayIndex)}
                      className="mt-2"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Agregar primer horario
                    </Button>
                  </div>
                ) : (
                  day.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-3 bg-muted/30 p-3 rounded">
                      <div className="flex items-center gap-2 flex-1">
                        <Label className="text-sm">Desde:</Label>
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                          className="w-auto"
                        />
                        <Label className="text-sm">Hasta:</Label>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                          className="w-auto"
                        />
                      </div>
                      
                      {day.timeSlots.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}

                {/* Previsualización */}
                {day.timeSlots.length > 0 && (
                  <div className="bg-accent/50 p-3 rounded">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Horarios del {dayLabels[day.day].toLowerCase()}: </span>
                      {day.timeSlots.map((slot, index) => (
                        <span key={index}>
                          {slot.start} - {slot.end}
                          {index < day.timeSlots.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Plantillas rápidas */}
        <div className="border-t pt-6">
          <h4 className="mb-3">Plantillas rápidas</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const standardHours: WorkingHours[] = localHours.map(day => ({
                  ...day,
                  isOpen: day.day !== 'domingo',
                  timeSlots: day.day !== 'domingo' ? [
                    { start: '09:00', end: '13:00' },
                    { start: '16:00', end: '20:00' }
                  ] : []
                }));
                setLocalHours(standardHours);
                onUpdate(standardHours);
              }}
            >
              Horario estándar
              <div className="text-xs text-muted-foreground ml-2">
                Lun-Sáb: 9-13, 16-20
              </div>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const continuousHours: WorkingHours[] = localHours.map(day => ({
                  ...day,
                  isOpen: day.day !== 'domingo',
                  timeSlots: day.day !== 'domingo' ? [
                    { start: '09:00', end: '18:00' }
                  ] : []
                }));
                setLocalHours(continuousHours);
                onUpdate(continuousHours);
              }}
            >
              Horario corrido
              <div className="text-xs text-muted-foreground ml-2">
                Lun-Sáb: 9-18
              </div>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const closedHours: WorkingHours[] = localHours.map(day => ({
                  ...day,
                  isOpen: false,
                  timeSlots: []
                }));
                setLocalHours(closedHours);
                onUpdate(closedHours);
              }}
            >
              Cerrar todo
              <div className="text-xs text-muted-foreground ml-2">
                Todos los días cerrados
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}