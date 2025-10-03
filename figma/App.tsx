import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { SearchForm, SearchData } from "./components/SearchForm";
import { RoomCard } from "./components/RoomCard";
import { BookingForm, BookingData } from "./components/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { QRTicket } from "./components/QRTicket";
import { LoginForm } from "./components/LoginForm";
import { AdminPanel } from "./components/AdminPanel";
import { EmployeePanel } from "./components/EmployeePanel";
import { DownloadGuide } from "./components/DownloadGuide";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { useTranslations } from "./components/translations";
import { useHotelData, Room } from "./components/useHotelData";
import { ArrowLeft, Hotel, User, LogOut, Languages, Loader2, Database } from "lucide-react";

type AppState = "search" | "rooms" | "booking" | "confirmation" | "ticket" | "admin" | "employee" | "setup";

function AppContent() {
  const { user, isAuthenticated, logout, language, setLanguage, loading: authLoading } = useAuth();
  const t = useTranslations(language);
  const { 
    rooms, 
    loading: hotelLoading, 
    error: hotelError,
    fetchRooms, 
    createReservation 
  } = useHotelData();
  
  const [currentState, setCurrentState] = useState<AppState>("search");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [reservationId, setReservationId] = useState<string>('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  const handleSearch = async (data: SearchData) => {
    setSearchData(data);
    setCurrentState("rooms");
    
    // Fetch available rooms for the selected dates
    const rooms = await fetchRooms(data.checkIn, data.checkOut, data.guests);
    setAvailableRooms(rooms);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setCurrentState("booking");
  };

  const handleBookingSubmit = async (data: BookingData) => {
    if (!selectedRoom || !searchData) return;
    
    try {
      const reservationData = await createReservation(
        selectedRoom.id,
        searchData.checkIn,
        searchData.checkOut,
        searchData.guests,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          rut: data.rut,
          address: data.address,
          country: data.country
        }
      );
      
      setBookingData(data);
      setReservationId(reservationData.reservationId);
      setCurrentState("confirmation");
    } catch (error) {
      console.error('Error creating reservation:', error);
      // Handle error - could show a toast or error message
    }
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

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

              {/* Setup Database Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentState("setup")}
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Setup DB
              </Button>

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
            
            {hotelLoading && (
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                <p className="mt-2">Buscando habitaciones disponibles...</p>
              </div>
            )}
            
            {hotelError && (
              <div className="text-center text-red-500">
                <p>Error: {hotelError}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  nights={calculateNights()}
                  onSelect={handleRoomSelect}
                />
              ))}
            </div>
            
            {!hotelLoading && availableRooms.length === 0 && !hotelError && (
              <div className="text-center">
                <p className="text-muted-foreground">
                  {language === "es" 
                    ? "No hay habitaciones disponibles para las fechas seleccionadas"
                    : "No rooms available for the selected dates"
                  }
                </p>
              </div>
            )}
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

        {currentState === "setup" && (
          <DownloadGuide />
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