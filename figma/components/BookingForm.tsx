import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Room } from "./RoomCard";
import { SearchData } from "./SearchForm";
import { User, Mail, Phone, CreditCard } from "lucide-react";

interface BookingFormProps {
  room: Room;
  searchData: SearchData;
  onSubmit: (bookingData: BookingData) => void;
  onBack: () => void;
}

export interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  rut?: string;
  address?: string;
  country?: string;
}

export function BookingForm({ room, searchData, onSubmit, onBack }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    rut: "",
    address: "",
    country: "",
  });

  const nights = Math.ceil(
    (new Date(searchData.checkOut).getTime() - new Date(searchData.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const totalPrice = room.price * nights;
  const taxes = Math.round(totalPrice * 0.19); // 19% tax
  const finalTotal = totalPrice + taxes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información del Huésped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT/Pasaporte (Opcional)</Label>
                  <Input
                    id="rut"
                    value={formData.rut}
                    onChange={(e) => handleInputChange("rut", e.target.value)}
                    placeholder="12.345.678-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección (Opcional)</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Dirección completa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País (Opcional)</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Chile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Solicitudes Especiales (Opcional)</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Ej: Cama extra, vista al mar, check-in tardío..."
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Información de Pago
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Nombre en la Tarjeta</Label>
                    <Input
                      id="cardHolder"
                      value={formData.cardHolder}
                      onChange={(e) => handleInputChange("cardHolder", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Volver
                </Button>
                <Button type="submit" className="flex-1">
                  Confirmar Reserva
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Resumen de la Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">{room.name}</h4>
              <p className="text-sm text-muted-foreground">{room.type}</p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span>{new Date(searchData.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span>{new Date(searchData.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Huéspedes:</span>
                <span>{searchData.guests}</span>
              </div>
              <div className="flex justify-between">
                <span>Habitaciones:</span>
                <span>{searchData.rooms}</span>
              </div>
              <div className="flex justify-between">
                <span>Noches:</span>
                <span>{nights}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>${room.price.toLocaleString()} x {nights} noches</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos y tasas</span>
                <span>${taxes.toLocaleString()}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${finalTotal.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}