const Doctor = require('../models/Doctor.js');

class DoctorService {
  static async list(filters = {}, options = {}) {
    try {
      const {
        search,
        specialization,
        minRating,
        maxFee,
        location,
        isOnline,
        page = 1,
        limit = 10
      } = { ...filters, ...options };

      // Build query
      const query = { isActive: true, isVerified: true };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { specialization: { $regex: search, $options: 'i' } }
        ];
      }

      if (specialization) {
        query.specialization = specialization;
      }

      if (minRating) {
        query.rating = { $gte: parseFloat(minRating) };
      }

      if (maxFee) {
        query.consultationFee = { $lte: parseFloat(maxFee) };
      }

      if (location) {
        query.$or = [
          { 'location.city': { $regex: location, $options: 'i' } },
          { 'location.state': { $regex: location, $options: 'i' } }
        ];
      }

      if (isOnline !== undefined) {
        query.isOnline = isOnline;
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const doctors = await Doctor.find(query)
        .sort({ rating: -1, reviewCount: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      // Get total count for pagination
      const total = await Doctor.countDocuments(query);

      // Add available slots for each doctor
      const doctorsWithSlots = await Promise.all(
        doctors.map(async (doctor) => {
          const availableSlots = await this.getAvailableSlots(doctor._id, new Date());
          return {
            ...doctor.toJSON(),
            availableSlots: availableSlots.slice(0, 4) // Show first 4 slots
          };
        })
      );

      return {
        doctors: doctorsWithSlots,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      };
    } catch (err) {
      throw new Error(`Database error while listing doctors: ${err.message}`);
    }
  }

  static async getById(id) {
    try {
      const doctor = await Doctor.findOne({ _id: id, isActive: true }).exec();
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      return doctor;
    } catch (err) {
      throw new Error(`Database error while getting doctor by ID: ${err.message}`);
    }
  }

  static async getAvailableSlots(doctorId, date = new Date(), days = 7) {
    try {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      const slots = [];
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
        const workingHours = doctor.workingHours[dayName];

        if (workingHours && workingHours.isWorking && workingHours.start && workingHours.end) {
          const daySlots = this.generateTimeSlots(
            currentDate,
            workingHours.start,
            workingHours.end,
            doctor.consultationDuration || 30
          );
          slots.push(...daySlots);
        }
      }

      return slots;
    } catch (err) {
      throw new Error(`Error getting available slots: ${err.message}`);
    }
  }

  static generateTimeSlots(date, startTime, endTime, duration) {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const start = new Date(date);
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);

    const current = new Date(start);
    const now = new Date();

    while (current < end) {
      // Only add future slots
      if (current > now) {
        slots.push(current.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }));
      }
      current.setMinutes(current.getMinutes() + duration);
    }

    return slots;
  }

  static async getSpecializations() {
    try {
      const specializations = await Doctor.distinct('specialization', { 
        isActive: true, 
        isVerified: true 
      });
      return specializations.sort();
    } catch (err) {
      throw new Error(`Database error while getting specializations: ${err.message}`);
    }
  }

  static async create(doctorData) {
    try {
      const doctor = new Doctor(doctorData);
      await doctor.save();
      return doctor;
    } catch (err) {
      throw new Error(`Database error while creating doctor: ${err.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const doctor = await Doctor.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      return doctor;
    } catch (err) {
      throw new Error(`Database error while updating doctor: ${err.message}`);
    }
  }

  static async delete(id) {
    try {
      const result = await Doctor.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        { new: true }
      );
      
      if (!result) {
        throw new Error('Doctor not found');
      }
      
      return true;
    } catch (err) {
      throw new Error(`Database error while deleting doctor: ${err.message}`);
    }
  }
}

module.exports = DoctorService;