import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Room } from "./RoomCard";
import { SearchData } from "./SearchForm";
import { BookingData } from "./BookingForm";
import { CheckCircle, Download, Mail, Calendar, MapPin, User } from "lucide-react";

interface BookingConfirmationProps {
  room: Room;
  searchData: SearchData;
  bookingData: BookingData;
  reservationId: string;
  onNewSearch: () => void;
}

export function BookingConfirmation({ 
  room, 
  searchData, 
  bookingData, 
  reservationId, 
  onNewSearch 
}: BookingConfirmationProps) {
  const nights = Math.ceil(
    (new Date(searchData.checkOut).getTime() - new Date(searchData.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const totalPrice = room.price * nights;
  const taxes = Math.round(totalPrice * 0.19);
  const finalTotal = totalPrice + taxes;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            ¡Reserva Confirmada!
          </h2>
          <p className="text-muted-foreground">
            Tu reserva ha sido procesada exitosamente
          </p>
          <Badge variant="secondary" className="mt-4">
            ID de Reserva: {reservationId}
          </Badge>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Detalles de la Reserva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Habitación</h4>
                <p>{room.name}</p>
                <p className="text-sm text-muted-foreground">{room.type}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Fechas</h4>
                <p className="text-sm">
                  Check-in: {new Date(searchData.checkIn).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm">
                  Check-out: {new Date(searchData.checkOut).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {nights} {nights === 1 ? 'noche' : 'noches'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Huésped Principal
                </h4>
                <p>{bookingData.firstName} {bookingData.lastName}</p>
                <p className="text-sm text-muted-foreground">{bookingData.email}</p>
                <p className="text-sm text-muted-foreground">{bookingData.phone}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Detalles</h4>
                <p className="text-sm">
                  {searchData.guests} {searchData.guests === 1 ? 'huésped' : 'huéspedes'}
                </p>
                <p className="text-sm">
                  {searchData.rooms} {searchData.rooms === 1 ? 'habitación' : 'habitaciones'}
                </p>
              </div>
            </div>
          </div>

          {bookingData.specialRequests && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-1">Solicitudes Especiales</h4>
                <p className="text-sm text-muted-foreground">{bookingData.specialRequests}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <h4 className="font-semibold">Resumen de Costos</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>${room.price.toLocaleString()} x {nights} noches</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos y tasas</span>
                <span>${taxes.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Pagado</span>
                <span>${finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Información Importante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold">Check-in</h4>
            <p className="text-muted-foreground">
              Disponible a partir de las 15:00. Se requiere identificación válida.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Check-out</h4>
            <p className="text-muted-foreground">
              Antes de las 12:00. Check-out tardío disponible por tarifa adicional.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Política de Cancelación</h4>
            <p className="text-muted-foreground">
              Cancelación gratuita hasta 24 horas antes del check-in.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" className="flex-1 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Descargar Confirmación
        </Button>
        <Button variant="outline" className="flex-1 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Enviar por Email
        </Button>
        <Button onClick={onNewSearch} className="flex-1">
          Nueva Búsqueda
        </Button>
      </div>
    </div>
  );
}