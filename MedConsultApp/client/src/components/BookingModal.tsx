import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Video, Phone, MessageCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Doctor } from '@/types';
import { format, addDays } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onBook: (data: {
    doctorId: string;
    type: 'video' | 'voice' | 'chat';
    scheduledAt: string;
    symptoms: string;
  }) => void;
}

export function BookingModal({ isOpen, onClose, doctor, onBook }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'voice' | 'chat'>('video');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'MMM dd, yyyy'),
        day: format(date, 'EEE')
      });
    }
    return dates;
  };

  const onSubmit = (data: any) => {
    if (!doctor || !selectedDate || !selectedTime) return;

    const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();

    onBook({
      doctorId: doctor._id,
      type: consultationType,
      scheduledAt,
      symptoms: data.symptoms
    });

    reset();
    setSelectedDate('');
    setSelectedTime('');
    onClose();
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={doctor.profileImage} alt={doctor.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Book Consultation</h2>
              <p className="text-sm text-gray-600">{doctor.name} - {doctor.specialization}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Consultation Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">Consultation Type</Label>
            <RadioGroup value={consultationType} onValueChange={(value: any) => setConsultationType(value)}>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                    <Video className="h-4 w-4 text-blue-600" />
                    Video Call
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="voice" id="voice" />
                  <Label htmlFor="voice" className="flex items-center gap-2 cursor-pointer">
                    <Phone className="h-4 w-4 text-green-600" />
                    Voice Call
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="chat" id="chat" />
                  <Label htmlFor="chat" className="flex items-center gap-2 cursor-pointer">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                    Chat
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">Select Date</Label>
            <div className="grid grid-cols-4 gap-2">
              {generateDates().map((date) => (
                <Button
                  key={date.value}
                  type="button"
                  variant={selectedDate === date.value ? "default" : "outline"}
                  className={`p-3 h-auto flex flex-col ${
                    selectedDate === date.value 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedDate(date.value)}
                >
                  <span className="text-xs">{date.day}</span>
                  <span className="text-sm font-medium">{date.label.split(',')[0]}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">Available Times</Label>
            <div className="grid grid-cols-4 gap-2">
              {doctor.availableSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  className={selectedTime === time ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-3">
            <Label htmlFor="symptoms" className="text-base font-medium text-gray-900">
              Describe your symptoms
            </Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe your symptoms, concerns, or reason for consultation..."
              className="min-h-[100px]"
              {...register('symptoms', { required: 'Please describe your symptoms' })}
            />
            {errors.symptoms && (
              <p className="text-sm text-red-600">{errors.symptoms.message as string}</p>
            )}
          </div>

          {/* Fee Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Consultation Fee:</span>
              <span className="text-xl font-semibold text-blue-600">${doctor.consultationFee}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!selectedDate || !selectedTime}
            >
              Book Consultation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}