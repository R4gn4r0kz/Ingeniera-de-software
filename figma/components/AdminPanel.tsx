import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "./AuthContext";
import { useTranslations } from "./translations";
import { 
  Settings, 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  Edit, 
  Trash2,
  Download
} from "lucide-react";

// Mock data
const mockBookings = [
  {
    id: "RES-001",
    guestName: "María González",
    email: "maria@email.com",
    room: "Habitación Deluxe",
    checkIn: "2024-12-15",
    checkOut: "2024-12-18",
    guests: 2,
    total: 360000,
    status: "confirmed"
  },
  {
    id: "RES-002", 
    guestName: "Juan Pérez",
    email: "juan@email.com",
    room: "Suite Ejecutiva",
    checkIn: "2024-12-20",
    checkOut: "2024-12-22",
    guests: 4,
    total: 360000,
    status: "pending"
  }
];

const mockUsers = [
  {
    id: "1",
    name: "María González",
    email: "maria@email.com",
    role: "cliente",
    registeredAt: "2024-02-01",
    totalBookings: 5
  },
  {
    id: "2",
    name: "Juan Pérez", 
    email: "juan@email.com",
    role: "cliente",
    registeredAt: "2024-03-15",
    totalBookings: 2
  }
];

const mockRoomPrices = [
  { id: "1", name: "Habitación Estándar", currentPrice: 85000, newPrice: 85000 },
  { id: "2", name: "Habitación Deluxe", currentPrice: 120000, newPrice: 120000 },
  { id: "3", name: "Suite Ejecutiva", currentPrice: 180000, newPrice: 180000 },
  { id: "4", name: "Habitación Familiar", currentPrice: 95000, newPrice: 95000 }
];

export function AdminPanel() {
  const { language } = useAuth();
  const t = useTranslations(language);
  const [roomPrices, setRoomPrices] = useState(mockRoomPrices);
  const [reportDateFrom, setReportDateFrom] = useState("");
  const [reportDateTo, setReportDateTo] = useState("");

  const handlePriceUpdate = (roomId: string, newPrice: number) => {
    setRoomPrices(prev => prev.map(room => 
      room.id === roomId ? { ...room, newPrice } : room
    ));
  };

  const savePrices = () => {
    setRoomPrices(prev => prev.map(room => ({ 
      ...room, 
      currentPrice: room.newPrice 
    })));
    alert("Precios actualizados exitosamente");
  };

  const generateReport = () => {
    if (!reportDateFrom || !reportDateTo) {
      alert("Seleccione ambas fechas para el reporte");
      return;
    }
    alert(`Generando reporte del ${reportDateFrom} al ${reportDateTo}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      confirmed: "default",
      pending: "secondary", 
      cancelled: "destructive"
    };
    
    const labels: Record<string, string> = {
      confirmed: t.confirmed,
      pending: t.pending,
      cancelled: t.cancelled
    };
    
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">{t.adminPanel}</h2>
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t.bookingManagement}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t.userManagement}
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {t.roomPricing}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t.reports}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t.calendar}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>{t.bookingManagement}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Huésped</TableHead>
                    <TableHead>Habitación</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-sm text-muted-foreground">{booking.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.room}</TableCell>
                      <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                      <TableCell>${booking.total.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{t.userManagement}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Total Reservas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.registeredAt).toLocaleDateString()}</TableCell>
                      <TableCell>{user.totalBookings}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>{t.roomPricing}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Habitación</TableHead>
                    <TableHead>Precio Actual</TableHead>
                    <TableHead>Nuevo Precio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomPrices.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>${room.currentPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={room.newPrice}
                          onChange={(e) => handlePriceUpdate(room.id, parseInt(e.target.value))}
                          className="w-32"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={savePrices}>
                {t.save} Precios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>{t.reports}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Desde</Label>
                  <Input
                    type="date"
                    value={reportDateFrom}
                    onChange={(e) => setReportDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Hasta</Label>
                  <Input
                    type="date"
                    value={reportDateTo}
                    onChange={(e) => setReportDateTo(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generateReport} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Generar Reporte
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Reservas Este Mes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-green-600">+12% vs mes anterior</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Ingresos Este Mes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">$2.840.000</p>
                    <p className="text-sm text-green-600">+8% vs mes anterior</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Ocupación Promedio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-sm text-blue-600">Estable</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>{t.reservationCalendar}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                  <div key={day} className="text-center font-semibold p-2 bg-muted rounded">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = i + 1;
                  const hasBooking = [5, 12, 15, 18, 20, 22, 28].includes(date);
                  return (
                    <div
                      key={i}
                      className={`p-3 border rounded text-center cursor-pointer hover:bg-muted ${
                        hasBooking ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    >
                      {date <= 31 ? date : ''}
                      {hasBooking && (
                        <div className="text-xs mt-1">Reserva</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}