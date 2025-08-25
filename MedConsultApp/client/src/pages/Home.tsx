import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, TrendingUp, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuickActions } from '@/components/QuickActions';
import { ConsultationCard } from '@/components/ConsultationCard';
import { InstantConsultModal } from '@/components/InstantConsultModal';
import { useToast } from '@/hooks/useToast';
import { getConsultations, startInstantConsultation } from '@/api/consultations';
import { Consultation } from '@/types';

export function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const response = await getConsultations() as any;
      setConsultations(response.consultations);
    } catch (error) {
      console.error('Error loading consultations:', error);
      toast({
        title: "Error",
        description: "Failed to load consultations",
        variant: "destructive",
      });
    }
  };

  const handleInstantConsult = () => {
    setIsInstantModalOpen(true);
  };

  const handleBookAppointment = () => {
    navigate('/doctors');
  };

  const handleViewDoctors = () => {
    navigate('/doctors');
  };

  const handleStartInstantConsultation = async (data: { symptoms: string; type: 'video' | 'voice' | 'chat' }) => {
    setIsLoading(true);
    try {
      const response = await startInstantConsultation(data) as any;
      if (response.success) {
        toast({
          title: "Success",
          description: "Connected to doctor successfully!",
        });
        setIsInstantModalOpen(false);
        navigate('/consultation', { state: { consultation: response.consultation } });
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      toast({
        title: "Error",
        description: "Failed to start consultation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewConsultationDetails = (consultationId: string) => {
    navigate(`/consultation/${consultationId}`);
  };

  const handleJoinCall = (consultationId: string) => {
    navigate('/consultation', { state: { consultationId } });
  };

  const stats = [
    {
      title: "Total Consultations",
      value: "24",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "This Month",
      value: "8",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Saved Doctors",
      value: "5",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Avg Rating",
      value: "4.8",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to HealthCare
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with licensed doctors for instant consultations, book appointments, and manage your health records all in one place.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions
        onInstantConsult={handleInstantConsult}
        onBookAppointment={handleBookAppointment}
        onViewDoctors={handleViewDoctors}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Consultations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Recent Consultations</h2>
          <Button variant="outline" onClick={() => navigate('/consultations')}>
            View All
          </Button>
        </div>

        {consultations.length > 0 ? (
          <div className="grid gap-4">
            {consultations.slice(0, 3).map((consultation) => (
              <ConsultationCard
                key={consultation._id}
                consultation={consultation}
                onViewDetails={handleViewConsultationDetails}
                onJoinCall={handleJoinCall}
              />
            ))}
          </div>
        ) : (
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations yet</h3>
              <p className="text-gray-600 mb-4">Start your first consultation with our qualified doctors</p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleInstantConsult}
              >
                Start Consultation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Instant Consultation Modal */}
      <InstantConsultModal
        isOpen={isInstantModalOpen}
        onClose={() => setIsInstantModalOpen(false)}
        onStart={handleStartInstantConsultation}
        isLoading={isLoading}
      />
    </div>
  );
}