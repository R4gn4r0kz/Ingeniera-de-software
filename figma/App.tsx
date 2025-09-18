import { useState } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { SearchForm, SearchData } from "./components/SearchForm";
import { RoomCard, Room } from "./components/RoomCard";
import { BookingForm, BookingData } from "./components/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { QRTicket } from "./components/QRTicket";
import { LoginForm } from "./components/LoginForm";
import { AdminPanel } from "./components/AdminPanel";
import { EmployeePanel } from "./components/EmployeePanel";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { useTranslations } from "./components/translations";
import { ArrowLeft, Hotel, User, LogOut, Languages } from "lucide-react";

// Mock data for available rooms
const mockRooms: Room[] = [
  {
    id: "1",
    name: "Habitación Estándar",
    type: "Habitación con vista al jardín",
    price: 85000,
    maxGuests: 2,
    beds: 1,
    size: 25,
    image: "https://images.unsplash.com/photo-1659177567968-220c704d58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc1NzYyNzY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["wifi", "tv", "breakfast"],
    available: true,
  },
  {
    id: "2",
    name: "Habitación Deluxe",
    type: "Habitación con vista al mar",
    price: 120000,
    maxGuests: 3,
    beds: 1,
    size: 35,
    image: "https://images.unsplash.com/photo-1626868449668-fb47a048d9cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU3NTUzMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["wifi", "tv", "breakfast", "parking"],
    available: true,
  },
  {
    id: "3",
    name: "Suite Ejecutiva",
    type: "Suite con sala de estar separada",
    price: 180000,
    maxGuests: 4,
    beds: 2,
    size: 55,
    image: "https://images.unsplash.com/photo-1698870157085-11632d2ddef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NTc2Mjc2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["wifi", "tv", "breakfast", "parking"],
    available: true,
  },
  {
    id: "4",
    name: "Habitación Familiar",
    type: "Habitación con camas adicionales",
    price: 95000,
    maxGuests: 6,
    beds: 3,
    size: 45,
    image: "https://images.unsplash.com/photo-1659177567968-220c704d58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc1NzYyNzY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["wifi", "tv", "breakfast"],
    available: false,
  },
];

type AppState = "search" | "rooms" | "booking" | "confirmation" | "ticket" | "admin" | "employee";

function AppContent() {
  const { user, isAuthenticated, logout, language, setLanguage } = useAuth();
  const t = useTranslations(language);
  const [currentState, setCurrentState] = useState<AppState>("search");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [reservationId] = useState(() => 
    'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  );

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    setCurrentState("rooms");
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setCurrentState("booking");
  };

  const handleBookingSubmit = (data: BookingData) => {
    setBookingData(data);
    setCurrentState("confirmation");
  };

  const handleViewTicket = () => {
    setCurrentState("ticket");
  };

  const handleNewSearch = () => {
    setCurrentState("search");
    setSearchData(null);
    setSelectedRoom(null);
    setBookingData(null);
  };

  const goBack = () => {
    if (currentState === "rooms") {
      setCurrentState("search");
    } else if (currentState === "booking") {
      setCurrentState("rooms");
    } else if (currentState === "ticket") {
      setCurrentState("confirmation");
    } else if (currentState === "admin" || currentState === "employee") {
      setCurrentState("search");
    }
  };

  const calculateNights = () => {
    if (!searchData) return 1;
    return Math.ceil(
      (new Date(searchData.checkOut).getTime() - new Date(searchData.checkIn).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
  };

  const getRoleBasedDashboard = () => {
    if (user?.role === "administrador") {
      setCurrentState("admin");
    } else if (user?.role === "empleado") {
      setCurrentState("employee");
    }
  };

  // Si no está autenticado, mostrar pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header simplificado para login */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Hotel className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">{t.hotelReserva}</h1>
              </div>
              
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: "es" | "en") => setLanguage(value)}>
                <SelectTrigger className="w-24">
                  <Languages className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">ES</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Pantalla de Login */}
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="w-full max-w-md">
            <LoginForm onClose={() => {}} />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-muted">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p>&copy; 2024 HotelReserva. Sistema de reservas hoteleras para ejercicio académico.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hotel className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">{t.hotelReserva}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: "es" | "en") => setLanguage(value)}>
                <SelectTrigger className="w-24">
                  <Languages className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">ES</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                </SelectContent>
              </Select>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={getRoleBasedDashboard}>
                  <User className="w-4 h-4 mr-2" />
                  {user?.firstName}
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

              {/* Back Button */}
              {currentState !== "search" && (
                <Button variant="outline" onClick={goBack} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t.back}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentState === "search" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">{t.findPerfectRoom}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t.searchDescription}
              </p>
            </div>
            <SearchForm onSearch={handleSearch} />
          </div>
        )}

        {currentState === "rooms" && searchData && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{t.availableRooms}</h2>
              <p className="text-muted-foreground">
                {language === "es" 
                  ? `Del ${new Date(searchData.checkIn).toLocaleDateString()} al ${new Date(searchData.checkOut).toLocaleDateString()} • ${searchData.guests} huéspedes • ${searchData.rooms} habitación(es)`
                  : `From ${new Date(searchData.checkIn).toLocaleDateString()} to ${new Date(searchData.checkOut).toLocaleDateString()} • ${searchData.guests} guests • ${searchData.rooms} room(s)`
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRooms
                .filter(room => room.maxGuests >= searchData.guests)
                .map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    nights={calculateNights()}
                    onSelect={handleRoomSelect}
                  />
                ))}
            </div>
          </div>
        )}

        {currentState === "booking" && selectedRoom && searchData && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">{t.completeBooking}</h2>
              <p className="text-muted-foreground">
                {language === "es" 
                  ? `Ingresa tus datos para confirmar la reserva de ${selectedRoom.name}`
                  : `Enter your details to confirm booking for ${selectedRoom.name}`
                }
              </p>
            </div>
            <BookingForm
              room={selectedRoom}
              searchData={searchData}
              onSubmit={handleBookingSubmit}
              onBack={goBack}
            />
          </div>
        )}

        {currentState === "confirmation" && selectedRoom && searchData && bookingData && (
          <div className="space-y-6">
            <BookingConfirmation
              room={selectedRoom}
              searchData={searchData}
              bookingData={bookingData}
              reservationId={reservationId}
              onNewSearch={handleNewSearch}
            />
            <div className="text-center">
              <Button onClick={handleViewTicket} variant="outline">
                Ver Ticket con QR
              </Button>
            </div>
          </div>
        )}

        {currentState === "ticket" && selectedRoom && searchData && bookingData && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Ticket de Reserva</h2>
              <p className="text-muted-foreground">
                Guarda este ticket para presentar en el hotel
              </p>
            </div>
            <QRTicket
              room={selectedRoom}
              searchData={searchData}
              bookingData={bookingData}
              reservationId={reservationId}
            />
          </div>
        )}

        {currentState === "admin" && user?.role === "administrador" && (
          <AdminPanel />
        )}

        {currentState === "employee" && user?.role === "empleado" && (
          <EmployeePanel />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 HotelReserva. Sistema de reservas hoteleras para ejercicio académico.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}