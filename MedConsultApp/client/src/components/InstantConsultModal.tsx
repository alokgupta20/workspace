import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Video, Phone, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface InstantConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (data: { symptoms: string; type: 'video' | 'voice' | 'chat' }) => void;
  isLoading?: boolean;
}

export function InstantConsultModal({ isOpen, onClose, onStart, isLoading }: InstantConsultModalProps) {
  const [consultationType, setConsultationType] = useState<'video' | 'voice' | 'chat'>('video');
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data: any) => {
    onStart({
      symptoms: data.symptoms,
      type: consultationType
    });
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Start Instant Consultation
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Connect with an available doctor right now
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Consultation Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">Consultation Type</Label>
            <RadioGroup value={consultationType} onValueChange={(value: any) => setConsultationType(value)}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="video" id="instant-video" />
                  <Label htmlFor="instant-video" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Video className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Video Call</div>
                      <div className="text-sm text-gray-500">Face-to-face consultation</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="voice" id="instant-voice" />
                  <Label htmlFor="instant-voice" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Phone className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">Voice Call</div>
                      <div className="text-sm text-gray-500">Audio-only consultation</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="chat" id="instant-chat" />
                  <Label htmlFor="instant-chat" className="flex items-center gap-2 cursor-pointer flex-1">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium">Chat</div>
                      <div className="text-sm text-gray-500">Text-based consultation</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Symptoms */}
          <div className="space-y-3">
            <Label htmlFor="instant-symptoms" className="text-base font-medium text-gray-900">
              Describe your symptoms
            </Label>
            <Textarea
              id="instant-symptoms"
              placeholder="Please describe your symptoms or health concerns..."
              className="min-h-[100px]"
              {...register('symptoms', { required: 'Please describe your symptoms' })}
            />
            {errors.symptoms && (
              <p className="text-sm text-red-600">{errors.symptoms.message as string}</p>
            )}
          </div>

          {/* Queue Information */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Estimated wait time: 2-5 minutes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Start Consultation'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}