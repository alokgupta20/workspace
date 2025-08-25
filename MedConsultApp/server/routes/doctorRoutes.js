const express = require('express');
const router = express.Router();
const DoctorService = require('../services/doctorService.js');
const { requireUser } = require('./middleware/auth.js');

// Get list of doctors with search and filters
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/doctors - Fetching doctors with filters:', req.query);

    const filters = {
      search: req.query.search,
      specialization: req.query.specialization,
      minRating: req.query.minRating,
      maxFee: req.query.maxFee,
      location: req.query.location,
      isOnline: req.query.isOnline
    };

    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const result = await DoctorService.list(filters, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in GET /api/doctors:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get available specializations
router.get('/specializations', async (req, res) => {
  try {
    console.log('GET /api/doctors/specializations - Fetching specializations');

    const specializations = await DoctorService.getSpecializations();

    res.json({
      success: true,
      data: { specializations }
    });
  } catch (error) {
    console.error('Error in GET /api/doctors/specializations:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/doctors/:id - Fetching doctor:', req.params.id);

    const doctor = await DoctorService.getById(req.params.id);

    res.json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    console.error('Error in GET /api/doctors/:id:', error.message);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Get available time slots for a doctor
router.get('/:id/time-slots', async (req, res) => {
  try {
    console.log('GET /api/doctors/:id/time-slots - Fetching time slots for doctor:', req.params.id);

    const { date, days } = req.query;
    const startDate = date ? new Date(date) : new Date();
    const numberOfDays = days ? parseInt(days) : 7;

    const slots = await DoctorService.getAvailableSlots(req.params.id, startDate, numberOfDays);

    res.json({
      success: true,
      data: { slots }
    });
  } catch (error) {
    console.error('Error in GET /api/doctors/:id/time-slots:', error.message);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Create doctor profile (protected route)
router.post('/', requireUser, async (req, res) => {
  try {
    console.log('POST /api/doctors - Creating doctor profile for user:', req.user._id);

    const doctorData = {
      ...req.body,
      userId: req.user._id,
      email: req.user.email
    };

    const doctor = await DoctorService.create(doctorData);

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: { doctor }
    });
  } catch (error) {
    console.error('Error in POST /api/doctors:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update doctor profile (protected route)
router.put('/:id', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/doctors/:id - Updating doctor:', req.params.id);

    const doctor = await DoctorService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: { doctor }
    });
  } catch (error) {
    console.error('Error in PUT /api/doctors/:id:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete doctor profile (protected route)
router.delete('/:id', requireUser, async (req, res) => {
  try {
    console.log('DELETE /api/doctors/:id - Deleting doctor:', req.params.id);

    await DoctorService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/doctors/:id:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;