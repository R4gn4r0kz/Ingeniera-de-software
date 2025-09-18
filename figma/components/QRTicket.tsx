import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Room } from "./RoomCard";
import { SearchData } from "./SearchForm";
import { BookingData } from "./BookingForm";
import { Download, Mail, QrCode } from "lucide-react";

interface QRTicketProps {
  room: Room;
  searchData: SearchData;
  bookingData: BookingData;
  reservationId: string;
}

// Simple QR Code placeholder - in a real app you'd use a QR library
function QRCodePlaceholder({ data }: { data: string }) {
  return (
    <div className="w-32 h-32 border-2 border-dashed border-muted-foreground rounded flex items-center justify-center bg-muted">
      <div className="text-center">
        <QrCode className="w-8 h-8 mx-auto mb-1" />
        <p className="text-xs">QR Code</p>
        <p className="text-xs text-muted-foreground">{data}</p>
      </div>
    </div>
  );
}

export function QRTicket({ room, searchData, bookingData, reservationId }: QRTicketProps) {
  const nights = Math.ceil(
    (new Date(searchData.checkOut).getTime() - new Date(searchData.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const totalPrice = room.price * nights;
  const taxes = Math.round(totalPrice * 0.19);
  const finalTotal = totalPrice + taxes;

  const qrData = `RES:${reservationId}|GUEST:${bookingData.firstName}_${bookingData.lastName}|ROOM:${room.name}|CHECKIN:${searchData.checkIn}|CHECKOUT:${searchData.checkOut}`;

  const downloadTicket = () => {
    // In a real app, this would generate a PDF
    alert("Descargando ticket como PDF...");
  };

  const emailTicket = () => {
    // In a real app, this would send the email
    alert(`Enviando ticket a ${bookingData.email}...`);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-bold">HotelReserva</h3>
          <p className="text-sm text-muted-foreground">Ticket de Reserva</p>
        </div>

        <Separator />

        {/* QR Code */}
        <div className="flex justify-center">
          <QRCodePlaceholder data={reservationId} />
        </div>

        <Separator />

        {/* Reservation Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">ID de Reserva:</span>
            <span>{reservationId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Huésped:</span>
            <span>{bookingData.firstName} {bookingData.lastName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span className="text-xs">{bookingData.email}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Teléfono:</span>
            <span>{bookingData.phone}</span>
          </div>
        </div>

        <Separator />

        {/* Room & Dates */}
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">{room.name}</p>
            <p className="text-muted-foreground">{room.type}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Check-in</p>
              <p>{new Date(searchData.checkIn).toLocaleDateString()}</p>
              <p className="text-muted-foreground">15:00</p>
            </div>
            <div>
              <p className="font-medium">Check-out</p>
              <p>{new Date(searchData.checkOut).toLocaleDateString()}</p>
              <p className="text-muted-foreground">12:00</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <span>Huéspedes:</span>
            <span>{searchData.guests}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Noches:</span>
            <span>{nights}</span>
          </div>
        </div>

        <Separator />

        {/* Payment Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Habitación ({nights} noches):</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos:</span>
            <span>${taxes.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total Pagado:</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Important Notes */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Presente este ticket al llegar al hotel</p>
          <p>• Traiga identificación válida</p>
          <p>• Check-in: 15:00 - Check-out: 12:00</p>
          <p>• Cancelación gratuita hasta 24h antes</p>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={downloadTicket} className="w-full flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
          <Button onClick={emailTicket} variant="outline" className="w-full flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Enviar por Email
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          <p>Generado el {new Date().toLocaleString()}</p>
          <p>¡Gracias por elegir HotelReserva!</p>
        </div>
      </CardContent>
    </Card>
  );
}