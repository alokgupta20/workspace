import { Video, Calendar, MessageCircle, Phone, Stethoscope, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface QuickActionsProps {
  onInstantConsult: () => void;
  onBookAppointment: () => void;
  onViewDoctors: () => void;
}

export function QuickActions({ onInstantConsult, onBookAppointment, onViewDoctors }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer" onClick={onInstantConsult}>
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Consult Now</h3>
          <p className="text-blue-100 text-sm">Get instant medical consultation</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer" onClick={onBookAppointment}>
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Book Appointment</h3>
          <p className="text-purple-100 text-sm">Schedule with your preferred doctor</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer" onClick={onViewDoctors}>
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Find Doctors</h3>
          <p className="text-green-100 text-sm">Browse specialists by category</p>
        </CardContent>
      </Card>
    </div>
  );
}