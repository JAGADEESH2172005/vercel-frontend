const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob,
  saveJob,
  addReview,
  getJobReviews,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
  upload,
} = require('../controllers/jobController');
const { protect, owner, admin, jobseeker } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, owner, createJob)
  .get(getJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

router.route('/:id/applications')
  .get(protect, getJobApplications);

router.route('/:id/apply')
  .post(protect, jobseeker, upload.single('resume'), applyJob);

router.route('/:id/save')
  .post(protect, jobseeker, saveJob);

router.route('/:id/review')
  .post(protect, addReview);

router.route('/:id/reviews')
  .get(getJobReviews);

router.route('/applications/:id/status')
  .put(protect, updateApplicationStatus);

router.route('/applications/:id')
  .delete(protect, deleteApplication);

module.exports = router;