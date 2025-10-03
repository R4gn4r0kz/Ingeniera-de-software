import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  maxGuests: number;
  beds: number;
  size: number;
  image: string;
  amenities: string[];
  available: boolean;
  numero_habitacion?: string;
  id_habitacion?: number;
}

export interface Reserva {
  id_reserva: number;
  id_cliente: number;
  id_habitacion: number;
  fecha_reserva: string;
  fecha_checkin: string;
  fecha_checkout: string;
  estado_reserva: string;
  cantidad_personas: number;
  cliente?: {
    nombre: string;
    apellido: string;
    email: string;
  };
  habitacion?: {
    numero_habitacion: string;
    tipo: string;
    precio_noche: number;
  };
}

const roomImages = {
  'Single': 'https://images.unsplash.com/photo-1659177567968-220c704d58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc1NzYyNzY4MHww&ixlib=rb-4.1.0&q=80&w=1080',
  'Doble': 'https://images.unsplash.com/photo-1626868449668-fb47a048d9cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU3NTUzMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'Suite': 'https://images.unsplash.com/photo-1698870157085-11632d2ddef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NTc2Mjc2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Familiar': 'https://images.unsplash.com/photo-1659177567968-220c704d58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc1NzYyNzY4MHww&ixlib=rb-4.1.0&q=80&w=1080'
};

const roomTypeNames = {
  'Single': 'Habitación Estándar',
  'Doble': 'Habitación Deluxe', 
  'Suite': 'Suite Ejecutiva',
  'Familiar': 'Habitación Familiar'
};

const roomDescriptions = {
  'Single': 'Habitación con vista al jardín',
  'Doble': 'Habitación con vista al mar',
  'Suite': 'Suite con sala de estar separada', 
  'Familiar': 'Habitación con camas adicionales'
};

function convertHabitacionToRoom(habitacion: any): Room {
  const bedsMap = { 'Single': 1, 'Doble': 1, 'Suite': 2, 'Familiar': 3 };
  const sizeMap = { 'Single': 25, 'Doble': 35, 'Suite': 55, 'Familiar': 45 };
  
  return {
    id: habitacion.id_habitacion.toString(),
    id_habitacion: habitacion.id_habitacion,
    numero_habitacion: habitacion.numero_habitacion,
    name: roomTypeNames[habitacion.tipo as keyof typeof roomTypeNames] || habitacion.tipo,
    type: roomDescriptions[habitacion.tipo as keyof typeof roomDescriptions] || habitacion.tipo,
    price: habitacion.precio_noche,
    maxGuests: habitacion.capacidad,
    beds: bedsMap[habitacion.tipo as keyof typeof bedsMap] || 1,
    size: sizeMap[habitacion.tipo as keyof typeof sizeMap] || 30,
    image: roomImages[habitacion.tipo as keyof typeof roomImages] || roomImages.Single,
    amenities: ["wifi", "tv", "breakfast"],
    available: habitacion.estado === 'DISPONIBLE'
  };
}

export function useHotelData() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bcc102${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      await apiCall('/init-data', { method: 'POST' });
    } catch (err) {
      console.error('Error initializing data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (checkIn?: string, checkOut?: string, guests?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '/habitaciones';
      const params = new URLSearchParams();
      
      if (checkIn && checkOut && guests) {
        endpoint = '/habitaciones/disponibles';
        params.append('checkIn', checkIn);
        params.append('checkOut', checkOut);
        params.append('guests', guests.toString());
      }
      
      const query = params.toString();
      const url = query ? `${endpoint}?${query}` : endpoint;
      
      const data = await apiCall(url);
      const convertedRooms = data.habitaciones.map(convertHabitacionToRoom);
      setRooms(convertedRooms);
      
      return convertedRooms;
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err instanceof Error ? err.message : 'Error fetching rooms');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (
    roomId: string, 
    checkIn: string, 
    checkOut: string, 
    guests: number,
    clienteData: any,
    accessToken?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      };
      
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      
      const room = rooms.find(r => r.id === roomId);
      
      const data = await apiCall('/reservas', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id_habitacion: room?.id_habitacion || parseInt(roomId),
          fecha_checkin: checkIn,
          fecha_checkout: checkOut,
          cantidad_personas: guests,
          cliente_data: clienteData
        })
      });
      
      return data;
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError(err instanceof Error ? err.message : 'Error creating reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async (accessToken?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      };
      
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      
      const data = await apiCall('/reservas', { headers });
      setReservas(data.reservas);
      
      return data.reservas;
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError(err instanceof Error ? err.message : 'Error fetching reservations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAdminStats = async (accessToken?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      };
      
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      
      const data = await apiCall('/admin/stats', { headers });
      return data.stats;
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err instanceof Error ? err.message : 'Error fetching admin stats');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize data when hook is first used
    initializeData();
  }, []);

  return {
    rooms,
    reservas,
    loading,
    error,
    fetchRooms,
    createReservation,
    fetchReservations,
    getAdminStats,
    initializeData
  };
}