import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useAuth } from "./AuthContext";
import { useTranslations } from "./translations";
import { Calendar, Clock, Users, Bed, CheckCircle } from "lucide-react";

// Mock today's reservations
const todayReservations = [
  {
    id: "RES-001",
    guestName: "María González",
    room: "Habitación Deluxe",
    roomNumber: "205",
    checkIn: "15:00",
    checkOut: "12:00",
    guests: 2,
    specialRequests: "Cama extra, vista al mar",
    status: "arriving",
    services: ["breakfast", "parking"]
  },
  {
    id: "RES-002",
    guestName: "Juan Pérez",
    room: "Suite Ejecutiva", 
    roomNumber: "301",
    checkIn: "14:00",
    checkOut: "11:00",
    guests: 4,
    specialRequests: "Check-in temprano",
    status: "checked-in",
    services: ["breakfast", "wifi", "parking"]
  },
  {
    id: "RES-003",
    guestName: "Ana Martínez",
    room: "Habitación Estándar",
    roomNumber: "102",
    checkIn: "16:00", 
    checkOut: "12:00",
    guests: 1,
    specialRequests: "",
    status: "departing",
    services: ["breakfast"]
  }
];

const upcomingReservations = [
  {
    id: "RES-004",
    guestName: "Carlos López",
    room: "Habitación Familiar",
    roomNumber: "210",
    checkIn: "2024-12-16",
    checkOut: "2024-12-19",
    guests: 5,
    specialRequests: "Celebración de cumpleaños",
    services: ["breakfast", "parking"]
  },
  {
    id: "RES-005",
    guestName: "Sofia Rivera",
    room: "Suite Ejecutiva",
    roomNumber: "302", 
    checkIn: "2024-12-17",
    checkOut: "2024-12-20",
    guests: 2,
    specialRequests: "Luna de miel - decoración especial",
    services: ["breakfast", "wifi", "parking"]
  }
];

export function EmployeePanel() {
  const { language } = useAuth();
  const t = useTranslations(language);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      arriving: "secondary",
      "checked-in": "default",
      departing: "destructive"
    };
    
    const labels: Record<string, string> = {
      arriving: "Llegando",
      "checked-in": "En habitación", 
      departing: "Saliendo"
    };
    
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const markAsCompleted = (reservationId: string) => {
    alert(`Servicios marcados como completados para reserva ${reservationId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        <h2 className="text-2xl font-bold">{t.employeePanel}</h2>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Check-ins Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Check-outs Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Habitaciones Ocupadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Servicios Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>{t.todayReservations}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayReservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{reservation.guestName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {reservation.room} - Habitación {reservation.roomNumber}
                    </p>
                  </div>
                  {getStatusBadge(reservation.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Horarios</p>
                    <p>Check-in: {reservation.checkIn}</p>
                    <p>Check-out: {reservation.checkOut}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Huéspedes</p>
                    <p>{reservation.guests} personas</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Servicios</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reservation.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {reservation.specialRequests && (
                  <div className="text-sm">
                    <p className="font-medium">Solicitudes Especiales:</p>
                    <p className="text-muted-foreground">{reservation.specialRequests}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markAsCompleted(reservation.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Marcar Servicios Completados
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingReservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{reservation.guestName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {reservation.room} - Habitación {reservation.roomNumber}
                    </p>
                  </div>
                  <Badge variant="secondary">Próxima</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Fechas</p>
                    <p>Llegada: {new Date(reservation.checkIn).toLocaleDateString()}</p>
                    <p>Salida: {new Date(reservation.checkOut).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Huéspedes</p>
                    <p>{reservation.guests} personas</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Servicios</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reservation.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {reservation.specialRequests && (
                  <div className="text-sm">
                    <p className="font-medium">Solicitudes Especiales:</p>
                    <p className="text-muted-foreground">{reservation.specialRequests}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mini Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendario de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
              <div key={day} className="text-center font-semibold p-2 bg-muted rounded text-sm">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const date = i + 1;
              const hasReservation = [15, 16, 17, 20, 22, 25, 28].includes(date);
              const isToday = date === 15; // Simulate today
              return (
                <div
                  key={i}
                  className={`p-2 border rounded text-center cursor-pointer hover:bg-muted text-sm ${
                    isToday ? 'bg-primary text-primary-foreground' : 
                    hasReservation ? 'bg-blue-100 border-blue-300' : ''
                  }`}
                >
                  {date <= 31 ? date : ''}
                  {hasReservation && !isToday && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Hoy</span>
              <div className="w-3 h-3 bg-blue-500 rounded ml-4"></div>
              <span>Con reservas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}