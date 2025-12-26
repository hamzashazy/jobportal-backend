const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/jobs
// @desc    Create a job
// @access  Private (Employer)
router.post('/', auth, jobController.createJob);

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', jobController.getJobs);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', jobController.getJob);

// @route   PUT api/jobs/:id
// @desc    Update a job
// @access  Private (Employer)
router.put('/:id', auth, jobController.updateJob);

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private (Employer)
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router;
