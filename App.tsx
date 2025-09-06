import { useState } from 'react';
import { Calendar1, Users, Settings, Phone, CalendarDays, Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Calendar } from './components/Calendar';
import { AppointmentGrid } from './components/AppointmentGrid';
import { ScheduleConfig } from './components/ScheduleConfig';
import { ContactInfo } from './components/ContactInfo';
import { AvailabilityConfig } from './components/AvailabilityConfig';
import { mockAppointments, mockWorkingHours, mockContactInfo, mockDayAvailability, mockIntermittentAvailability } from './data/mockData';
import { Appointment, WorkingHours, ContactInfo as ContactInfoType, DayAvailability, IntermittentAvailability } from './types/barbershop';

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(mockWorkingHours);
  const [contactInfo, setContactInfo] = useState<ContactInfoType>(mockContactInfo);
  const [dayAvailability, setDayAvailability] = useState<DayAvailability[]>(mockDayAvailability);
  const [intermittentAvailability, setIntermittentAvailability] = useState<IntermittentAvailability[]>(mockIntermittentAvailability);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );
  };

  const handleAppointmentDelete = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const handleWorkingHoursUpdate = (newWorkingHours: WorkingHours[]) => {
    setWorkingHours(newWorkingHours);
  };

  const handleContactInfoUpdate = (newContactInfo: ContactInfoType) => {
    setContactInfo(newContactInfo);
  };

  const handleDayAvailabilityUpdate = (newDayAvailability: DayAvailability[]) => {
    setDayAvailability(newDayAvailability);
  };

  const handleIntermittentAvailabilityUpdate = (newIntermittentAvailability: IntermittentAvailability[]) => {
    setIntermittentAvailability(newIntermittentAvailability);
  };

  const navigation = [
    { id: 'calendar', label: 'Agenda', icon: Calendar1 },
    { id: 'appointments', label: 'Turnos', icon: Users },
    { id: 'schedule', label: 'Horarios', icon: Settings },
    { id: 'availability', label: 'Disponibilidad', icon: CalendarDays },
    { id: 'contact', label: 'Contacto', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Calendar1 className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Dashboard Barbería</h1>
                <p className="text-sm text-muted-foreground">Gestión de turnos y agenda</p>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="calendar" className="space-y-6">
          {/* Navigation */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto">
              {navigation.map(({ id, label, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="flex items-center gap-2 py-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Calendar
              appointments={appointments}
              dayAvailability={dayAvailability}
              intermittentAvailability={intermittentAvailability}
              onAppointmentUpdate={handleAppointmentUpdate}
              onAppointmentDelete={handleAppointmentDelete}
            />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <AppointmentGrid
              appointments={appointments}
              onAppointmentUpdate={handleAppointmentUpdate}
              onAppointmentDelete={handleAppointmentDelete}
            />
          </TabsContent>

          {/* Schedule Config Tab */}
          <TabsContent value="schedule" className="space-y-6">
            
            <ScheduleConfig
              workingHours={workingHours}
              onUpdate={handleWorkingHoursUpdate}
            />
          </TabsContent>

          {/* Availability Config Tab */}
          <TabsContent value="availability" className="space-y-6">
            <AvailabilityConfig
              dayAvailability={dayAvailability}
              intermittentAvailability={intermittentAvailability}
              onUpdate={handleDayAvailabilityUpdate}
              onIntermittentUpdate={handleIntermittentAvailabilityUpdate}
            />
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="space-y-6">
            <ContactInfo
              contactInfo={contactInfo}
              onUpdate={handleContactInfoUpdate}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar1 className="h-4 w-4" />
              <span>Dashboard Barbería v1.0</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Desarrollado por elherno</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}