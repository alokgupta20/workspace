import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { DoctorCard } from '@/components/DoctorCard';
import { BookingModal } from '@/components/BookingModal';
import { useToast } from '@/hooks/useToast';
import { getDoctors, getSpecializations } from '@/api/doctors';
import { bookConsultation } from '@/api/consultations';
import { Doctor } from '@/types';

export function Doctors() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    minRating: '',
    maxFee: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
    loadSpecializations();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadDoctors();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const filterParams = {
        ...(filters.search && { search: filters.search }),
        ...(filters.specialization && { specialization: filters.specialization }),
        ...(filters.minRating && { minRating: parseFloat(filters.minRating) }),
        ...(filters.maxFee && { maxFee: parseFloat(filters.maxFee) })
      };

      const response = await getDoctors(filterParams);
      setDoctors(response.data.doctors);
    } catch (error: any) {
      console.error('Error loading doctors:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSpecializations = async () => {
    try {
      const response = await getSpecializations();
      setSpecializations(response.data.specializations);
    } catch (error: any) {
      console.error('Error loading specializations:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBookConsultation = (doctorId: string) => {
    const doctor = doctors.find(d => d._id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsBookingModalOpen(true);
    }
  };

  const handleViewProfile = (doctorId: string) => {
    navigate(`/doctors/${doctorId}`);
  };

  const handleBookingSubmit = async (data: {
    doctorId: string;
    type: 'video' | 'voice' | 'chat';
    scheduledAt: string;
    symptoms: string;
  }) => {
    try {
      const response = await bookConsultation(data) as any;
      if (response.success) {
        toast({
          title: "Success",
          description: "Consultation booked successfully!",
        });
        setIsBookingModalOpen(false);
        navigate('/consultations');
      }
    } catch (error: any) {
      console.error('Error booking consultation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      specialization: '',
      minRating: '',
      maxFee: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Doctor</h1>
        <p className="text-lg text-gray-600">
          Browse through our network of qualified healthcare professionals
        </p>
      </div>

      {/* Filters */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search doctors by name..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filters.specialization} onValueChange={(value) => setFilters(prev => ({ ...prev, specialization: value === "all" ? "" : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.minRating} onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value === "all" ? "" : value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={filters.maxFee} onValueChange={(value) => setFilters(prev => ({ ...prev, maxFee: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Max Fee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Fee</SelectItem>
                  <SelectItem value="50">Under $50</SelectItem>
                  <SelectItem value="100">Under $100</SelectItem>
                  <SelectItem value="150">Under $150</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `${doctors.length} doctors found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onBookConsultation={handleBookConsultation}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctor={selectedDoctor}
        onBook={handleBookingSubmit}
      />
    </div>
  );
}