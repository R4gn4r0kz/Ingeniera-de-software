import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "./AuthContext";
import { useTranslations } from "./translations";
import { Calendar, MapPin, Users } from "lucide-react";

interface SearchFormProps {
  onSearch: (searchData: SearchData) => void;
}

export interface SearchData {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const { language } = useAuth();
  const t = useTranslations(language);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkIn && checkOut) {
      onSearch({ checkIn, checkOut, guests, rooms });
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkin" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t.checkIn}
              </Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t.checkOut}
              </Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t.guests}
              </Label>
              <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? t.guest : t.guests.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rooms" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t.rooms}
              </Label>
              <Select value={rooms.toString()} onValueChange={(value) => setRooms(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? t.room : t.rooms.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto">
            {t.searchRooms}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}