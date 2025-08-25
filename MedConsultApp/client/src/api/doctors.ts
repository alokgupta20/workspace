import api from './api';
import { Doctor } from '@/types';

// Description: Get list of all doctors with filters
// Endpoint: GET /api/doctors
// Request: { specialization?: string, search?: string, minRating?: number, maxFee?: number, page?: number, limit?: number }
// Response: { success: boolean, data: { doctors: Doctor[], pagination: { page: number, limit: number, total: number, pages: number } } }
export const getDoctors = async (filters?: {
  specialization?: string;
  search?: string;
  minRating?: number;
  maxFee?: number;
  page?: number;
  limit?: number;
}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.specialization) params.append('specialization', filters.specialization);
    if (filters?.minRating) params.append('minRating', filters.minRating.toString());
    if (filters?.maxFee) params.append('maxFee', filters.maxFee.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/api/doctors${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get doctor by ID
// Endpoint: GET /api/doctors/:id
// Request: {}
// Response: { success: boolean, data: { doctor: Doctor } }
export const getDoctorById = async (id: string) => {
  try {
    const response = await api.get(`/api/doctors/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get available specializations
// Endpoint: GET /api/doctors/specializations
// Request: {}
// Response: { success: boolean, data: { specializations: string[] } }
export const getSpecializations = async () => {
  try {
    const response = await api.get('/api/doctors/specializations');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get available time slots for a doctor
// Endpoint: GET /api/doctors/:id/time-slots
// Request: { date?: string, days?: number }
// Response: { success: boolean, data: { slots: string[] } }
export const getDoctorTimeSlots = async (doctorId: string, date?: string, days?: number) => {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (days) params.append('days', days.toString());

    const queryString = params.toString();
    const url = `/api/doctors/${doctorId}/time-slots${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};