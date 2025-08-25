import api from './api';
import { Patient } from '@/types';

// Description: Get patient profile
// Endpoint: GET /api/patients/profile
// Request: {}
// Response: { success: boolean, data: { patient: Patient } }
export const getPatientProfile = async () => {
  try {
    return await api.get('/api/patients/profile');
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update patient profile
// Endpoint: PUT /api/patients/profile
// Request: { patient: Partial<Patient> }
// Response: { success: boolean, message: string, data: { patient: Patient } }
export const updatePatientProfile = async (data: Partial<Patient>) => {
  try {
    return await api.put('/api/patients/profile', data);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create patient profile
// Endpoint: POST /api/patients
// Request: { patient: Omit<Patient, '_id'> }
// Response: { success: boolean, message: string, data: { patient: Patient } }
export const createPatientProfile = async (data: Omit<Patient, '_id'>) => {
  try {
    return await api.post('/api/patients', data);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all patients
// Endpoint: GET /api/patients
// Request: {}
// Response: { success: boolean, data: { patients: Patient[] } }
export const getPatients = async () => {
  try {
    return await api.get('/api/patients');
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get patient by ID
// Endpoint: GET /api/patients/:id
// Request: {}
// Response: { success: boolean, data: { patient: Patient } }
export const getPatientById = async (id: string) => {
  try {
    return await api.get(`/api/patients/${id}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update patient by ID
// Endpoint: PUT /api/patients/:id
// Request: { patient: Partial<Patient> }
// Response: { success: boolean, message: string, data: { patient: Patient } }
export const updatePatientById = async (id: string, data: Partial<Patient>) => {
  try {
    return await api.put(`/api/patients/${id}`, data);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete patient by ID
// Endpoint: DELETE /api/patients/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deletePatientById = async (id: string) => {
  try {
    return await api.delete(`/api/patients/${id}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};