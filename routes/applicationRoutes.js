const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/applications/:jobId
// @desc    Apply for a job
// @access  Private (Job Seeker)
router.post('/:jobId', auth, applicationController.applyJob);

// @route   GET api/applications/job/:jobId
// @desc    Get applications for a job
// @access  Private (Employer)
router.get('/job/:jobId', auth, applicationController.getJobApplications);

// @route   PUT api/applications/:id/status
// @desc    Update application status
// @access  Private (Employer)
router.put('/:id/status', auth, applicationController.updateApplicationStatus);

// @route   GET api/applications/my
// @desc    Get my applications
// @access  Private (Job Seeker)
router.get('/my', auth, applicationController.getMyApplications);

module.exports = router;
