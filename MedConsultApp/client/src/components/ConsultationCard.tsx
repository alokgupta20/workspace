import { Calendar, Clock, Video, MessageCircle, Phone, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Consultation } from '@/types';
import { format } from 'date-fns';

interface ConsultationCardProps {
  consultation: Consultation;
  onViewDetails: (consultationId: string) => void;
  onJoinCall?: (consultationId: string) => void;
}

export function ConsultationCard({ consultation, onViewDetails, onJoinCall }: ConsultationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ongoing': return 'bg-green-50 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'voice': return <Phone className="h-4 w-4" />;
      case 'chat': return <MessageCircle className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={consultation.doctor.profileImage} alt={consultation.doctor.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {consultation.doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{consultation.doctor.name}</h3>
              <p className="text-sm text-gray-600">{consultation.doctor.specialization}</p>
            </div>
          </div>
          <Badge className={getStatusColor(consultation.status)}>
            {consultation.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(consultation.scheduledAt), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(consultation.scheduledAt), 'hh:mm a')}</span>
          </div>
          <div className="flex items-center gap-1">
            {getTypeIcon(consultation.type)}
            <span className="capitalize">{consultation.type}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Symptoms:</span> {consultation.symptoms}
          </p>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(consultation._id)}
          >
            <FileText className="h-4 w-4 mr-1" />
            Details
          </Button>
          {consultation.status === 'ongoing' && onJoinCall && (
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              onClick={() => onJoinCall(consultation._id)}
            >
              {getTypeIcon(consultation.type)}
              <span className="ml-1">Join</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}