import api from './api';
import { Consultation, Appointment } from '@/types';

// Description: Book a new consultation
// Endpoint: POST /api/consultations/book
// Request: { doctorId: string, type: string, scheduledAt: string, symptoms: string }
// Response: { consultation: Consultation, success: boolean }
export const bookConsultation = (data: {
  doctorId: string;
  type: 'video' | 'voice' | 'chat';
  scheduledAt: string;
  symptoms: string;
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        consultation: {
          _id: Date.now().toString(),
          doctorId: data.doctorId,
          patientId: 'patient1',
          doctor: {
            _id: data.doctorId,
            name: 'Dr. Sarah Johnson',
            specialization: 'General Medicine',
            experience: 8,
            rating: 4.8,
            reviewCount: 156,
            consultationFee: 50,
            profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
            qualifications: ['MBBS', 'MD Internal Medicine'],
            languages: ['English', 'Spanish'],
            availableSlots: ['09:00', '10:00', '14:00', '15:00'],
            isOnline: true,
            bio: 'Experienced general practitioner with expertise in preventive care and chronic disease management.'
          },
          type: data.type,
          status: 'scheduled',
          scheduledAt: data.scheduledAt,
          duration: 30,
          symptoms: data.symptoms,
          fee: 50
        },
        success: true
      });
    }, 800);
  });
};

// Description: Get patient's consultations
// Endpoint: GET /api/consultations
// Request: {}
// Response: { consultations: Consultation[] }
export const getConsultations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        consultations: [
          {
            _id: '1',
            doctorId: '1',
            patientId: 'patient1',
            doctor: {
              _id: '1',
              name: 'Dr. Sarah Johnson',
              specialization: 'General Medicine',
              experience: 8,
              rating: 4.8,
              reviewCount: 156,
              consultationFee: 50,
              profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
              qualifications: ['MBBS', 'MD Internal Medicine'],
              languages: ['English', 'Spanish'],
              availableSlots: ['09:00', '10:00', '14:00', '15:00'],
              isOnline: true,
              bio: 'Experienced general practitioner with expertise in preventive care and chronic disease management.'
            },
            type: 'video',
            status: 'completed',
            scheduledAt: '2024-01-15T10:00:00Z',
            duration: 30,
            symptoms: 'Fever and headache',
            fee: 50,
            consultationNotes: 'Patient presented with mild fever. Prescribed rest and medication.'
          }
        ]
      });
    }, 400);
  });
};

// Description: Start instant consultation
// Endpoint: POST /api/consultations/instant
// Request: { symptoms: string, type: string }
// Response: { consultation: Consultation, success: boolean }
export const startInstantConsultation = (data: {
  symptoms: string;
  type: 'video' | 'voice' | 'chat';
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        consultation: {
          _id: Date.now().toString(),
          doctorId: '1',
          patientId: 'patient1',
          doctor: {
            _id: '1',
            name: 'Dr. Sarah Johnson',
            specialization: 'General Medicine',
            experience: 8,
            rating: 4.8,
            reviewCount: 156,
            consultationFee: 50,
            profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
            qualifications: ['MBBS', 'MD Internal Medicine'],
            languages: ['English', 'Spanish'],
            availableSlots: ['09:00', '10:00', '14:00', '15:00'],
            isOnline: true,
            bio: 'Experienced general practitioner with expertise in preventive care and chronic disease management.'
          },
          type: data.type,
          status: 'ongoing',
          scheduledAt: new Date().toISOString(),
          duration: 30,
          symptoms: data.symptoms,
          fee: 50
        },
        success: true
      });
    }, 1000);
  });
};