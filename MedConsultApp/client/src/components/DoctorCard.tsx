import { Star, Clock, Video, MessageCircle, Phone } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
  onBookConsultation: (doctorId: string) => void;
  onViewProfile: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onBookConsultation, onViewProfile }: DoctorCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-primary/10">
              <AvatarImage src={doctor.profileImage} alt={doctor.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {doctor.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>
                <p className="text-xs text-gray-500">{doctor.experience} years experience</p>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                ${doctor.consultationFee}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{doctor.rating}</span>
                <span className="text-xs text-gray-500">({doctor.reviewCount})</span>
              </div>
              {doctor.isOnline && (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Online
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1 mt-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                Next available: {doctor.availableSlots[0] || 'No slots'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onViewProfile(doctor._id)}
        >
          View Profile
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => onBookConsultation(doctor._id)}
        >
          <Video className="h-4 w-4 mr-1" />
          Consult
        </Button>
      </CardFooter>
    </Card>
  );
}