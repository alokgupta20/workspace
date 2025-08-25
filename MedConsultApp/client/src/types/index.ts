export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  profileImage: string;
  qualifications: string[];
  languages: string[];
  availableSlots: string[];
  isOnline: boolean;
  bio: string;
}

export interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  profileImage?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: {
    allergies: string[];
    currentMedications: string[];
    chronicConditions: string[];
    previousSurgeries: string[];
  };
}

export interface Consultation {
  _id: string;
  doctorId: string;
  patientId: string;
  doctor: Doctor;
  type: 'video' | 'voice' | 'chat';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  scheduledAt: string;
  duration: number;
  symptoms: string;
  prescription?: Prescription;
  consultationNotes?: string;
  fee: number;
}

export interface Prescription {
  _id: string;
  consultationId: string;
  medications: Medication[];
  instructions: string;
  followUpDate?: string;
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  doctor: Doctor;
  scheduledAt: string;
  type: 'video' | 'voice' | 'chat';
  status: 'scheduled' | 'completed' | 'cancelled';
  symptoms: string;
  fee: number;
}