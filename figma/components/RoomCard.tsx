import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Wifi, Car, Coffee, Tv, Users, Bed } from "lucide-react";

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
}

interface RoomCardProps {
  room: Room;
  nights: number;
  onSelect: (room: Room) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  breakfast: <Coffee className="w-4 h-4" />,
  tv: <Tv className="w-4 h-4" />,
};

export function RoomCard({ room, nights, onSelect }: RoomCardProps) {
  const totalPrice = room.price * nights;

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <ImageWithFallback
          src={room.image}
          alt={room.name}
          className="w-full h-48 object-cover"
        />
        {!room.available && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            No Disponible
          </Badge>
        )}
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <p className="text-muted-foreground">{room.type}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${room.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">por noche</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Hasta {room.maxGuests} huéspedes</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{room.beds} {room.beds === 1 ? 'cama' : 'camas'}</span>
          </div>
          <span>{room.size}m²</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {room.amenities.map((amenity) => (
            <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
              {amenityIcons[amenity]}
              <span className="capitalize">{amenity}</span>
            </Badge>
          ))}
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span>Total por {nights} {nights === 1 ? 'noche' : 'noches'}:</span>
            <span className="text-lg font-semibold">${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => onSelect(room)} 
          disabled={!room.available}
          className="w-full"
        >
          {room.available ? 'Seleccionar Habitación' : 'No Disponible'}
        </Button>
      </CardFooter>
    </Card>
  );
}