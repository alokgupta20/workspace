const Patient = require('../models/Patient.js');

class PatientService {
  static async create(patientData) {
    try {
      console.log('Creating new patient:', patientData.email);
      
      // Check if patient already exists for this user
      const existingPatient = await Patient.findOne({ userId: patientData.userId });
      if (existingPatient) {
        throw new Error('Patient profile already exists for this user');
      }

      const patient = new Patient(patientData);
      const savedPatient = await patient.save();
      
      console.log('Patient created successfully:', savedPatient._id);
      return savedPatient;
    } catch (error) {
      console.error('Error creating patient:', error.message);
      throw new Error(`Failed to create patient: ${error.message}`);
    }
  }

  static async list(filters = {}) {
    try {
      console.log('Fetching patients list with filters:', filters);
      
      const query = { isActive: true, ...filters };
      const patients = await Patient.find(query)
        .select('-__v')
        .sort({ createdAt: -1 });
      
      console.log(`Found ${patients.length} patients`);
      return patients;
    } catch (error) {
      console.error('Error fetching patients:', error.message);
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      console.log('Fetching patient by ID:', id);
      
      const patient = await Patient.findOne({ _id: id, isActive: true })
        .select('-__v');
      
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      console.log('Patient found:', patient.email);
      return patient;
    } catch (error) {
      console.error('Error fetching patient by ID:', error.message);
      throw new Error(`Failed to fetch patient: ${error.message}`);
    }
  }

  static async getByUserId(userId) {
    try {
      console.log('Fetching patient by user ID:', userId);
      
      const patient = await Patient.findOne({ userId, isActive: true })
        .select('-__v');
      
      if (!patient) {
        throw new Error('Patient profile not found');
      }
      
      console.log('Patient found for user:', patient.email);
      return patient;
    } catch (error) {
      console.error('Error fetching patient by user ID:', error.message);
      throw new Error(`Failed to fetch patient: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      console.log('Updating patient:', id);
      
      const patient = await Patient.findOneAndUpdate(
        { _id: id, isActive: true },
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-__v');
      
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      console.log('Patient updated successfully:', patient._id);
      return patient;
    } catch (error) {
      console.error('Error updating patient:', error.message);
      throw new Error(`Failed to update patient: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      console.log('Deleting patient:', id);
      
      const patient = await Patient.findOneAndUpdate(
        { _id: id, isActive: true },
        { $set: { isActive: false } },
        { new: true }
      );
      
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      console.log('Patient deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error.message);
      throw new Error(`Failed to delete patient: ${error.message}`);
    }
  }

  static async updateByUserId(userId, updateData) {
    try {
      console.log('Updating patient by user ID:', userId);
      
      const patient = await Patient.findOneAndUpdate(
        { userId, isActive: true },
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-__v');
      
      if (!patient) {
        throw new Error('Patient profile not found');
      }
      
      console.log('Patient updated successfully for user:', userId);
      return patient;
    } catch (error) {
      console.error('Error updating patient by user ID:', error.message);
      throw new Error(`Failed to update patient: ${error.message}`);
    }
  }
}

module.exports = PatientService;