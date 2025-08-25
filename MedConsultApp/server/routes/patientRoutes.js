const express = require('express');
const router = express.Router();
const PatientService = require('../services/patientService.js');
const { requireUser } = require('./middleware/auth.js');

// Create patient profile
router.post('/', requireUser, async (req, res) => {
  try {
    console.log('POST /api/patients - Creating patient profile for user:', req.user._id);
    
    const patientData = {
      ...req.body,
      userId: req.user._id,
      email: req.user.email
    };

    const patient = await PatientService.create(patientData);
    
    res.status(201).json({
      success: true,
      message: 'Patient profile created successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Error in POST /api/patients:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all patients (admin functionality)
router.get('/', requireUser, async (req, res) => {
  try {
    console.log('GET /api/patients - Fetching patients list');
    
    const patients = await PatientService.list();
    
    res.json({
      success: true,
      data: { patients }
    });
  } catch (error) {
    console.error('Error in GET /api/patients:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get current user's patient profile
router.get('/profile', requireUser, async (req, res) => {
  try {
    console.log('GET /api/patients/profile - Fetching profile for user:', req.user._id);
    
    const patient = await PatientService.getByUserId(req.user._id);
    
    res.json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    console.error('Error in GET /api/patients/profile:', error.message);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Update current user's patient profile
router.put('/profile', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/patients/profile - Updating profile for user:', req.user._id);
    
    const patient = await PatientService.updateByUserId(req.user._id, req.body);
    
    res.json({
      success: true,
      message: 'Patient profile updated successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Error in PUT /api/patients/profile:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get patient by ID
router.get('/:id', requireUser, async (req, res) => {
  try {
    console.log('GET /api/patients/:id - Fetching patient:', req.params.id);
    
    const patient = await PatientService.getById(req.params.id);
    
    res.json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    console.error('Error in GET /api/patients/:id:', error.message);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Update patient by ID
router.put('/:id', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/patients/:id - Updating patient:', req.params.id);
    
    const patient = await PatientService.update(req.params.id, req.body);
    
    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Error in PUT /api/patients/:id:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete patient by ID
router.delete('/:id', requireUser, async (req, res) => {
  try {
    console.log('DELETE /api/patients/:id - Deleting patient:', req.params.id);
    
    await PatientService.delete(req.params.id);
    
    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/patients/:id:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;