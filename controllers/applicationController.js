const Application = require('../models/Application');
const Job = require('../models/Job');

// Apply for a job
exports.applyJob = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ msg: 'Only job seekers can apply' });
    }

    const { resume } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ msg: 'Already applied to this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      resume
    });

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get applications for a specific job (Employer only)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the user is the employer who posted the job
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email profile')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update application status (Employer only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Check if the user is the employer who posted the job
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get my applications (Job Seeker)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location status',
        populate: { path: 'employer', select: 'name' }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
