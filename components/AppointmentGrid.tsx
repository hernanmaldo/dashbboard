import  { useState, useMemo } from 'react';
import { Search, Filter, Check, X, Edit, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Appointment, serviceLabels } from '../types/barbershop';
import { formatShortDate } from '../utils/dateUtils';

interface AppointmentGridProps {
  appointments: Appointment[];
  onAppointmentUpdate: (appointment: Appointment) => void;
  onAppointmentDelete: (id: string) => void;
}

type FilterStatus = 'all' | 'pendiente' | 'confirmado' | 'cancelado';
type FilterService = 'all' | 'corte' | 'barba' | 'combo';

export function AppointmentGrid({ appointments, onAppointmentUpdate }: AppointmentGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<FilterService>('all');

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = 
        appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.phone?.includes(searchTerm) ||
        serviceLabels[appointment.service].toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesService = serviceFilter === 'all' || appointment.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [appointments, searchTerm, statusFilter, serviceFilter]);

  const getStatusBadge = (status: Appointment['status']) => {
    const variants = {
      pendiente: 'secondary',
      confirmado: 'default',
      cancelado: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getServiceBadge = (service: Appointment['service']) => {
    const colors = {
      corte: 'bg-blue-500 text-white',
      barba: 'bg-green-500 text-white',
      combo: 'bg-orange-500 text-white'
    };

    return (
      <Badge className={colors[service]}>
        {serviceLabels[service]}
      </Badge>
    );
  };

  const handleConfirm = (appointment: Appointment) => {
    onAppointmentUpdate({ ...appointment, status: 'confirmado' });
  };

  const handleCancel = (appointment: Appointment) => {
    onAppointmentUpdate({ ...appointment, status: 'cancelado' });
  };

  const handleRestore = (appointment: Appointment) => {
    onAppointmentUpdate({ ...appointment, status: 'pendiente' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Turnos</CardTitle>
        
        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, teléfono o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(value: FilterStatus) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={(value: FilterService) => setServiceFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los servicios</SelectItem>
                <SelectItem value="corte">Corte</SelectItem>
                <SelectItem value="barba">Barba</SelectItem>
                <SelectItem value="combo">Combo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 p-3 rounded">
            <div className="text-lg">{appointments.length}</div>
            <div className="text-sm text-muted-foreground">Total turnos</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-lg text-green-700">
              {appointments.filter(a => a.status === 'confirmado').length}
            </div>
            <div className="text-sm text-green-600">Confirmados</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-lg text-yellow-700">
              {appointments.filter(a => a.status === 'pendiente').length}
            </div>
            <div className="text-sm text-yellow-600">Pendientes</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-lg text-red-700">
              {appointments.filter(a => a.status === 'cancelado').length}
            </div>
            <div className="text-sm text-red-600">Cancelados</div>
          </div>
        </div>

        {/* Tabla de turnos */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron turnos que coincidan con los filtros
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div>{appointment.clientName}</div>
                        {appointment.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-32">
                            {appointment.notes}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatShortDate(appointment.date)}
                      </div>
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{getServiceBadge(appointment.service)}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {appointment.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span className="text-xs">{appointment.phone}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {appointment.status === 'pendiente' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirm(appointment)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        
                        {appointment.status === 'confirmado' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(appointment)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                        
                        {appointment.status === 'cancelado' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(appointment)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}